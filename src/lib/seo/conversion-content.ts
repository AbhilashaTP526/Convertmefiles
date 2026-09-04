import { formats } from "@/config/formats";
import type { ConversionDefinition } from "@/config/conversions";

export function getConversionMeta(conversion: ConversionDefinition) {
  const source = formats[conversion.source];
  const target = formats[conversion.target];
  const title = `${source.name} to ${target.name} Converter`;

  return {
    title,
    metaTitle: `${title} — Convert Online, Right in Your Browser`,
    metaDescription: `Convert ${source.name} to ${target.name} directly in your browser. No upload required — ${source.name} files stay on your device and are converted to ${target.name} instantly.`,
    h1: title,
    intro: `Convert ${source.name} images to ${target.name} instantly and privately. Everything happens on your own device — nothing is uploaded to a server.`,
  };
}

export function getWhatIsParagraph(conversion: ConversionDefinition): string {
  const source = formats[conversion.source];
  const target = formats[conversion.target];
  return `${source.name} to ${target.name} conversion changes a ${source.fullName} image into ${target.fullName} format. ${source.description} ${target.description} Converting between the two lets you pick whichever format best fits where the image is headed next.`;
}

export function getWhyConvertParagraph(conversion: ConversionDefinition): string {
  const source = formats[conversion.source];
  const target = formats[conversion.target];

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

export function getComparisonRows(conversion: ConversionDefinition): ComparisonRow[] {
  const source = formats[conversion.source];
  const target = formats[conversion.target];

  const compressionLabel = (c: typeof source.compression) =>
    c === "lossy" ? "Lossy" : c === "lossless" ? "Lossless" : c === "none" ? "Uncompressed" : "Lossy or lossless";

  return [
    { label: "Compression", source: compressionLabel(source.compression), target: compressionLabel(target.compression) },
    { label: "Transparency", source: source.supportsTransparency ? "Supported" : "Not supported", target: target.supportsTransparency ? "Supported" : "Not supported" },
    { label: "Animation", source: source.supportsAnimation ? "Supported" : "Not supported", target: target.supportsAnimation ? "Supported" : "Not supported" },
    { label: "Typical use", source: source.commonUses[0], target: target.commonUses[0] },
  ];
}

export function getLimitationNote(conversion: ConversionDefinition): string | null {
  if (conversion.source === "gif") {
    return "If your GIF is animated, only the first frame will be used — this converter produces a single static image, not an animated output.";
  }
  if (conversion.target === "jpg" && formats[conversion.source].supportsTransparency) {
    return "JPG doesn't support transparency, so any transparent areas in the original image will be filled with a white background.";
  }
  return null;
}
