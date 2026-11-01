import { open } from "node:fs/promises";
import { isAbsolute, resolve } from "node:path";
import type { ExtensionAPI, Theme } from "@earendil-works/pi-coding-agent";
import type { MarkdownTheme } from "@earendil-works/pi-tui";
import { Markdown, matchesKey, truncateToWidth, visibleWidth, wrapTextWithAnsi, type Component, type TUI } from "@earendil-works/pi-tui";
import { getFormat, type FileFormat } from "./formats.ts";
import { FilePicker, PickerState } from "./picker.ts";

const MAX_BYTES = 2 * 1024 * 1024;

/** Derive Markdown colors from the active Pi theme without a runtime SDK import. */
function markdownTheme(theme: Theme): MarkdownTheme {
  return {
    heading: text => theme.fg("mdHeading", text),
    link: text => theme.fg("mdLink", text),
    linkUrl: text => theme.fg("mdLinkUrl", text),
    code: text => theme.fg("mdCode", text),
    codeBlock: text => theme.fg("mdCodeBlock", text),
    codeBlockBorder: text => theme.fg("mdCodeBlockBorder", text),
    quote: text => theme.fg("mdQuote", text),
    quoteBorder: text => theme.fg("mdQuoteBorder", text),
    hr: text => theme.fg("mdHr", text),
    listBullet: text => theme.fg("mdListBullet", text),
    bold: text => theme.bold(text),
    italic: text => theme.italic(text),
    underline: text => theme.underline(text),
    strikethrough: text => theme.strikethrough(text),
  };
}

/** Bounded read even if a file grows after stat; no write handles or shell execution. */
export async function loadFile(path: string): Promise<string> {
  const file = await open(path, "r");
  try {
    const stats = await file.stat();
    if (!stats.isFile()) throw new Error("Not a regular file");
    if (stats.size > MAX_BYTES) throw new Error("File exceeds the 2 MiB viewer limit");
    const buffer = Buffer.alloc(MAX_BYTES + 1);
    let length = 0;
    while (length < buffer.length) {
      const { bytesRead } = await file.read(buffer, length, buffer.length - length, length);
      if (!bytesRead) break;
      length += bytesRead;
    }
    if (length > MAX_BYTES) throw new Error("File exceeds the 2 MiB viewer limit");
    if (buffer.subarray(0, length).includes(0)) throw new Error("Binary files cannot be viewed");
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer.subarray(0, length));
  } finally {
    await file.close();
  }
}

/** Clean a simple quoted slash-command argument; never interpret shell syntax. */
export function resolveArgument(argument: string, cwd: string): string {
  let path = argument.trim();
  if (path.length >= 2 && ((path[0] === '"' && path.at(-1) === '"') || (path[0] === "'" && path.at(-1) === "'"))) {
    path = path.slice(1, -1);
  }
  if (!path) throw new Error("Usage: /view <file-path>");
  return isAbsolute(path) ? path : resolve(cwd, path);
}

class FileViewer implements Component {
  private offset = 0;
  private readonly markdown: Markdown | undefined;
  private readonly height: number;
  private readonly tui: TUI;
  private readonly theme: Theme;
  private readonly title: string;
  private readonly content: string;
  private readonly close: () => void;
  private cachedWidth = 0;
  private cachedBody: string[] | undefined;

  constructor(tui: TUI, theme: Theme, title: string, content: string, format: FileFormat, close: () => void) {
    this.tui = tui;
    this.theme = theme;
    this.title = title;
    this.content = content;
    this.close = close;
    this.height = 32;
    if (format.presentation === "markdown") this.markdown = new Markdown(content, 0, 0, markdownTheme(theme));
  }

  invalidate(): void {
    this.markdown?.invalidate();
    this.cachedBody = undefined;
  }

