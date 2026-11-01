// pi-mcp-client – MCP client extension for Pi coding agent.
// Connects to MCP servers (stdio / streamable-HTTP / SSE), bridges their tools
// into Pi, and exposes a /mcp slash command to manage connections.
//
// OAuth implementation modeled after opencode's approach:
// - Transport-level finishAuth() for code exchange
// - Shared localhost callback server with state/CSRF validation
// - Persistent auth storage bound to server URL

import type {
  AgentToolResult,
  ExtensionAPI,
  ExtensionContext,
  ExtensionCommandContext,
} from "@earendil-works/pi-coding-agent";
import { Type, type TSchema } from "typebox";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { UnauthorizedError } from "@modelcontextprotocol/sdk/client/auth.js";
import type { OAuthClientProvider } from "@modelcontextprotocol/sdk/client/auth.js";
import type {
  OAuthClientMetadata,
  OAuthTokens,
  OAuthClientInformationFull,
} from "@modelcontextprotocol/sdk/shared/auth.js";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createServer, type Server as HttpServer } from "node:http";
import { homedir } from "node:os";
import { exec as execCb } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(execCb);

// ─── TLS: use system trust store (for Zscaler/corporate CAs) ─────────
// Node.js ignores the OS trust store by default. We enable it so
// corporate root CAs (e.g. Zscaler) injected into the system store work.
// This must happen before any TLS connections.
import tls from "node:tls";

(function enableSystemTrustStore() {
  // --use-openssl-ca equivalent at runtime: read the system CA bundle
  // and merge with any NODE_EXTRA_CA_CERTS already loaded.
  const CA_PATHS = [
    "/etc/ssl/certs/ca-certificates.crt",   // Debian/Ubuntu
    "/etc/pki/tls/certs/ca-bundle.crt",     // RHEL/CentOS
    "/etc/ssl/cert.pem",                     // Alpine/macOS
    "/etc/ssl/certs/ca-bundle.crt",          // openSUSE
  ];
  const extraCerts: string[] = [];

  // Load system CA bundle
  for (const caPath of CA_PATHS) {
    if (existsSync(caPath)) {
      try {
        extraCerts.push(readFileSync(caPath, "utf-8"));
      } catch {}
      break;
    }
  }

  // Preserve NODE_EXTRA_CA_CERTS (e.g., nono intercept CA)
  const extraCaEnv = process.env.NODE_EXTRA_CA_CERTS;
  if (extraCaEnv && existsSync(extraCaEnv)) {
    try {
      extraCerts.push(readFileSync(extraCaEnv, "utf-8"));
    } catch {}
  }

  if (extraCerts.length > 0) {
    const combined = extraCerts.join("\n");
    // Monkey-patch tls.createSecureContext to inject system CAs
    const origCreateSecureContext = tls.createSecureContext;
    (tls as any).createSecureContext = function (options: any = {}) {
      if (!options.ca) {
        options = { ...options, ca: combined };
      }
      return origCreateSecureContext(options);
    };
  }
})();

// ─── Config types ────────────────────────────────────────────────────

interface McpServerConfig {
  name: string;
  transport: "stdio" | "sse" | "streamable-http" | "remote" | "local";
  // stdio / local
  command?: string | string[];
  args?: string[];
  env?: Record<string, string>;
  cwd?: string;
  // sse / streamable-http / remote
  url?: string;
  headers?: Record<string, string>;
  // OAuth (for remote transports) – set to false to disable
  oauth?: {
    clientId?: string;
    clientSecret?: string;
    scope?: string;
    callbackPort?: number;
    redirectUri?: string;
  } | false;
  toolPrefix?: string;
  autoConnect?: boolean;
  enabled?: boolean;
  timeout?: number;
}

interface McpsConfig {
  servers: Record<string, McpServerConfig>;
}

// ─── Paths ──────────────────────────────────────────────────────────

const PI_DIR = join(homedir(), ".pi", "agent");
const MCPS_CONFIG_PATH = join(PI_DIR, "mcps.json");
const MCP_AUTH_PATH = join(PI_DIR, "mcp-auth.json");

// ─── Config loader ──────────────────────────────────────────────────

function loadConfig(): McpsConfig {
  if (!existsSync(MCPS_CONFIG_PATH)) return { servers: {} };
  try {
    return JSON.parse(readFileSync(MCPS_CONFIG_PATH, "utf-8"));
  } catch (err) {
    console.warn(`[mcp] Failed to parse ${MCPS_CONFIG_PATH}: ${err instanceof Error ? err.message : err}`);
    return { servers: {} };
  }
}

function saveConfig(config: McpsConfig): void {
  writeFileSync(MCPS_CONFIG_PATH, JSON.stringify(config, null, 2) + "\n", "utf-8");
}

// ─── Auth persistence (modeled after opencode's mcp-auth.json) ──────

interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number; // seconds since epoch
  scope?: string;
}

