export type ImageOutputFormat = "png" | "jpeg" | "webp";

export interface ConvertImageOptions {
  /** 0-1, only applies to lossy outputs (jpeg/webp). */
  quality?: number;
  /** Fill color used behind transparent pixels when converting to a format without transparency (e.g. JPG). */
  backgroundColor?: string;
  /** 0-1, scales output dimensions down from the source image. Used by compress mode for lossless formats like PNG, where quality has no effect. */
  scale?: number;
}

export interface ConvertImageResult {
  blob: Blob;
  width: number;
  height: number;
}

/**
 * Converts an image file to another raster format entirely in the browser
 * using the Canvas API. Works on the main thread or inside a Web Worker
 * (both expose createImageBitmap + OffscreenCanvas).
 */
export async function convertImageFile(
  file: File | Blob,
  outputFormat: ImageOutputFormat,
  options: ConvertImageOptions = {}
): Promise<ConvertImageResult> {
  const bitmap = await createImageBitmap(file);

  try {
    const scale = options.scale && options.scale > 0 && options.scale < 1 ? options.scale : 1;
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const mime = `image/${outputFormat}` as const;
    const quality = options.quality ?? 0.92;

    if (typeof OffscreenCanvas !== "undefined") {
      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Your browser does not support canvas image rendering.");
      paintBackground(ctx, outputFormat, width, height, options.backgroundColor);
      ctx.drawImage(bitmap, 0, 0, width, height);
      const blob = await canvas.convertToBlob({ type: mime, quality });
      return { blob, width, height };
    }

    // Fallback for browsers/contexts without OffscreenCanvas.
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser does not support canvas image rendering.");
    paintBackground(ctx, outputFormat, width, height, options.backgroundColor);
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => (result ? resolve(result) : reject(new Error("Conversion failed."))),
        mime,
        quality
      );
    });
    return { blob, width, height };
  } finally {
    bitmap.close();
  }
}

function paintBackground(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  outputFormat: ImageOutputFormat,
  width: number,
  height: number,
  backgroundColor?: string
) {
  if (outputFormat !== "jpeg") return;
  // JPG has no transparency channel — fill with a solid background first.
  ctx.fillStyle = backgroundColor ?? "#ffffff";
  ctx.fillRect(0, 0, width, height);
}
