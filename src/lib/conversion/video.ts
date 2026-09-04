import { fetchFile } from "@ffmpeg/util";
import { loadFFmpegEngine } from "./ffmpeg-engine";

export type VideoOutputFormat = "mp4" | "webm" | "gif";

export interface ConvertVideoOptions {
  onProgress?: (ratio: number) => void;
}

const outputMime: Record<VideoOutputFormat, string> = {
  mp4: "video/mp4",
  webm: "video/webm",
  gif: "image/gif",
};

function buildArgs(inputName: string, outputName: string, outputFormat: VideoOutputFormat): string[] {
  switch (outputFormat) {
    case "webm":
      // VP8 + Vorbis: noticeably faster to encode in-browser than VP9/Opus, at a small size cost.
      return ["-i", inputName, "-c:v", "libvpx", "-b:v", "1M", "-c:a", "libvorbis", outputName];
    case "mp4":
      return ["-i", inputName, "-c:v", "libx264", "-preset", "veryfast", "-crf", "26", "-c:a", "aac", outputName];
    case "gif":
      return ["-i", inputName, "-vf", "fps=10,scale=480:-1:flags=lanczos", "-loop", "0", outputName];
  }
}

/** Re-encodes a video file to another video format (or to an animated GIF), entirely in the browser. */
export async function convertVideo(
  file: File,
  outputFormat: VideoOutputFormat,
  options: ConvertVideoOptions = {}
): Promise<Blob> {
  const ffmpeg = await loadFFmpegEngine();

  const uid = Math.random().toString(36).slice(2);
  const sourceExt = /\.([a-z0-9]+)$/i.exec(file.name)?.[1]?.toLowerCase() ?? "mp4";
  const inputName = `input-${uid}.${sourceExt}`;
  const outputName = `output-${uid}.${outputFormat}`;

  const handleProgress = ({ progress }: { progress: number }) => {
    if (Number.isFinite(progress)) options.onProgress?.(Math.min(1, Math.max(0, progress)));
  };
  ffmpeg.on("progress", handleProgress);

  try {
    await ffmpeg.writeFile(inputName, await fetchFile(file));

    const exitCode = await ffmpeg.exec(buildArgs(inputName, outputName, outputFormat));
    if (exitCode !== 0) {
      throw new Error("Video conversion failed. The file may use an unsupported codec.");
    }

    const data = await ffmpeg.readFile(outputName);
    const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data;
    return new Blob([bytes.buffer as ArrayBuffer], { type: outputMime[outputFormat] });
  } finally {
    ffmpeg.off("progress", handleProgress);
    await ffmpeg.deleteFile(inputName).catch(() => {});
    await ffmpeg.deleteFile(outputName).catch(() => {});
  }
}