interface AuthClientInfo {
  clientId: string;
  clientSecret?: string;
  clientIdIssuedAt?: number;
  clientSecretExpiresAt?: number;
}

interface AuthEntry {
  tokens?: AuthTokens;
  clientInfo?: AuthClientInfo;
  codeVerifier?: string;
  oauthState?: string;
  serverUrl?: string;
  lastConnectedAt?: number; // epoch seconds, set by Pi sessions on successful connect
}

type AuthData = Record<string, AuthEntry>;

function readAuthData(): AuthData {
  if (!existsSync(MCP_AUTH_PATH)) return {};
  try { return JSON.parse(readFileSync(MCP_AUTH_PATH, "utf-8")); } catch { return {}; }
}

function writeAuthData(data: AuthData): void {
  writeFileSync(MCP_AUTH_PATH, JSON.stringify(data, null, 2) + "\n", { encoding: "utf-8", mode: 0o600 });
}

function getAuthEntry(mcpName: string, serverUrl?: string): AuthEntry | undefined {
  const data = readAuthData();
  const entry = data[mcpName];
  if (!entry) return undefined;
  // Validate URL binding – if the server URL changed, credentials are stale
  if (serverUrl && entry.serverUrl && entry.serverUrl !== serverUrl) return undefined;
  return entry;
}

function updateAuthEntry(mcpName: string, update: Partial<AuthEntry>, serverUrl?: string): void {
  const data = readAuthData();
  const entry = data[mcpName] ?? {};
  Object.assign(entry, update);
  if (serverUrl) entry.serverUrl = serverUrl;
  data[mcpName] = entry;
  writeAuthData(data);
}

function removeAuthEntry(mcpName: string): void {
  const data = readAuthData();
  delete data[mcpName];
  writeAuthData(data);
}

// ─── OAuth callback server (shared, state-keyed) ────────────────────

const OAUTH_CALLBACK_PORT = 19876;
const OAUTH_CALLBACK_PATH = "/mcp/oauth/callback";
const CALLBACK_TIMEOUT_MS = 5 * 60_000; // 5 minutes

interface PendingAuth {
  resolve: (code: string) => void;
  reject: (err: Error) => void;
  timeout: ReturnType<typeof setTimeout>;
}

let callbackServer: HttpServer | undefined;
const pendingAuths = new Map<string, PendingAuth>();
const mcpNameToState = new Map<string, string>();

function cleanupStateIndex(oauthState: string) {
  for (const [name, state] of mcpNameToState) {
    if (state === oauthState) { mcpNameToState.delete(name); break; }
  }
}

function stopCallbackServerIfIdle() {
  if (pendingAuths.size > 0 || !callbackServer) return;
  callbackServer.close();
  callbackServer = undefined;
}

function handleCallbackRequest(req: import("node:http").IncomingMessage, res: import("node:http").ServerResponse) {
  const url = new URL(req.url || "/", `http://localhost:${OAUTH_CALLBACK_PORT}`);
  // Accept any path that has OAuth params – some servers redirect to different paths
  if (!url.searchParams.has("code") && !url.searchParams.has("error") && !url.searchParams.has("state")) {
    res.writeHead(404); res.end("Not found"); return;
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const errorDesc = url.searchParams.get("error_description");

  if (!state) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.end("<html><body><h2>Error</h2><p>Missing state parameter</p></body></html>");
    return;
  }

  if (error) {
    const msg = errorDesc || error;
    const pending = pendingAuths.get(state);
    if (pending) {
      clearTimeout(pending.timeout);
      pendingAuths.delete(state);
      cleanupStateIndex(state);
      pending.reject(new Error(msg));
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`<html><body><h2>OAuth Error</h2><p>${msg}</p></body></html>`);
    stopCallbackServerIfIdle();
    return;
  }

  if (!code) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.end("<html><body><h2>Error</h2><p>No authorization code</p></body></html>");
    return;
  }

  if (!pendingAuths.has(state)) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.end("<html><body><h2>Error</h2><p>Invalid or expired state</p></body></html>");
    return;
  }

  const pending = pendingAuths.get(state)!;
  clearTimeout(pending.timeout);
  pendingAuths.delete(state);
  cleanupStateIndex(state);
  pending.resolve(code);

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end("<html><body><h2>Authenticated!</h2><p>You can close this tab and return to Pi.</p></body></html>");
  stopCallbackServerIfIdle();
}

async function ensureCallbackServer(): Promise<void> {
  if (callbackServer) return;
  callbackServer = createServer(handleCallbackRequest);
  await new Promise<void>((resolve, reject) => {
    callbackServer!.listen(OAUTH_CALLBACK_PORT, "127.0.0.1", () => resolve());
    callbackServer!.on("error", reject);
  });
}

