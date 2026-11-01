import assert from "node:assert/strict";
import { mkdtemp, writeFile, unlink, rmdir } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";
import { formats, getFormat } from "../formats.js";
import { loadFile, resolveArgument } from "../index.js";

test("registry selects supported formats case-insensitively and falls back to text", () => {
  for (const extension of [".md", ".markdown", ".JSON", ".yaml", ".yml", ".txt"]) {
    assert.equal(getFormat(`file${extension}`).extensions.includes(extension.toLowerCase()), true);
  }
  assert.equal(getFormat("file.unknown").label, "Plain text");
  assert.equal(formats.length, 4);
});

test("JSON is prettified, malformed JSON fails", () => {
  assert.equal(getFormat("x.json").format('{"a":1}'), '{\n  "a": 1\n}');
  assert.throws(() => getFormat("x.json").format("{invalid}"));
});

test("YAML preserves comments and rejects invalid documents", () => {
  assert.equal(getFormat("x.yml").format("# note\na: 1\n"), "# note\na: 1\n");
  assert.throws(() => getFormat("x.yaml").format("a: [\n"));
});

test("argument resolution handles paths with spaces and missing arguments", () => {
  assert.equal(resolveArgument('"some path.md"', "/project"), "/project/some path.md");
  assert.throws(() => resolveArgument("  ", "/project"), /Usage/);
});

test("file reads reject directories, binary, malformed UTF-8, and oversized files", async () => {
  const dir = await mkdtemp(join(process.cwd(), ".pi-viewer-test-"));
  try {
    const ok = join(dir, "ok.txt");
    await writeFile(ok, "Hello");
    assert.equal(await loadFile(ok), "Hello");
    await assert.rejects(loadFile(dir), /regular file/);
    await writeFile(join(dir, "nul.txt"), Buffer.from([65, 0, 66]));
    await assert.rejects(loadFile(join(dir, "nul.txt")), /Binary/);
    await writeFile(join(dir, "utf8.txt"), Buffer.from([0xff]));
    await assert.rejects(loadFile(join(dir, "utf8.txt")));
    await writeFile(join(dir, "large.txt"), Buffer.alloc(2 * 1024 * 1024 + 1));
    await assert.rejects(loadFile(join(dir, "large.txt")), /2 MiB/);
  } finally {
    for (const name of ["ok.txt", "nul.txt", "utf8.txt", "large.txt"]) {
      await unlink(join(dir, name)).catch((error: NodeJS.ErrnoException) => {
        if (error.code !== "ENOENT") throw error;
      });
    }
    await rmdir(dir);
  }
});
