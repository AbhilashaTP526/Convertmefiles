import { formats, type FormatId } from "./formats";
import { articleFor } from "@/lib/utils/grammar";

export type ProcessingMode = "client" | "server" | "hybrid";
export type ConversionEngine = "image" | "pdf" | "audio" | "video";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ConversionDefinition {
  source: FormatId;
  target: FormatId;
  slug: string;
  processing: ProcessingMode;
  engine: ConversionEngine;
  outputMime: string;
  faqs: FaqItem[];
}

function slugFor(source: string, target: string) {
  return `${source}-to-${target}`;
}

const engineDescription: Record<ConversionEngine, string> = {
  image: "the Canvas API",
  pdf: "the pdf-lib library",
  audio: "a WebAssembly build of FFmpeg",
  video: "a WebAssembly build of FFmpeg",
};

function buildFaqs(source: string, target: string, engine: ConversionEngine): FaqItem[] {
  const sourceUpper = source.toUpperCase();
  const targetUpper = target.toUpperCase();
  const engineName = engineDescription[engine];

  return [
    {
      question: `How do I convert ${sourceUpper} to ${targetUpper}?`,
      answer: `Choose ${articleFor(sourceUpper)} ${sourceUpper} file using the drop zone or "Choose File" button above. The converter runs in your browser using ${engineName} and gives you a "Download" button for the resulting ${targetUpper} file — no upload, no waiting on a server.`,
    },
    {
      question: `Is this ${sourceUpper} to ${targetUpper} converter free?`,
      answer: `Yes. The converter is completely free with no sign-up, no watermark, and no limit on how many files you convert.`,
    },
    {
      question: `Are my files uploaded to a server?`,
      answer: `No. This conversion happens entirely inside your browser using ${engineName}. Your file is never uploaded, stored, or transmitted anywhere.`,
    },
    {
      question: `Does converting ${sourceUpper} to ${targetUpper} reduce quality?`,
      answer: qualityAnswer(source, target, engine),
    },
    {
      question: `Can I use this converter on my phone?`,
      answer:
        engine === "audio" || engine === "video"
          ? `Yes, but audio/video conversion is CPU-intensive. It will work on modern phones, though larger files may take noticeably longer than on desktop.`
          : `Yes. The converter works on any modern mobile browser on Android or iPhone, as well as desktop browsers like Chrome, Firefox, Safari, and Edge.`,
    },
    {
      question: `What is the maximum file size I can convert?`,
      answer: `Because conversion happens on your own device, the limit depends on your browser and device memory. We recommend keeping individual files under ${
        engine === "audio" || engine === "video" ? "200MB" : "40MB"
      } for the smoothest experience.`,
    },
  ];
}

function qualityAnswer(source: string, target: string, engine: ConversionEngine): string {
  if (engine === "pdf") {
    return `Converting an image to PDF embeds it at its original resolution — no re-encoding or quality loss occurs. Merging PDFs simply combines existing pages as-is.`;
  }
  if (engine === "audio") {
    return `Extracting audio from video re-encodes the audio track. MP3 uses a high-quality variable bitrate setting by default, which sounds close to indistinguishable from the source for most listening.`;
  }
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

interface PairSpec {
  source: FormatId;
  target: FormatId;
  engine: ConversionEngine;
}

const pairs: PairSpec[] = [
  { source: "jpg", target: "png", engine: "image" },
  { source: "png", target: "jpg", engine: "image" },
  { source: "jpg", target: "webp", engine: "image" },
  { source: "webp", target: "jpg", engine: "image" },
  { source: "png", target: "webp", engine: "image" },
  { source: "gif", target: "png", engine: "image" },
  { source: "bmp", target: "png", engine: "image" },
  { source: "jpg", target: "pdf", engine: "pdf" },
  { source: "png", target: "pdf", engine: "pdf" },
  { source: "mp4", target: "mp3", engine: "audio" },
];

export const conversions: ConversionDefinition[] = pairs.map(({ source, target, engine }) => ({
  source,
  target,
  slug: slugFor(source, target),
  processing: "client",
  engine,
  outputMime: formats[target].mimeTypes[0],
  faqs: buildFaqs(source, target, engine),
}));

export const conversionBySlug: Record<string, ConversionDefinition> = Object.fromEntries(
  conversions.map((c) => [c.slug, c])
);

export function getConversionsFor(formatId: FormatId): ConversionDefinition[] {
  return conversions.filter((c) => c.source === formatId || c.target === formatId);
}

export function getRelatedConversions(current: ConversionDefinition, limit = 4): ConversionDefinition[] {
  return conversions
    .filter(
      (c) =>
        c.slug !== current.slug &&
        (c.source === current.source || c.target === current.target || c.source === current.target)
    )
    .slice(0, limit);
}