function waitForCallback(oauthState: string, mcpName: string): Promise<string> {
  mcpNameToState.set(mcpName, oauthState);
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      pendingAuths.delete(oauthState);
      mcpNameToState.delete(mcpName);
      reject(new Error("OAuth callback timeout"));
      stopCallbackServerIfIdle();
    }, CALLBACK_TIMEOUT_MS);
    pendingAuths.set(oauthState, { resolve, reject, timeout });
  });
}

function cancelPendingAuth(mcpName: string): void {
  const state = mcpNameToState.get(mcpName);
  const key = state ?? mcpName;
  const pending = pendingAuths.get(key);
  if (pending) {
    clearTimeout(pending.timeout);
    pendingAuths.delete(key);
    mcpNameToState.delete(mcpName);
    pending.reject(new Error("Cancelled"));
    stopCallbackServerIfIdle();
  }
}

// ─── OAuth provider (modeled after opencode's McpOAuthProvider) ──────

function generateState(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

class PiOAuthProvider implements OAuthClientProvider {
  private pendingRedirectUrl: URL | null = null;

  constructor(
    private mcpName: string,
    private serverUrl: string,
    private config: { clientId?: string; clientSecret?: string; scope?: string },
    private onRedirect: (url: URL) => void | Promise<void>,
  ) {}

  get redirectUrl(): string {
    return `http://127.0.0.1:${OAUTH_CALLBACK_PORT}${OAUTH_CALLBACK_PATH}`;
  }

  get clientMetadata(): OAuthClientMetadata {
    return {
      redirect_uris: [new URL(this.redirectUrl)],
      client_name: "Pi MCP Client",
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: this.config.clientSecret ? "client_secret_post" : "none",
      ...(this.config.scope ? { scope: this.config.scope } : {}),
    };
  }

  async clientInformation(): Promise<{ client_id: string; client_secret?: string } | undefined> {
    if (this.config.clientId) {
      return { client_id: this.config.clientId, ...(this.config.clientSecret ? { client_secret: this.config.clientSecret } : {}) };
    }
    const entry = getAuthEntry(this.mcpName, this.serverUrl);
    if (entry?.clientInfo) {
      if (entry.clientInfo.clientSecretExpiresAt && entry.clientInfo.clientSecretExpiresAt < Date.now() / 1000) return undefined;
      return { client_id: entry.clientInfo.clientId, ...(entry.clientInfo.clientSecret ? { client_secret: entry.clientInfo.clientSecret } : {}) };
    }
    return undefined;
  }

  async saveClientInformation(info: OAuthClientInformationFull): Promise<void> {
    updateAuthEntry(this.mcpName, {
      clientInfo: {
        clientId: info.client_id,
        clientSecret: info.client_secret,
        clientIdIssuedAt: info.client_id_issued_at,
        clientSecretExpiresAt: info.client_secret_expires_at,
      },
    }, this.serverUrl);
  }

  async tokens(): Promise<OAuthTokens | undefined> {
    const entry = getAuthEntry(this.mcpName, this.serverUrl);
    if (!entry?.tokens) return undefined;
    return {
      access_token: entry.tokens.accessToken,
      token_type: "Bearer",
      refresh_token: entry.tokens.refreshToken,
      expires_in: entry.tokens.expiresAt ? Math.max(0, Math.floor(entry.tokens.expiresAt - Date.now() / 1000)) : undefined,
      scope: entry.tokens.scope,
    };
  }

  async saveTokens(tokens: OAuthTokens): Promise<void> {
    updateAuthEntry(this.mcpName, {
      tokens: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: tokens.expires_in ? Date.now() / 1000 + tokens.expires_in : undefined,
        scope: tokens.scope,
      },
    }, this.serverUrl);
  }

  async redirectToAuthorization(authorizationUrl: URL): Promise<void> {
    this.pendingRedirectUrl = authorizationUrl;
    await this.onRedirect(authorizationUrl);
  }

  async saveCodeVerifier(codeVerifier: string): Promise<void> {
    updateAuthEntry(this.mcpName, { codeVerifier });
  }

  async codeVerifier(): Promise<string> {
    const entry = getAuthEntry(this.mcpName);
    if (!entry?.codeVerifier) throw new Error(`No code verifier saved for: ${this.mcpName}`);
    return entry.codeVerifier;
  }

  async state(): Promise<string> {
    const entry = getAuthEntry(this.mcpName);
    if (entry?.oauthState) return entry.oauthState;
    const newState = generateState();
    updateAuthEntry(this.mcpName, { oauthState: newState });
    return newState;
  }

  async invalidateCredentials(type: "all" | "client" | "tokens"): Promise<void> {
    if (type === "all") { removeAuthEntry(this.mcpName); return; }
    const data = readAuthData();
    const entry = data[this.mcpName];
    if (!entry) return;
    if (type === "client") delete entry.clientInfo;
    if (type === "tokens") delete entry.tokens;
    writeAuthData(data);
  }

  getPendingRedirectUrl(): URL | null { return this.pendingRedirectUrl; }
}

