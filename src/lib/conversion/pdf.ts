import { PDFDocument, PageSizes } from "pdf-lib";

export interface ImagesToPdfOptions {
  /** Page size to fit each image onto. Defaults to A4. */
  pageSize?: [number, number];
  /** Margin (in PDF points) around each image. */
  margin?: number;
}

/**
 * Combines one or more JPG/PNG images into a single PDF, one image per page.
 * Each image is scaled to fit the page while preserving its aspect ratio.
 */
export async function convertImagesToPdf(
  files: File[],
  sourceFormat: "jpg" | "png",
  options: ImagesToPdfOptions = {}
): Promise<Blob> {
  const [pageWidth, pageHeight] = options.pageSize ?? PageSizes.A4;
  const margin = options.margin ?? 24;

  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const image = sourceFormat === "jpg" ? await pdfDoc.embedJpg(bytes) : await pdfDoc.embedPng(bytes);

    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;
    const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;

    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    page.drawImage(image, {
      x: (pageWidth - drawWidth) / 2,
      y: (pageHeight - drawHeight) / 2,
      width: drawWidth,
      height: drawHeight,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
}

/** Merges multiple PDF files into a single PDF, preserving page order. */
export async function mergePdfFiles(files: File[]): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const sourcePdf = await PDFDocument.load(bytes);
    const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const pdfBytes = await mergedPdf.save();
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
}
