export const siteConfig = {
  name: "ConvertMeFiles",
  shortName: "ConvertMeFiles",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://convertmefiles.com",
  description:
    "Convert images, PDFs, and audio in seconds — no uploads, no sign-up, no limits. Your files stay private and secure, and it's always free to use.",
  tagline: "Fast, free, and completely private file conversion.",
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
