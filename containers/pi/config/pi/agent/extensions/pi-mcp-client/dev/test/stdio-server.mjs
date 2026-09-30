import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
const server = new Server({ name: 'portable-smoke', version: '1.0.0' }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, () => ({ tools: [{ name: 'ping', description: 'test ping', inputSchema: { type: 'object', properties: { text: { type: 'string' } }, required: ['text'] } }] }));
server.setRequestHandler(CallToolRequestSchema, () => ({ content: [{ type: 'text', text: 'pong' }] }));
await server.connect(new StdioServerTransport());
