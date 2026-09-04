import { convertImageFile, type ImageOutputFormat } from "@/lib/conversion/image";

export interface ImageConvertRequest {
  file: File;
  outputFormat: ImageOutputFormat;
  quality?: number;
  backgroundColor?: string;
}

export type ImageConvertResponse =
  | { success: true; blob: Blob; width: number; height: number }
  | { success: false; error: string };

self.onmessage = async (event: MessageEvent<ImageConvertRequest>) => {
  const { file, outputFormat, quality, backgroundColor } = event.data;

  try {
    const result = await convertImageFile(file, outputFormat, { quality, backgroundColor });
    const response: ImageConvertResponse = {
      success: true,
      blob: result.blob,
      width: result.width,
      height: result.height,
    };
    self.postMessage(response);
  } catch (err) {
    const response: ImageConvertResponse = {
      success: false,
      error: err instanceof Error ? err.message : "Conversion failed unexpectedly.",
    };
    self.postMessage(response);
  }
};
