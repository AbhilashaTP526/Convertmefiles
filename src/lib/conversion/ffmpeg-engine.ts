import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

let ffmpegInstance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

/**
 * Lazily loads ffmpeg.wasm (self-hosted under /public/ffmpeg) the first time
 * it's needed, and reuses the same instance afterwards — shared by both the
 * audio and video converters, since only one WASM engine should ever be
 * loaded per page. Nothing here runs until a conversion is actually
 * requested. The WASM core is ~30MB, so callers should surface
 * `onLoadProgress` to the user.
 */
export async function loadFFmpegEngine(onLoadProgress?: (ratio: number) => void): Promise<FFmpeg> {
  if (ffmpegInstance?.loaded) return ffmpegInstance;
  if (!loadPromise) {
    loadPromise = (async () => {
      const ffmpeg = new FFmpeg();
      const baseURL = "/ffmpeg";
      const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript");
      const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm", true, (event) => {
        if (event.total > 0) onLoadProgress?.(event.received / event.total);
      });
      await ffmpeg.load({ coreURL, wasmURL });
      ffmpegInstance = ffmpeg;
      return ffmpeg;
    })();
  }
  return loadPromise;
}
