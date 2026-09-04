export const siteConfig = {
  name: "ConvertMeFiles",
  shortName: "ConvertMeFiles",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://convertmefiles.com",
  description:
    "Convert images, PDFs, audio, and video directly in your browser. No uploads, no waiting, no account required — your files never leave your device.",
  tagline: "Convert files privately, right in your browser.",
  keywords: [
    "file converter",
    "image converter",
    "browser file converter",
    "convert jpg to png",
    "online converter",
    "privacy-friendly converter",
  ],
  contactEmail: "hello@convertmefiles.com",
  links: {
    twitter: "",
    github: "",
  },
  nav: [
    { label: "Tools", href: "/tools" },
    { label: "Formats", href: "/formats" },
    { label: "About", href: "/about" },
  ],
  footerLinks: {
    company: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
    resources: [
      { label: "All Tools", href: "/tools" },
      { label: "File Formats", href: "/formats" },
    ],
  },
  maxImageFileSizeBytes: 40 * 1024 * 1024,
} as const;

export type SiteConfig = typeof siteConfig;
