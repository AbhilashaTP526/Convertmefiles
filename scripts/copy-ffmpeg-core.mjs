// Copies the self-hosted ffmpeg.wasm core files from node_modules into
// public/ffmpeg/ so they can be served same-origin (required by our CSP
// and to avoid depending on a third-party CDN at runtime). Runs on
// `npm install` via the `postinstall` script, and isn't committed to git.
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const source = join(root, "node_modules", "@ffmpeg", "core", "dist", "umd");
const destination = join(root, "public", "ffmpeg");

const files = ["ffmpeg-core.js", "ffmpeg-core.wasm"];

if (!existsSync(source)) {
  console.warn("[copy-ffmpeg-core] @ffmpeg/core not found — skipping (audio conversion will be unavailable).");
  process.exit(0);
}

mkdirSync(destination, { recursive: true });

for (const file of files) {
  copyFileSync(join(source, file), join(destination, file));
}

console.log(`[copy-ffmpeg-core] Copied ${files.join(", ")} to public/ffmpeg/`);