// ─── Helpers ────────────────────────────────────────────────────────

function isRemote(config: McpServerConfig): boolean {
  return ["sse", "streamable-http", "remote"].includes(config.transport);
}

function isLocal(config: McpServerConfig): boolean {
  return ["stdio", "local"].includes(config.transport);
}

function getCommand(config: McpServerConfig): { cmd: string; args: string[] } {
  if (Array.isArray(config.command)) {
    const [cmd, ...args] = config.command;
    return { cmd, args };
  }
  return { cmd: config.command ?? "", args: config.args ?? [] };
}

type AuthStatus = "authenticated" | "expired" | "not_authenticated";

function getAuthStatus(mcpName: string, serverUrl?: string): AuthStatus {
  const entry = getAuthEntry(mcpName, serverUrl);
  if (!entry?.tokens) return "not_authenticated";
  if (entry.tokens.expiresAt && entry.tokens.expiresAt < Date.now() / 1000) return "expired";
  return "authenticated";
}

// ─── MCP Client Manager ────────────────────────────────────────────

interface ConnectedServer {
  name: string;
  config: McpServerConfig;
  client: Client;
  transport: any;
  tools: McpToolDef[];
  registeredToolNames: string[];
}

interface McpToolDef {
  name: string;
  description: string;
  inputSchema: any;
}

type ServerStatus =
  | { status: "connected" }
  | { status: "disabled" }
  | { status: "needs_auth" }
  | { status: "needs_client_registration"; error: string }
  | { status: "failed"; error: string };

const connectedServers = new Map<string, ConnectedServer>();
const serverStatuses = new Map<string, ServerStatus>();
const pendingOAuthTransports = new Map<string, { transport: StreamableHTTPClientTransport | SSEClientTransport }>();

function prefixedToolName(serverName: string, config: McpServerConfig, toolName: string): string {
  const prefix = (config.toolPrefix ?? serverName).replace(/[^a-zA-Z0-9_]/g, "_");
  return `${prefix}__${toolName}`;
}

function jsonSchemaToTypebox(schema: any): TSchema {
  if (!schema || typeof schema !== "object") return Type.Any();
  if (schema.type === "object" && schema.properties) {
    const props: Record<string, TSchema> = {};
    const required = new Set(schema.required ?? []);
    for (const [key, val] of Object.entries(schema.properties)) {
      const converted = jsonSchemaToTypebox(val as any);
      props[key] = required.has(key) ? converted : Type.Optional(converted);
    }
    return Type.Object(props);
  }
  switch (schema.type) {
    case "string":
      if (schema.enum) return Type.Union(schema.enum.map((v: string) => Type.Literal(v)));
      return Type.String(schema.description ? { description: schema.description } : {});
    case "number": case "integer":
      return schema.type === "integer" ? Type.Integer() : Type.Number();
    case "boolean": return Type.Boolean();
    case "array": return Type.Array(schema.items ? jsonSchemaToTypebox(schema.items) : Type.Any());
    case "null": return Type.Null();
    default:
      if (schema.anyOf) return Type.Union(schema.anyOf.map(jsonSchemaToTypebox));
      if (schema.oneOf) return Type.Union(schema.oneOf.map(jsonSchemaToTypebox));
      return Type.Any();
  }
}

function openBrowser(url: string, notify: NotifyFn): void {
  const openCmd = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  execAsync(`${openCmd} '${url}'`).catch(() => {
    notify(`Open this URL in your browser:\n${url}`, "info");
  });
}

type NotifyFn = (msg: string, type?: "info" | "warning" | "error") => void;

const DEFAULT_TIMEOUT = 30_000;

