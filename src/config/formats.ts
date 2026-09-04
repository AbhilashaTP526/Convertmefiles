export type FormatCategory = "image" | "document" | "audio" | "video";

export type ImageFormatId = "jpg" | "png" | "webp" | "gif" | "bmp";
export type DocumentFormatId = "pdf";
export type AudioFormatId = "mp3";
export type VideoFormatId = "mp4";
export type FormatId = ImageFormatId | DocumentFormatId | AudioFormatId | VideoFormatId;

export interface FormatDefinition {
  id: FormatId;
  name: string;
  fullName: string;
  category: FormatCategory;
  extensions: string[];
  mimeTypes: string[];
  description: string;
  pros: string[];
  cons: string[];
  commonUses: string[];
  howToOpen: string;
  compression: "lossy" | "lossless" | "lossy-or-lossless" | "none";
  supportsTransparency: boolean;
  supportsAnimation: boolean;
  relatedFormats: FormatId[];
}

export const formats: Record<FormatId, FormatDefinition> = {
  jpg: {
    id: "jpg",
    name: "JPG",
    fullName: "JPEG (Joint Photographic Experts Group)",
    category: "image",
    extensions: [".jpg", ".jpeg"],
    mimeTypes: ["image/jpeg"],
    description:
      "JPG (or JPEG) is a lossy raster image format built for photographs. It compresses images by discarding image data that's hard for the human eye to notice, producing small files at the cost of some quality on repeated saves.",
    pros: [
      "Very small file sizes, ideal for web and email",
      "Supported by virtually every device, browser, and app",
      "Excellent for photographs with smooth color gradients",
    ],
    cons: [
      "Lossy compression means quality degrades with repeated edits",
      "No support for transparency",
      "Not well suited to sharp text, line art, or flat graphics",
    ],
    commonUses: [
      "Digital photography",
      "Website and blog images",
      "Email attachments and social media uploads",
    ],
    howToOpen:
      "Opens natively in every web browser, operating system photo viewer, and image editor — no extra software required.",
    compression: "lossy",
    supportsTransparency: false,
    supportsAnimation: false,
    relatedFormats: ["png", "webp", "gif", "bmp"],
  },
  png: {
    id: "png",
    name: "PNG",
    fullName: "Portable Network Graphics",
    category: "image",
    extensions: [".png"],
    mimeTypes: ["image/png"],
    description:
      "PNG is a lossless raster format designed for the web. It preserves every pixel exactly and supports full alpha-channel transparency, making it the standard choice for graphics, logos, and screenshots.",
    pros: [
      "Lossless compression — no quality loss, ever",
      "Full transparency (alpha channel) support",
      "Sharp, artifact-free rendering of text and flat graphics",
    ],
    cons: [
      "Larger file sizes than JPG or WebP for photographs",
      "No native support for animation (aside from the rarely used APNG variant)",
    ],
    commonUses: [
      "Logos and icons",
      "Screenshots",
      "Graphics that require a transparent background",
    ],
    howToOpen:
      "Supported natively by every modern browser, operating system, and image editor.",
    compression: "lossless",
    supportsTransparency: true,
    supportsAnimation: false,
    relatedFormats: ["jpg", "webp", "gif", "bmp"],
  },
  webp: {
    id: "webp",
    name: "WebP",
    fullName: "WebP",
    category: "image",
    extensions: [".webp"],
    mimeTypes: ["image/webp"],
    description:
      "WebP is a modern image format developed by Google that supports both lossy and lossless compression, transparency, and animation — typically producing smaller files than JPG or PNG at comparable quality.",
    pros: [
      "Smaller file sizes than JPG or PNG at similar visual quality",
      "Supports both transparency and animation",
      "Supported by every modern browser",
    ],
    cons: [
      "Older software and some legacy image editors don't support it",
      "Occasionally needs converting back to JPG/PNG for compatibility",
    ],
    commonUses: [
      "Modern website images for faster page loads",
      "Responsive images and Core Web Vitals optimization",
    ],
    howToOpen:
      "Opens in all modern browsers (Chrome, Firefox, Safari, Edge) and current versions of most operating systems and photo apps.",
    compression: "lossy-or-lossless",
    supportsTransparency: true,
    supportsAnimation: true,
    relatedFormats: ["jpg", "png", "gif", "bmp"],
  },
  gif: {
    id: "gif",
    name: "GIF",
    fullName: "Graphics Interchange Format",
    category: "image",
    extensions: [".gif"],
    mimeTypes: ["image/gif"],
    description:
      "GIF is a raster format limited to a 256-color palette. It's lossless within that palette and is best known for supporting simple frame-by-frame animation.",
    pros: [
      "Universally supported, even by very old software",
      "Supports simple animation",
      "Lossless within its 256-color palette",
    ],
    cons: [
      "Limited to 256 colors — poor choice for photographs",
      "Only supports 1-bit (on/off) transparency",
      "Animated GIFs can be large compared to modern video formats",
    ],
    commonUses: [
      "Simple animations and reaction images",
      "Small icons with limited colors",
    ],
    howToOpen:
      "Opens natively in every browser and image viewer.",
    compression: "lossless",
    supportsTransparency: true,
    supportsAnimation: true,
    relatedFormats: ["png", "webp", "jpg"],
  },
  bmp: {
    id: "bmp",
    name: "BMP",
    fullName: "Bitmap Image File",
    category: "image",
    extensions: [".bmp"],
    mimeTypes: ["image/bmp", "image/x-ms-bmp"],
    description:
      "BMP is an uncompressed (or minimally compressed) raster format originally built for Windows. Every pixel is stored directly, so files are lossless but often very large.",
    pros: [
      "Lossless — no compression artifacts",
      "Simple, well-documented file structure",
    ],
    cons: [
      "Very large file sizes compared to PNG or JPG",
      "Poor support outside of Windows-native applications",
      "Rarely used for the modern web",
    ],
    commonUses: [
      "Legacy Windows applications",
      "Simple raster image storage where compression isn't a concern",
    ],
    howToOpen:
      "Opens in Windows Photos, most desktop image viewers, and all modern browsers.",
    compression: "none",
    supportsTransparency: false,
    supportsAnimation: false,
    relatedFormats: ["png", "jpg"],
  },
  pdf: {
    id: "pdf",
    name: "PDF",
    fullName: "Portable Document Format",
    category: "document",
    extensions: [".pdf"],
    mimeTypes: ["application/pdf"],
    description:
      "PDF is a document format that preserves layout, fonts, and images exactly as designed, regardless of the device, operating system, or software used to view it — which is why it's the standard for sharing finished documents.",
    pros: [
      "Looks identical on every device and operating system",
      "Can contain text, images, and vector graphics in one file",
      "Supports merging, page extraction, and digital signatures",
    ],
    cons: [
      "Not designed for easy editing once created",
      "Can produce larger files than plain text or image formats",
      "Complex PDFs (forms, layers) aren't always portable between tools",
    ],
    commonUses: [
      "Sharing finished documents, invoices, and reports",
      "Printing and archiving",
      "Combining scanned pages or images into one file",
    ],
    howToOpen:
      "Opens natively in every modern browser, and in dedicated readers like Adobe Acrobat, Preview (macOS), and most operating systems' built-in viewers.",
    compression: "lossy-or-lossless",
    supportsTransparency: false,
    supportsAnimation: false,
    relatedFormats: ["jpg", "png"],
  },
  mp3: {
    id: "mp3",
    name: "MP3",
    fullName: "MPEG-1 Audio Layer III",
    category: "audio",
    extensions: [".mp3"],
    mimeTypes: ["audio/mpeg"],
    description:
      "MP3 is a lossy audio format that compresses sound by removing frequencies the human ear barely notices. It remains the most universally compatible audio format for music and voice.",
    pros: [
      "Small file sizes at good perceptual quality",
      "Playable on virtually every device, app, and car stereo",
      "Widely supported for podcasts, music, and voice recordings",
    ],
    cons: [
      "Lossy compression discards some audio detail",
      "Not ideal for professional audio mastering",
    ],
    commonUses: [
      "Music and podcasts",
      "Extracting the audio track from a video",
      "Voice memos and recordings",
    ],
    howToOpen:
      "Plays natively in every browser, phone, and media player without additional software.",
    compression: "lossy",
    supportsTransparency: false,
    supportsAnimation: false,
    relatedFormats: ["mp4"],
  },
  mp4: {
    id: "mp4",
    name: "MP4",
    fullName: "MPEG-4 Part 14",
    category: "video",
    extensions: [".mp4"],
    mimeTypes: ["video/mp4"],
    description:
      "MP4 is the most widely supported video container format, typically pairing H.264 video with AAC audio. It's the default format for video recorded on phones and shared online.",
    pros: [
      "Plays natively on virtually every device and browser",
      "Good compression-to-quality ratio for video",
      "Can store video, audio, and subtitle tracks together",
    ],
    cons: [
      "Not ideal for further lossless editing without re-encoding",
      "Extracting just the audio requires re-encoding to an audio format",
    ],
    commonUses: [
      "Phone and camera video recordings",
      "Video shared on the web and social media",
      "Source material for extracting audio (e.g. to MP3)",
    ],
    howToOpen:
      "Plays natively in every modern browser and video player, on desktop and mobile.",
    compression: "lossy",
    supportsTransparency: false,
    supportsAnimation: false,
    relatedFormats: ["mp3"],
  },
};

export const formatList = Object.values(formats);
