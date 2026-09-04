import { formats } from "@/config/formats";
import type { ConversionDefinition } from "@/config/conversions";

const engineDescriptions: Record<ConversionDefinition["engine"], string> = {
  image: "the Canvas API",
  pdf: "the pdf-lib library",
  audio: "a WebAssembly build of FFmpeg",
  video: "a WebAssembly build of FFmpeg",
  compress: "the Canvas API",
};

export function getEngineDescription(conversion: ConversionDefinition): string {
  return engineDescriptions[conversion.engine];
}

function subjectNoun(conversion: ConversionDefinition): string {
  if (conversion.engine === "pdf") return conversion.source === "pdf" ? "document" : "image";
  if (conversion.engine === "audio" || conversion.engine === "video") return "video";
  return "image";
}

export function getConversionMeta(conversion: ConversionDefinition) {
  const source = formats[conversion.source];
  const target = formats[conversion.target];

  if (conversion.engine === "compress") {
    const title = `${source.name} Compressor`;
    return {
      title,
      metaTitle: `${title} — Reduce File Size Online, Right in Your Browser`,
      metaDescription: `Compress ${source.name} images directly in your browser. No upload required — your files stay on your device and come out smaller in seconds.`,
      h1: `Compress ${source.name}`,
      intro: `Shrink ${source.name} file sizes instantly and privately. Everything happens on your own device — nothing is uploaded to a server.`,
    };
  }

  const title = `${source.name} to ${target.name} Converter`;
  const noun = subjectNoun(conversion);

  return {
    title,
    metaTitle: `${title} — Convert Online, Right in Your Browser`,
    metaDescription: `Convert ${source.name} to ${target.name} directly in your browser. No upload required — ${source.name} files stay on your device and are converted to ${target.name} instantly.`,
    h1: title,
    intro: `Convert ${source.name} ${noun}s to ${target.name} instantly and privately. Everything happens on your own device — nothing is uploaded to a server.`,
  };
}

export function getWhatIsParagraph(conversion: ConversionDefinition): string {
  const source = formats[conversion.source];
  const target = formats[conversion.target];

  if (conversion.engine === "compress") {
    return conversion.source === "png"
      ? `${source.name} compression shrinks a PNG's file size by scaling down its dimensions — the main lever available in-browser, since PNG's lossless compression can't be selectively reduced the way JPG or WebP can. ${source.description}`
      : `${source.name} compression re-encodes your image at a lower quality setting, trading a small, often invisible amount of visual detail for a meaningfully smaller file size, while keeping the same ${source.name} format. ${source.description}`;
  }
  if (conversion.engine === "pdf" && conversion.target === "pdf") {
    return `${source.name} to PDF conversion embeds one or more ${source.name} images into a single PDF document, one image per page, at their original resolution. ${target.description} It's a quick way to combine photos, scans, or screenshots into one shareable file.`;
  }
  if (conversion.engine === "audio") {
    return `${source.name} to ${target.name} conversion extracts the audio track from an ${source.name} video and re-encodes it as a standalone ${target.name} file. ${source.description} ${target.description}`;
  }
  if (conversion.engine === "video" && conversion.target === "gif") {
    return `${source.name} to GIF conversion re-encodes each frame of your ${source.name} video into an animated GIF, dropping the audio track entirely since GIF can't store sound. ${source.description}`;
  }
  if (conversion.engine === "video") {
    return `${source.name} to ${target.name} conversion re-encodes your video's picture and sound into ${target.fullName}, changing the container and codecs while keeping the same content. ${source.description} ${target.description}`;
  }

  return `${source.name} to ${target.name} conversion changes a ${source.fullName} image into ${target.fullName}. ${source.description} ${target.description} Converting between the two lets you pick whichever format best fits where the image is headed next.`;
}