  handleInput(data: string): void {
    if (matchesKey(data, "escape") || matchesKey(data, "q")) return this.close();
    if (matchesKey(data, "up") || matchesKey(data, "k")) this.offset -= 1;
    else if (matchesKey(data, "down") || matchesKey(data, "j")) this.offset += 1;
    else if (matchesKey(data, "pageUp")) this.offset -= Math.min(this.height, Math.max(1, this.tui.terminal.rows - 8));
    else if (matchesKey(data, "pageDown")) this.offset += Math.min(this.height, Math.max(1, this.tui.terminal.rows - 8));
    else if (matchesKey(data, "home")) this.offset = 0;
    else if (matchesKey(data, "end")) this.offset = Number.MAX_SAFE_INTEGER;
    this.tui.requestRender();
  }

  render(width: number): string[] {
    const w = Math.max(4, width);
    const inner = Math.max(1, w - 4);
    if (!this.cachedBody || this.cachedWidth !== inner) {
      this.cachedWidth = inner;
      this.cachedBody = this.markdown
        ? this.markdown.render(inner)
        : this.content.split("\n").flatMap(line => wrapTextWithAnsi(line.replaceAll("\t", "    "), inner));
    }
    const body = this.cachedBody;
    const total = Math.max(1, body.length);
    const viewport = Math.min(this.height, total, Math.max(1, Math.floor(this.tui.terminal.rows * 0.9) - 4));
    this.offset = Math.max(0, Math.min(this.offset, total - viewport));
    const top = this.theme.fg("border", `╭${"─".repeat(Math.max(0, w - 2))}╮`);
    const bottom = this.theme.fg("border", `╰${"─".repeat(Math.max(0, w - 2))}╯`);
    const row = (value: string) => {
      const visible = truncateToWidth(value, Math.max(0, w - 4));
      return this.theme.fg("border", "│") + " " + visible + " ".repeat(Math.max(0, w - 3 - visibleWidth(visible))) + this.theme.fg("border", "│");
    };
    const result = [top, row(this.theme.fg("accent", truncateToWidth(this.title, inner)))];
    for (let i = 0; i < viewport; i++) result.push(row(body[this.offset + i] ?? ""));
    result.push(row(this.theme.fg("dim", `${this.offset + 1}–${this.offset + viewport}/${total}  ↑↓ PgUp/PgDn Home/End  Esc/q close`)));
    result.push(bottom);
    return result;
  }
}

export default function (pi: ExtensionAPI): void {
  pi.registerCommand("view", {
    description: "Pick a file to inspect: /view [file-path]", 
    handler: async (args, ctx) => {
      if (ctx.mode !== "tui") {
        ctx.ui.notify("/view requires interactive terminal mode", "warning");
        return;
      }
      const overlayOptions = { overlay: true, overlayOptions: { anchor: "center" as const, width: "85%" as const, maxHeight: "90%" as const } };
      const showFile = async (path: string): Promise<void> => {
        const format = getFormat(path);
        // Never pass untrusted terminal control sequences to the TUI renderer.
        const content = format.format(await loadFile(path))
          .replace(/\r\n/g, "\n")
          .replace(/[\x00-\x08\x0b\x0c\x0d\x0e-\x1f\x7f-\x9f]/g, "�");
        const safeTitle = `${path.replace(/[\x00-\x1f\x7f-\x9f]/g, "�")}  [${format.label}, read-only]`;
        await ctx.ui.custom<void>(
          (tui, theme, _keys, done) => new FileViewer(tui, theme, safeTitle, content, format, () => done()),
          overlayOptions,
        );
      };
      if (args.trim()) {
        try { await showFile(resolveArgument(args, ctx.cwd)); }
        catch (error) { ctx.ui.notify(`Cannot view file: ${error instanceof Error ? error.message : String(error)}`, "error"); }
        return;
      }
      const picker = new PickerState(ctx.cwd);
      await picker.refresh();
      while (true) {
        const path = await ctx.ui.custom<string | undefined>(
          (tui, theme, _keys, done) => new FilePicker(tui, theme, picker, done),
          overlayOptions,
        );
        if (!path) break;
        try { await showFile(path); }
        catch (error) { ctx.ui.notify(`Cannot view file: ${error instanceof Error ? error.message : String(error)}`, "error"); }
        // Restore picker, including its folder and selected file, after viewing or an error.
        await picker.refresh();
      }
    },
  });
}