async function connectRemote(
  serverName: string,
  config: McpServerConfig,
  notify: NotifyFn,
): Promise<{ client?: Client; status: ServerStatus }> {
  if (!config.url) return { status: { status: "failed", error: `No URL for "${serverName}"` } };

  const url = new URL(config.url);
  const oauthDisabled = config.oauth === false;
  const oauthConfig = typeof config.oauth === "object" ? config.oauth : undefined;
  const timeout = config.timeout ?? DEFAULT_TIMEOUT;

  let authProvider: PiOAuthProvider | undefined;
  let capturedRedirectUrl: URL | undefined;

  if (!oauthDisabled) {
    authProvider = new PiOAuthProvider(
      serverName,
      config.url,
      {
        clientId: oauthConfig?.clientId,
        clientSecret: oauthConfig?.clientSecret,
        scope: oauthConfig?.scope,
      },
      async (redirectUrl) => { capturedRedirectUrl = redirectUrl; },
    );
  }

  // Try StreamableHTTP first, then SSE (like opencode)
  const transports: Array<{ name: string; create: () => StreamableHTTPClientTransport | SSEClientTransport }> = [
    {
      name: "StreamableHTTP",
      create: () => new StreamableHTTPClientTransport(url, {
        authProvider,
        requestInit: config.headers ? { headers: config.headers } : undefined,
      }),
    },
    {
      name: "SSE",
      create: () => new SSEClientTransport(url, {
        authProvider,
        requestInit: config.headers ? { headers: config.headers } : undefined,
      }),
    },
  ];

  let lastStatus: ServerStatus | undefined;

  for (const { name, create } of transports) {
    const transport = create();
    try {
      const client = new Client({ name: "pi-mcp-client", version: "0.1.0" });
      await Promise.race([
        client.connect(transport),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Connection timeout")), timeout)),
      ]);
      return { client, status: { status: "connected" } };
    } catch (err: any) {
      const isAuthError = err instanceof UnauthorizedError || err?.message?.includes("Unauthorized");

      if (isAuthError) {
        if (err.message?.includes("registration") || err.message?.includes("client_id")) {
          lastStatus = { status: "needs_client_registration", error: "Server requires pre-registered client ID" };
        } else {
          pendingOAuthTransports.set(serverName, { transport });
          lastStatus = { status: "needs_auth" };
        }
        break; // Don't try other transports for auth errors
      }

      lastStatus = { status: "failed", error: `${name}: ${err.message}` };
      try { await transport.close(); } catch {}
    }
  }

  return { status: lastStatus ?? { status: "failed", error: "Unknown error" } };
}

async function connectServer(
  serverName: string,
  config: McpServerConfig,
  pi: ExtensionAPI,
  notify: NotifyFn,
  promptForCode?: () => Promise<string | undefined>,
): Promise<ConnectedServer> {
  if (connectedServers.has(serverName)) {
    throw new Error(`Server "${serverName}" is already connected`);
  }

  let client: Client;

  if (isLocal(config)) {
    const { cmd, args } = getCommand(config);
    if (!cmd) throw new Error(`Server "${serverName}": no command specified`);

    const transport = new StdioClientTransport({
      command: cmd,
      args,
      env: config.env ? { ...process.env, ...config.env } as Record<string, string> : undefined,
      cwd: config.cwd,
      stderr: "pipe",
    });

    client = new Client({ name: "pi-mcp-client", version: "0.1.0" });
    const timeout = config.timeout ?? DEFAULT_TIMEOUT;
    await Promise.race([
      client.connect(transport),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Connection timeout")), timeout)),
    ]);
  } else {
    const result = await connectRemote(serverName, config, notify);
    serverStatuses.set(serverName, result.status);

    if (result.status.status === "needs_auth") {
      // Run the full auth flow interactively
      notify("Authentication required. Starting OAuth flow...", "info");
      const status = await authenticateServer(serverName, config, notify, promptForCode);
      if (status.status !== "connected") {
        throw new Error(`Authentication failed: ${"error" in status ? status.error : status.status}`);
      }
      // After auth, the server should be in connectedServers
      const srv = connectedServers.get(serverName);
      if (srv) return srv;
      throw new Error("Authentication succeeded but server not connected");
    }

    if (result.status.status !== "connected" || !result.client) {
      throw new Error("error" in result.status ? result.status.error : result.status.status);
    }
    client = result.client;
  }

  // List tools
  const toolsResult = await client.listTools();
  const tools: McpToolDef[] = (toolsResult.tools ?? []).map((t: any) => ({
    name: t.name,
    description: t.description ?? "",
    inputSchema: t.inputSchema ?? {},
  }));

  // Register tools in Pi
  const registeredToolNames: string[] = [];
  for (const tool of tools) {
    const piToolName = prefixedToolName(serverName, config, tool.name);
    const params = jsonSchemaToTypebox(tool.inputSchema);
    registeredToolNames.push(piToolName);

    pi.registerTool({
      name: piToolName,
      label: `${serverName}: ${tool.name}`,
      description: tool.description || `MCP tool "${tool.name}" from server "${serverName}"`,
      promptSnippet: `MCP tool from ${serverName}: ${tool.description || tool.name}`,
      parameters: params,
      async execute(_callId: string, toolParams: any, _signal: AbortSignal | undefined, _onUpdate: any, _ctx: ExtensionContext): Promise<AgentToolResult> {
        const result = await client.callTool({ name: tool.name, arguments: toolParams });
        const content: { type: "text"; text: string }[] = [];
        if (result.content && Array.isArray(result.content)) {
          for (const item of result.content as any[]) {
            if (item.type === "text") content.push({ type: "text", text: item.text });
            else if (item.type === "image") content.push({ type: "text", text: `[Image: ${item.mimeType ?? "image"}]` });
            else if (item.type === "resource") content.push({ type: "text", text: item.resource?.text ?? JSON.stringify(item) });
            else content.push({ type: "text", text: JSON.stringify(item) });
          }
        }
        if (content.length === 0) {
          content.push({ type: "text", text: result.isError ? "Tool returned an error with no content" : "Tool completed with no output" });
        }
        return { content, details: undefined };
      },
    });
  }

  const server: ConnectedServer = { name: serverName, config, client, transport: client, tools, registeredToolNames };
  connectedServers.set(serverName, server);
  serverStatuses.set(serverName, { status: "connected" });

  // Persist connection state so other Pi sessions can auto-connect
  updateAuthEntry(serverName, { lastConnectedAt: Math.floor(Date.now() / 1000) }, config.url);
  return server;
}

