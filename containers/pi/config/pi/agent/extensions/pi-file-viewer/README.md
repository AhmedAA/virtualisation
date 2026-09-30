# Pi file viewer

`/view` opens a read-only file picker in Pi's current directory. Enter opens a selected file or folder, ←/Backspace visits the parent, and Esc from a viewed file returns to the picker. `/view path/to/file` opens a file directly. Markdown, JSON (prettified), YAML, and text are supported; other text extensions fall back to plain text.

## Development

Editable source, tests, and the build script are in `dev/`. To add a format, register it in `dev/formats.ts` and add a test. In `dev/`, run `npm install` (only if dependencies are missing), `npm run check`, and `npm test`. `npm run build` regenerates the root `index.ts` and `viewer.mjs`; `/reload` activates the result. The extension root needs no `node_modules` or npm install. Do not edit the generated bundle directly.