export function getWhyConvertParagraph(conversion: ConversionDefinition): string {
  const source = formats[conversion.source];
  const target = formats[conversion.target];

  if (conversion.engine === "compress") {
    return `A smaller ${source.name} file uploads faster, loads faster on a website, and takes up less storage or email attachment space — often with no visible difference in quality.`;
  }
  if (conversion.engine === "pdf" && conversion.target === "pdf") {
    return `Converting to PDF is the easiest way to turn a handful of images into one document that opens identically on any device, prints cleanly, and can be shared as a single attachment instead of several separate image files.`;
  }
  if (conversion.engine === "audio") {
    return `Extracting the audio from a video is useful when you only need the sound — a lecture, a podcast recording, a music clip, or a voice memo — without carrying around the much larger video file.`;
  }
  if (conversion.engine === "video" && conversion.target === "gif") {
    return `Converting a short clip to GIF makes it easy to share as a self-playing loop anywhere GIFs are supported — chat apps, forums, and articles — without anyone needing to tap play.`;
  }
  if (conversion.engine === "video") {
    return `Converting between video formats is useful when a platform, editor, or device only accepts ${target.name}, or when you want ${target.name}'s balance of compatibility and file size instead of ${source.name}'s.`;
  }
  if (conversion.target === "webp") {
    return `Converting ${source.name} to WebP typically produces a noticeably smaller file at similar visual quality, which helps pages load faster and improves Core Web Vitals scores — while still supporting transparency${source.supportsAnimation ? " and animation" : ""}.`;
  }
  if (conversion.target === "png") {
    return `Converting to PNG is useful when you need a lossless, artifact-free image — for example before further editing, or when the image needs a transparent background that ${source.name} can't provide.`;
  }
  if (conversion.target === "jpg") {
    return `Converting to JPG produces a much smaller file, which is useful for email attachments, faster page loads, or any situation where ${target.cons[1] ?? "broad compatibility"} matters more than pixel-perfect accuracy.`;
  }
  return `Converting from ${source.name} to ${target.name} lets you take advantage of ${target.name}'s specific strengths for your use case.`;
}

export interface ComparisonRow {
  label: string;
  source: string;
  target: string;
}

/** Returns an empty array for conversions where a side-by-side format table wouldn't be meaningful (e.g. images -> PDF, video -> audio). */
export function getComparisonRows(conversion: ConversionDefinition): ComparisonRow[] {
  if (conversion.engine !== "image" && conversion.engine !== "video") return [];

  const source = formats[conversion.source];
  const target = formats[conversion.target];

  const compressionLabel = (c: typeof source.compression) =>
    c === "lossy" ? "Lossy" : c === "lossless" ? "Lossless" : c === "none" ? "Uncompressed" : "Lossy or lossless";

  if (conversion.engine === "video") {
    return [
      { label: "Compression", source: compressionLabel(source.compression), target: compressionLabel(target.compression) },
      { label: "Typical use", source: source.commonUses[0], target: target.commonUses[0] },
    ];
  }

  return [
    { label: "Compression", source: compressionLabel(source.compression), target: compressionLabel(target.compression) },
    { label: "Transparency", source: source.supportsTransparency ? "Supported" : "Not supported", target: target.supportsTransparency ? "Supported" : "Not supported" },
    { label: "Animation", source: source.supportsAnimation ? "Supported" : "Not supported", target: target.supportsAnimation ? "Supported" : "Not supported" },
    { label: "Typical use", source: source.commonUses[0], target: target.commonUses[0] },
  ];
}

export function getLimitationNote(conversion: ConversionDefinition): string | null {
  if (conversion.engine === "compress" && conversion.source === "png") {
    return "PNG is lossless, so quality can't be reduced the way JPG or WebP can — increasing the compression level here reduces the image's dimensions instead.";
  }
  if (conversion.engine === "pdf" && conversion.target === "pdf") {
    return "Each image becomes its own page, scaled to fit the page while keeping its aspect ratio. Select multiple files to create a multi-page PDF.";
  }
  if (conversion.engine === "audio") {
    return "The audio engine downloads once (about 30MB) the first time you convert, then stays cached in your browser for future conversions.";
  }
  if (conversion.engine === "video") {
    const base =
      "The video engine downloads once (about 30MB) the first time you convert, then stays cached in your browser for future conversions. Video encoding is CPU-intensive, so longer or higher-resolution clips take noticeably longer than audio extraction.";
    return conversion.target === "gif"
      ? `${base} GIF output has no audio track and is limited to a 256-color palette per frame.`
      : base;
  }
  if (conversion.source === "gif") {
    return "If your GIF is animated, only the first frame will be used — this converter produces a single static image, not an animated output.";
  }
  if (conversion.target === "jpg" && formats[conversion.source].supportsTransparency) {
    return "JPG doesn't support transparency, so any transparent areas in the original image will be filled with a white background.";
  }
  return null;
}