async function authenticateServer(
  serverName: string,
  config: McpServerConfig,
  notify: NotifyFn,
  promptForCode?: () => Promise<string | undefined>,
): Promise<ServerStatus> {
  if (!config.url) return { status: "failed", error: "No URL" };
  const oauthConfig = typeof config.oauth === "object" ? config.oauth : undefined;

  await ensureCallbackServer();

  let capturedUrl: URL | undefined;
  const authProvider = new PiOAuthProvider(
    serverName,
    config.url,
    {
      clientId: oauthConfig?.clientId,
      clientSecret: oauthConfig?.clientSecret,
      scope: oauthConfig?.scope,
    },
    async (url) => { capturedUrl = url; },
  );

  const transport = new StreamableHTTPClientTransport(new URL(config.url), {
    authProvider,
    requestInit: config.headers ? { headers: config.headers } : undefined,
  });

  // Try connecting – may succeed if already have valid tokens
  try {
    const client = new Client({ name: "pi-mcp-client", version: "0.1.0" });
    await client.connect(transport);
    // Already authenticated!
    const data = readAuthData();
    if (data[serverName]) { delete data[serverName].oauthState; writeAuthData(data); }
    return { status: "connected" };
  } catch (err: any) {
    if (!(err instanceof UnauthorizedError) && !err.message?.includes("Unauthorized")) {
      return { status: "failed", error: err.message };
    }
  }

  // Need browser auth
  if (!capturedUrl) return { status: "failed", error: "No authorization URL received" };

  pendingOAuthTransports.set(serverName, { transport });

  // Extract the state the SDK put into the authorization URL
  const sdkState = capturedUrl.searchParams.get("state");
  if (!sdkState) return { status: "failed", error: "No state in authorization URL" };

  const callbackPromise = waitForCallback(sdkState, serverName);

  notify("Authorize in your browser:", "info");
  notify(capturedUrl.toString(), "info");
  openBrowser(capturedUrl.toString(), notify);

  notify("Waiting for authorization...", "info");

  let code: string;
  // Race: localhost callback vs manual code entry
  const manualPromise = promptForCode
    ? promptForCode().then(input => {
        if (!input) return undefined;
        if (input.startsWith("http")) {
          try { return new URL(input).searchParams.get("code") ?? input; } catch {}
        }
        return input;
      })
    : new Promise<undefined>(() => {}); // never resolves if no prompt available

  try {
    const result = await Promise.race([callbackPromise, manualPromise]);
    if (!result) return { status: "failed", error: "No code received" };
    code = result;
  } catch (err: any) {
    return { status: "failed", error: err.message };
  }

  // Use transport.finishAuth()
  const pending = pendingOAuthTransports.get(serverName);
  if (!pending) return { status: "failed", error: "No pending OAuth transport" };

  try {
    await pending.transport.finishAuth(code);
  } catch (err: any) {
    return { status: "failed", error: `OAuth completion failed: ${err.message}` };
  }

  // Clear code verifier
  const data = readAuthData();
  if (data[serverName]) { delete data[serverName].codeVerifier; writeAuthData(data); }
  pendingOAuthTransports.delete(serverName);

  notify("Authentication successful!", "info");

  // Now reconnect
  const result = await connectRemote(serverName, config, notify);
  return result.status;
}

async function disconnectServer(serverName: string): Promise<void> {
  const server = connectedServers.get(serverName);
  if (!server) throw new Error(`Server "${serverName}" is not connected`);
  try { await server.client.close(); } catch {}
  connectedServers.delete(serverName);
  serverStatuses.set(serverName, { status: "disabled" });
  cancelPendingAuth(serverName);
}

// ─── Slash command ──────────────────────────────────────────────────

const SUBCOMMANDS = ["connect", "disconnect", "add", "remove", "tools", "status", "auth", "logout"];

function formatServerStatus(name: string, config: McpServerConfig): string {
  const st = serverStatuses.get(name);
  const connected = connectedServers.has(name);
  let statusIcon = "⚪"; let statusText = "not initialized";

  if (connected) { statusIcon = "🟢"; statusText = "connected"; }
  else if (st?.status === "needs_auth") { statusIcon = "🔐"; statusText = "needs auth"; }
  else if (st?.status === "needs_client_registration") { statusIcon = "❌"; statusText = "needs client ID"; }
  else if (st?.status === "failed") { statusIcon = "❌"; statusText = `failed: ${st.error}`; }
  else if (st?.status === "disabled" || config.enabled === false) { statusIcon = "⚪"; statusText = "disabled"; }

  const transport = config.transport;
  const auto = config.autoConnect ? " (auto)" : "";
  const toolCount = connected ? ` – ${connectedServers.get(name)!.tools.length} tools` : "";
  return `  ${statusIcon} ${name}: ${statusText} | ${transport}${auto}${toolCount}`;
}

