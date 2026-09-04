import { fetchFile } from "@ffmpeg/util";
import { loadFFmpegEngine } from "./ffmpeg-engine";

export type AudioOutputFormat = "mp3" | "wav";

export interface ExtractAudioOptions {
  onProgress?: (ratio: number) => void;
}

const outputMime: Record<AudioOutputFormat, string> = {
  mp3: "audio/mpeg",
  wav: "audio/wav",
};

/** Extracts the audio track from a video file and encodes it to MP3 or WAV, entirely in the browser. */
export async function extractAudioFromVideo(
  file: File,
  outputFormat: AudioOutputFormat,
  options: ExtractAudioOptions = {}
): Promise<Blob> {
  const ffmpeg = await loadFFmpegEngine();

  const uid = Math.random().toString(36).slice(2);
  const inputName = `input-${uid}.mp4`;
  const outputName = `output-${uid}.${outputFormat}`;

  const handleProgress = ({ progress }: { progress: number }) => {
    if (Number.isFinite(progress)) options.onProgress?.(Math.min(1, Math.max(0, progress)));
  };
  ffmpeg.on("progress", handleProgress);

  try {
    await ffmpeg.writeFile(inputName, await fetchFile(file));

    const args =
      outputFormat === "mp3"
        ? ["-i", inputName, "-vn", "-acodec", "libmp3lame", "-q:a", "2", outputName]
        : ["-i", inputName, "-vn", "-acodec", "pcm_s16le", outputName];

    const exitCode = await ffmpeg.exec(args);
    if (exitCode !== 0) {
      throw new Error("Audio extraction failed. The video may use an unsupported codec.");
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
