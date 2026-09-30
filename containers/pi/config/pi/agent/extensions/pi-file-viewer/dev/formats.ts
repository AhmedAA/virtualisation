import { extname } from "node:path";
import YAML from "yaml";

/** Add a format by registering a new entry; modal code does not need changes. */
export interface FileFormat {
  readonly label: string;
  readonly extensions: readonly string[];
  readonly presentation: "markdown" | "text";
  /** Transform file text into display-only text. Throw to report an invalid file. */
  format(source: string): string;
}

export const formats: FileFormat[] = [
  {
    label: "Markdown", extensions: [".md", ".markdown"], presentation: "markdown",
    format: source => source,
  },
  {
    label: "JSON", extensions: [".json"], presentation: "text",
    format: source => JSON.stringify(JSON.parse(source), null, 2),
  },
  {
    label: "YAML", extensions: [".yaml", ".yml"], presentation: "text",
    format: source => {
      // Preserve comments and original layout; reject invalid YAML rather than guessing.
      const doc = YAML.parseDocument(source, { uniqueKeys: true });
      if (doc.errors.length) throw doc.errors[0];
      return source;
    },
  },
  {
    label: "Plain text", extensions: [".txt"], presentation: "text",
    format: source => source,
  },
];

export function getFormat(filePath: string): FileFormat {
  const suffix = extname(filePath).toLowerCase();
  return formats.find(format => format.extensions.includes(suffix)) ?? formats[formats.length - 1]!;
}