async function handleMcpCommand(args: string, ctx: ExtensionCommandContext, pi: ExtensionAPI): Promise<void> {
  const parts = args.trim().split(/\s+/);
  const sub = parts[0] || "status";
  const rest = parts.slice(1).join(" ").trim();

  switch (sub) {
    case "status":
    case "list": {
      const config = loadConfig();
      const names = Object.keys(config.servers);
      if (names.length === 0) { ctx.ui.notify("No MCP servers configured. Use /mcp add to add one.", "info"); return; }
      const lines = names.map(n => formatServerStatus(n, config.servers[n]));
      ctx.ui.notify(`MCP Servers:\n${lines.join("\n")}`, "info");
      return;
    }

    case "connect": {
      const serverName = rest;
      if (!serverName) { ctx.ui.notify("Usage: /mcp connect <server-name>", "warning"); return; }
      const config = loadConfig();
      const serverConfig = config.servers[serverName];
      if (!serverConfig) { ctx.ui.notify(`Server "${serverName}" not found in mcps.json`, "error"); return; }
      if (connectedServers.has(serverName)) { ctx.ui.notify(`"${serverName}" is already connected`, "warning"); return; }
      try {
        ctx.ui.notify(`Connecting to "${serverName}"...`, "info");
        const server = await connectServer(serverName, serverConfig, pi, ctx.ui.notify.bind(ctx.ui), () => ctx.ui.input("Paste the full callback URL from your browser", ""));
        ctx.ui.notify(`Connected to "${serverName}" – ${server.tools.length} tools available`, "info");
      } catch (err: any) {
        ctx.ui.notify(`Failed to connect to "${serverName}": ${err.message}`, "error");
      }
      return;
    }

    case "disconnect": {
      if (!rest) { ctx.ui.notify("Usage: /mcp disconnect <name>", "warning"); return; }
      try { await disconnectServer(rest); ctx.ui.notify(`Disconnected from "${rest}"`, "info"); }
      catch (err: any) { ctx.ui.notify(err.message, "error"); }
      return;
    }

    case "auth": {
      const serverName = rest;
      if (!serverName) {
        // Show auth status for all OAuth servers
        const config = loadConfig();
        const lines: string[] = [];
        for (const [name, cfg] of Object.entries(config.servers)) {
          if (!isRemote(cfg) || cfg.oauth === false) continue;
          const status = getAuthStatus(name, cfg.url);
          const icon = status === "authenticated" ? "✓" : status === "expired" ? "⚠" : "✗";
          lines.push(`  ${icon} ${name}: ${status}`);
        }
        ctx.ui.notify(lines.length ? `OAuth status:\n${lines.join("\n")}` : "No OAuth-capable servers configured", "info");
        return;
      }
      const config = loadConfig();
      const serverConfig = config.servers[serverName];
      if (!serverConfig) { ctx.ui.notify(`Server "${serverName}" not found`, "error"); return; }
      if (!isRemote(serverConfig) || serverConfig.oauth === false) {
        ctx.ui.notify(`"${serverName}" is not an OAuth-capable remote server`, "error"); return;
      }
      try {
        ctx.ui.notify(`Starting OAuth for "${serverName}"...`, "info");
        const status = await authenticateServer(serverName, serverConfig, ctx.ui.notify.bind(ctx.ui), () => ctx.ui.input("Paste the full callback URL from your browser", ""));
        if (status.status === "connected") {
          // Now do full connect to register tools
          if (!connectedServers.has(serverName)) {
            const server = await connectServer(serverName, serverConfig, pi, ctx.ui.notify.bind(ctx.ui), () => ctx.ui.input("Paste the full callback URL from your browser", ""));
            ctx.ui.notify(`Authenticated and connected – ${server.tools.length} tools available`, "info");
          } else {
            ctx.ui.notify("Authentication successful!", "info");
          }
        } else {
          ctx.ui.notify(`Auth result: ${"error" in status ? status.error : status.status}`, "error");
        }
      } catch (err: any) { ctx.ui.notify(`Auth failed: ${err.message}`, "error"); }
      return;
    }

    case "logout": {
      const serverName = rest;
      if (!serverName) { ctx.ui.notify("Usage: /mcp logout <name>", "warning"); return; }
      removeAuthEntry(serverName);
      cancelPendingAuth(serverName);
      ctx.ui.notify(`Removed OAuth credentials for "${serverName}"`, "info");
      return;
    }

    case "tools": {
      if (rest) {
        const server = connectedServers.get(rest);
        if (!server) { ctx.ui.notify(`"${rest}" is not connected`, "warning"); return; }
        const lines = server.tools.map(t => `  ${prefixedToolName(rest, server.config, t.name)} – ${t.description || "(no description)"}`);
        ctx.ui.notify(`Tools from "${rest}":\n${lines.join("\n")}`, "info");
      } else {
        const allLines: string[] = [];
        for (const [name, server] of connectedServers) {
          allLines.push(`\n  [${name}]`);
          for (const t of server.tools) {
            allLines.push(`    ${prefixedToolName(name, server.config, t.name)} – ${t.description || "(no description)"}`);
          }
        }
        ctx.ui.notify(allLines.length ? `MCP Tools:${allLines.join("\n")}` : "No MCP servers connected", "info");
      }
      return;
    }

    case "add": {
      const name = await ctx.ui.input("Server name", "e.g. wiz");
      if (!name) return;
      const transport = await ctx.ui.select("Transport", ["local", "remote"]);
      if (!transport) return;

      const newConfig: McpServerConfig = { name, transport: transport as any };

      if (transport === "local") {
        const command = await ctx.ui.input("Command", "e.g. npx -y @some/mcp-server");
        if (!command) return;
        newConfig.command = command.split(" ");
      } else {
        const url = await ctx.ui.input("Server URL", "https://...");
        if (!url) return;
        newConfig.url = url;
        newConfig.transport = "remote";
      }

      const auto = await ctx.ui.confirm("Auto-connect", "Connect on session start?");
      newConfig.autoConnect = auto;

      const config = loadConfig();
      config.servers[name] = newConfig;
      saveConfig(config);
      ctx.ui.notify(`Server "${name}" added to mcps.json`, "info");

      if (await ctx.ui.confirm("Connect now?", `Connect to "${name}"?`)) {
        try {
          const server = await connectServer(name, newConfig, pi, ctx.ui.notify.bind(ctx.ui), () => ctx.ui.input("Paste the full callback URL from your browser", ""));
          ctx.ui.notify(`Connected – ${server.tools.length} tools`, "info");
        } catch (err: any) { ctx.ui.notify(`Failed: ${err.message}`, "error"); }
      }
      return;
    }

    case "remove": {
      if (!rest) { ctx.ui.notify("Usage: /mcp remove <name>", "warning"); return; }
      const config = loadConfig();
      if (!config.servers[rest]) { ctx.ui.notify(`"${rest}" not found`, "error"); return; }
      if (connectedServers.has(rest)) { try { await disconnectServer(rest); } catch {} }
      delete config.servers[rest];
      saveConfig(config);
      ctx.ui.notify(`Removed "${rest}"`, "info");
      return;
    }

    default:
      ctx.ui.notify(`Unknown: ${sub}\nUsage: /mcp [status|connect|disconnect|auth|logout|tools|add|remove] [name]`, "warning");
  }
}

