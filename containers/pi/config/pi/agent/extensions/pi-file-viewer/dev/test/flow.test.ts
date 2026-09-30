import assert from "node:assert/strict";
import { mkdtemp, writeFile, unlink, rmdir } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";
import extension from "../../viewer.mjs";
import type { ExtensionAPI, ExtensionCommandContext } from "@earendil-works/pi-coding-agent";
import { type Component, type TUI } from "@earendil-works/pi-tui";

// Drive each real modal with keypresses to check the picker/viewer transition.
async function runFlow(args: string, keys: string[][]): Promise<string[]> {
  const root = await mkdtemp(join(process.cwd(), ".flow-test-"));
  const views: string[] = [];
  try {
    await writeFile(join(root, "file.txt"), "read only");
    let handler: ((args: string, ctx: ExtensionCommandContext) => Promise<void>) | undefined;
    extension({ registerCommand(_name: string, config: { handler: typeof handler }) { handler = config.handler; } } as ExtensionAPI);
    assert.ok(handler);
    const tui = { terminal: { rows: 40 }, requestRender() {} } as unknown as TUI;
    const theme = { fg(_color: string, value: string) { return value; } };
    let step = 0;
    const ctx = {
      mode: "tui", cwd: root,
      ui: {
        notify(message: string) { throw new Error(`Unexpected notification: ${message}`); },
        async custom(factory: (tui: TUI, theme: unknown, keys: unknown, done: (value?: string) => void) => Component) {
          const input = keys[step++];
          assert.ok(input, "Unexpected modal");
          return await new Promise<string | undefined>((done) => {
            const component = factory(tui, theme, undefined, done);
            views.push(component.constructor.name);
            const sequences: Record<string, string> = {
              escape: "\x1b", down: "\x1b[B", enter: "\r",
            };
            for (const key of input) component.handleInput?.(sequences[key] ?? key);
          });
        },
      },
    } as unknown as ExtensionCommandContext;
    await handler(args, ctx);
    assert.equal(step, keys.length);
    return views;
  } finally {
    await unlink(join(root, "file.txt"));
    await rmdir(root);
  }
}

test("/view picker opens file then escape returns to picker before quitting", async () => {
  assert.deepEqual(await runFlow("", [["down", "down", "enter"], ["escape"], ["escape"]]),
    ["FilePicker", "FileViewer", "FilePicker"]);
});

test("direct /view path closes without showing picker", async () => {
  // Resolve direct path relative to the mock cwd.
  assert.deepEqual(await runFlow("file.txt", [["escape"]]), ["FileViewer"]);
});

test("picker Esc cancels without opening a file", async () => {
  assert.deepEqual(await runFlow("", [["escape"]]), ["FilePicker"]);
});
