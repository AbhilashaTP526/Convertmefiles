import { type ImageFormatId, formats } from "@/config/formats";

/**
 * Magic-byte signatures for supported raster formats. We never trust the
 * browser-reported MIME type or the filename extension alone — both can be
 * spoofed — so every file is sniffed from its actual bytes before use.
 */
const SIGNATURES: Record<ImageFormatId, (bytes: Uint8Array) => boolean> = {
  jpg: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  png: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  webp: (b) =>
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50,
  gif: (b) => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46,
  bmp: (b) => b[0] === 0x42 && b[1] === 0x4d,
};

export async function sniffImageFormat(file: File | Blob): Promise<ImageFormatId | null> {
  const buffer = await file.slice(0, 16).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  for (const id of Object.keys(SIGNATURES) as ImageFormatId[]) {
    if (SIGNATURES[id](bytes)) return id;
  }
  return null;
}

export const MAX_IMAGE_FILE_SIZE = 40 * 1024 * 1024; // 40MB

export interface ValidationResult {
  ok: boolean;
  detectedFormat?: ImageFormatId;
  error?: string;
}

export async function validateImageFile(
  file: File,
  expectedSource: ImageFormatId
): Promise<ValidationResult> {
  if (file.size === 0) {
    return { ok: false, error: "This file is empty." };
  }
  if (file.size > MAX_IMAGE_FILE_SIZE) {
    return {
      ok: false,
      error: `This file is too large for your browser to process reliably (max ${Math.floor(
        MAX_IMAGE_FILE_SIZE / 1024 / 1024
      )}MB).`,
    };
  }

  const detected = await sniffImageFormat(file);
  if (!detected) {
    return { ok: false, error: "Unsupported file format. Please choose a valid image file." };
  }
  if (detected !== expectedSource) {
    const expectedName = formats[expectedSource].name;
    const detectedName = formats[detected].name;
    return {
      ok: false,
      detectedFormat: detected,
      error: `This looks like a ${detectedName} file, not a ${expectedName} file. Please choose a ${expectedName} file, or use the ${detectedName} converter instead.`,
    };
  }

  return { ok: true, detectedFormat: detected };
}

/** Strips path separators and unsafe characters so a filename is safe to use for a download. */
export function sanitizeFileBaseName(name: string): string {
  const withoutPath = name.split(/[\\/]/).pop() ?? name;
  const withoutExtension = withoutPath.replace(/\.[^.]+$/, "");
  const cleaned = withoutExtension.replace(/[^a-zA-Z0-9-_ ]/g, "").trim();
  return cleaned.slice(0, 80) || "converted-file";
}
