import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rmdir, unlink } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";
import { listDirectory, PickerState } from "../picker.ts";

test("picker lists directories first, selects files and preserves selection on return", async () => {
  const root = await mkdtemp(join(process.cwd(), ".picker-test-"));
  try {
    await mkdir(join(root, "folder"));
    await writeFile(join(root, "b.txt"), "b");
    await writeFile(join(root, "a.md"), "a");
    const state = new PickerState(root);
    await state.refresh();
    assert.deepEqual(state.entries.map(entry => entry.name), ["..", "folder", "a.md", "b.txt"]);
    state.move(3);
    assert.equal(await state.enter(), join(root, "b.txt"));
    await state.refresh();
    assert.equal(state.entries[state.selected]?.name, "b.txt");
    state.move(-2);
    await state.enter();
    assert.equal(state.directory, join(root, "folder"));
    assert.equal(state.entries[0]?.name, "..");
    await state.up();
    assert.equal(state.directory, root);
    assert.equal(state.entries[state.selected]?.name, "folder");
    state.move(-100);
    assert.equal(state.selected, 0);
    state.move(100);
    assert.equal(state.selected, state.entries.length - 1);
  } finally {
    await unlink(join(root, "a.md"));
    await unlink(join(root, "b.txt"));
    await rmdir(join(root, "folder"));
    await rmdir(root);
  }
});

test("missing directory has a visible error and no selected file", async () => {
  const state = new PickerState(join(process.cwd(), "nonexistent-picker-folder"));
  await state.refresh();
  assert.equal(state.entries.length, 0);
  assert.match(state.error ?? "", /ENOENT/);
  assert.equal(await state.enter(), undefined);
  await assert.rejects(listDirectory(state.directory));
});

test("picker ignores symlinks and special entries", async () => {
  const { symlink } = await import("node:fs/promises");
  const root = await mkdtemp(join(process.cwd(), ".picker-links-"));
  try {
    await writeFile(join(root, "real.txt"), "real");
    await symlink("real.txt", join(root, "link.txt"));
    const names = (await listDirectory(root)).map(entry => entry.name);
    assert.ok(names.includes("real.txt"));
    assert.ok(!names.includes("link.txt"));
  } finally {
    await unlink(join(root, "link.txt"));
    await unlink(join(root, "real.txt"));
    await rmdir(root);
  }
});