// ─── Extension entry point ──────────────────────────────────────────

export default function (pi: ExtensionAPI) {
  pi.registerCommand("mcp", {
    description: "Manage MCP server connections",
    getArgumentCompletions(prefix: string) {
      const parts = prefix.split(/\s+/);
      if (parts.length <= 1) {
        return SUBCOMMANDS.filter(s => s.startsWith(parts[0] ?? "")).map(s => ({ value: s, label: s }));
      }
      const sub = parts[0];
      const namePrefix = parts[1] ?? "";
      if (["connect", "disconnect", "remove", "tools", "auth", "logout"].includes(sub)) {
        const config = loadConfig();
        const names = sub === "disconnect" ? Array.from(connectedServers.keys()) : Object.keys(config.servers);
        return names.filter(n => n.startsWith(namePrefix)).map(n => ({ value: `${sub} ${n}`, label: n }));
      }
      return null;
    },
    handler: async (args, ctx) => handleMcpCommand(args, ctx, pi),
  });

  pi.on("session_start", async (_event, ctx) => {
    const config = loadConfig();
    for (const [name, serverConfig] of Object.entries(config.servers)) {
      if (serverConfig.enabled === false || connectedServers.has(name)) continue;

      // Auto-connect if configured, or if a previous Pi session connected successfully
      const shouldConnect = serverConfig.autoConnect
        || (isRemote(serverConfig) && getAuthEntry(name, serverConfig.url)?.lastConnectedAt !== undefined);
      if (!shouldConnect) continue;

      try {
        await connectServer(name, serverConfig, pi, (msg, type) => {
          try { (ctx as any).ui?.notify?.(msg, type); } catch {}
        });
      } catch (err: any) {
        console.warn(`[mcp] Auto-connect "${name}" failed: ${err.message}`);
      }
    }
  });

  pi.on("session_shutdown", async () => {
    for (const [name] of connectedServers) {
      try { await disconnectServer(name); } catch {}
    }
  });
}
