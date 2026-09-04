import { type ImageFormatId } from "./formats";

export type ProcessingMode = "client" | "server" | "hybrid";
export type ConversionEngine = "image" | "pdf" | "audio" | "video";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ConversionDefinition {
  source: ImageFormatId;
  target: ImageFormatId;
  slug: string;
  processing: ProcessingMode;
  engine: ConversionEngine;
  outputMime: "image/png" | "image/jpeg" | "image/webp";
  faqs: FaqItem[];
}

function slugFor(source: string, target: string) {
  return `${source}-to-${target}`;
}

const outputMimeFor: Record<ImageFormatId, "image/png" | "image/jpeg" | "image/webp"> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/png",
  bmp: "image/png",
};

function buildFaqs(source: string, target: string, sourceUpper: string, targetUpper: string): FaqItem[] {
  return [
    {
      question: `How do I convert ${sourceUpper} to ${targetUpper}?`,
      answer: `Choose a ${sourceUpper} file using the drop zone or "Choose File" button above. The converter runs instantly in your browser and gives you a "Download" button for the resulting ${targetUpper} file — no upload, no waiting on a server.`,
    },
    {
      question: `Is this ${sourceUpper} to ${targetUpper} converter free?`,
      answer: `Yes. The converter is completely free with no sign-up, no watermark, and no limit on how many files you convert.`,
    },
    {
      question: `Are my files uploaded to a server?`,
      answer: `No. This conversion happens entirely inside your browser using JavaScript and the Canvas API. Your file is never uploaded, stored, or transmitted anywhere.`,
    },
    {
      question: `Does converting ${sourceUpper} to ${targetUpper} reduce quality?`,
      answer: qualityAnswer(source, target),
    },
    {
      question: `Can I use this converter on my phone?`,
      answer: `Yes. The converter works on any modern mobile browser on Android or iPhone, as well as desktop browsers like Chrome, Firefox, Safari, and Edge.`,
    },
    {
      question: `What is the maximum file size I can convert?`,
      answer: `Because conversion happens on your own device, the limit depends on your browser and device memory. We recommend keeping individual files under 40MB for the smoothest experience.`,
    },
  ];
}

function qualityAnswer(source: string, target: string): string {
  if (target === "jpg" && (source === "png" || source === "gif" || source === "bmp")) {
    return `Converting to JPG uses lossy compression, so there is a small quality trade-off in exchange for a much smaller file size. Any transparent areas in the original image are filled with a white background, since JPG doesn't support transparency.`;
  }
  if (target === "png") {
    return `PNG uses lossless compression, so no additional quality is lost during conversion — you're trading file size for pixel-perfect accuracy.`;
  }
  if (target === "webp") {
    return `WebP conversion uses a high-quality encoding setting by default, producing a smaller file with visually similar quality to the original.`;
  }
  return `Quality is preserved as closely as possible during conversion, subject to the compression characteristics of the output format.`;
}

const pairs: Array<[ImageFormatId, ImageFormatId]> = [
  ["jpg", "png"],
  ["png", "jpg"],
  ["jpg", "webp"],
  ["webp", "jpg"],
  ["png", "webp"],
  ["gif", "png"],
  ["bmp", "png"],
];

export const conversions: ConversionDefinition[] = pairs.map(([source, target]) => ({
  source,
  target,
  slug: slugFor(source, target),
  processing: "client",
  engine: "image",
  outputMime: outputMimeFor[target],
  faqs: buildFaqs(source, target, source.toUpperCase(), target.toUpperCase()),
}));

export const conversionBySlug: Record<string, ConversionDefinition> = Object.fromEntries(
  conversions.map((c) => [c.slug, c])
);

export function getConversionsFor(formatId: ImageFormatId): ConversionDefinition[] {
  return conversions.filter((c) => c.source === formatId || c.target === formatId);
}

export function getRelatedConversions(current: ConversionDefinition, limit = 4): ConversionDefinition[] {
  return conversions
    .filter((c) => c.slug !== current.slug && (c.source === current.source || c.target === current.target || c.source === current.target))
    .slice(0, limit);
}
