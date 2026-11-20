import { readdir } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import type { Dirent } from "node:fs";
import type { Theme } from "@earendil-works/pi-coding-agent";
import { matchesKey, truncateToWidth, visibleWidth, type Component, type TUI } from "@earendil-works/pi-tui";

export interface PickerEntry {
  name: string;
  kind: "directory" | "file" | "parent";
  path: string;
}

/** Directory entries are navigable, symlinks and other special files are not. */
export async function listDirectory(directory: string): Promise<PickerEntry[]> {
  const entries: Dirent[] = await readdir(directory, { withFileTypes: true });
  const items: PickerEntry[] = entries.filter(entry => entry.isDirectory() || entry.isFile())
    .map(entry => ({
      name: entry.name,
      kind: entry.isDirectory() ? "directory" as const : "file" as const,
      path: join(directory, entry.name),
    }));
  items.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "directory" ? -1 : 1;
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
  });
  if (dirname(directory) !== directory) items.unshift({ name: "..", kind: "parent", path: dirname(directory) });
  return items;
}

export class PickerState {
  directory: string;
  entries: PickerEntry[] = [];
  selected = 0;
  error: string | undefined;

  constructor(directory: string) { this.directory = resolve(directory); }

  async refresh(preferredName?: string): Promise<void> {
    const previousName = preferredName ?? this.entries[this.selected]?.name;
    try {
      this.entries = await listDirectory(this.directory);
      this.error = undefined;
      this.selected = Math.max(0, this.entries.findIndex(entry => entry.name === previousName));
    } catch (error) {
      this.entries = [];
      this.selected = 0;
      this.error = error instanceof Error ? error.message : String(error);
    }
  }

  move(delta: number): void {
    this.selected = Math.max(0, Math.min(this.entries.length - 1, this.selected + delta));
  }

  /** Returns a selected file path; entering folders keeps the picker open. */
  async enter(): Promise<string | undefined> {
    const entry = this.entries[this.selected];
    if (!entry) return undefined;
    if (entry.kind === "file") return entry.path;
    const previous = this.directory;
    this.directory = entry.path;
    await this.refresh(entry.kind === "parent" ? basename(previous) : undefined);
    if (this.error) {
      this.directory = previous;
      await this.refresh(entry.name);
    }
    return undefined;
  }

  async up(): Promise<void> {
    if (dirname(this.directory) === this.directory) return;
    const previous = this.directory;
    this.directory = dirname(previous);
    await this.refresh(basename(previous));
    if (this.error) {
      this.directory = previous;
      await this.refresh();
    }
  }
}

function safe(text: string): string {
  return text.replace(/[\x00-\x1f\x7f-\x9f]/g, "�");
}

export class FilePicker implements Component {
  private offset = 0;
  private readonly tui: TUI;
  private readonly theme: Theme;
  private readonly state: PickerState;
  private readonly done: (path: string | undefined) => void;
  private busy = false;

  constructor(tui: TUI, theme: Theme, state: PickerState, done: (path: string | undefined) => void) {
    this.tui = tui;
    this.theme = theme;
    this.state = state;
    this.done = done;
  }

  invalidate(): void { /* No rendered content is cached. */ }

  handleInput(key: string): void {
    if (matchesKey(key, "escape") || matchesKey(key, "q")) return this.done(undefined);
    if (this.busy) return;
    const page = Math.max(1, Math.min(22, Math.floor(this.tui.terminal.rows * 0.9) - 5));
    if (matchesKey(key, "up") || matchesKey(key, "k")) this.state.move(-1);
    else if (matchesKey(key, "down") || matchesKey(key, "j")) this.state.move(1);
    else if (matchesKey(key, "pageUp")) this.state.move(-page);
    else if (matchesKey(key, "pageDown")) this.state.move(page);
    else if (matchesKey(key, "home")) this.state.selected = 0;
    else if (matchesKey(key, "end")) this.state.selected = Math.max(0, this.state.entries.length - 1);
    else if (matchesKey(key, "backspace") || matchesKey(key, "left")) this.navigate(() => this.state.up());
    else if (matchesKey(key, "enter") || matchesKey(key, "right")) {
      this.navigate(async () => {
        const path = await this.state.enter();
        if (path) this.done(path);
      });
    }
    this.tui.requestRender();
  }

  private navigate(action: () => Promise<void>): void {
    this.busy = true;
    void action().catch(error => {
      this.state.error = error instanceof Error ? error.message : String(error);
    }).finally(() => {
      this.busy = false;
      this.offset = 0;
      this.tui.requestRender();
    });
  }

  render(width: number): string[] {
    const w = Math.max(4, width);
    const inner = Math.max(0, w - 4);
    const page = Math.max(1, Math.min(22, Math.floor(this.tui.terminal.rows * 0.9) - 5));
    const total = this.state.entries.length;
    this.offset = Math.max(0, Math.min(this.offset, Math.max(0, total - page)));
    if (this.state.selected < this.offset) this.offset = this.state.selected;
    if (this.state.selected >= this.offset + page) this.offset = this.state.selected - page + 1;
    const row = (value: string) => {
      const text = truncateToWidth(value, inner);
      return this.theme.fg("border", "│") + " " + text + " ".repeat(Math.max(0, w - 3 - visibleWidth(text))) + this.theme.fg("border", "│");
    };
    const result = [
      this.theme.fg("border", `╭${"─".repeat(w - 2)}╮`),
      row(this.theme.fg("accent", safe(this.state.directory))),
    ];
    if (this.state.error) result.push(row(this.theme.fg("error", safe(this.state.error))));
    if (!total) result.push(row(this.theme.fg("dim", this.state.error ? "Cannot list directory" : "No files in this directory")));
    for (let i = this.offset; i < Math.min(total, this.offset + page); i++) {
      const entry = this.state.entries[i]!;
      const text = `${i === this.state.selected ? "❯" : " "} ${safe(entry.name)}${entry.kind === "directory" ? "/" : ""}`;
      result.push(row(i === this.state.selected ? this.theme.fg("accent", text) : text));
    }
    result.push(row(this.theme.fg("dim", `↑↓ select  Enter open  ← parent  Esc close  ${total ? `${this.state.selected + 1}/${total}` : ""}`)));
    result.push(this.theme.fg("border", `╰${"─".repeat(w - 2)}╯`));
    return result;
  }
}
