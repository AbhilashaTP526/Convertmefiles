# ConvertMeFiles

A privacy-first, SEO-optimized file conversion platform. File conversion runs **entirely in the browser** — no upload, no server processing, no account required. Built with Next.js App Router, TypeScript, and Tailwind CSS.

## Why client-side conversion?

- **Privacy** — your files never leave your device.
- **Cost** — no server CPU/storage for conversions, so it scales to any number of users at near-zero infrastructure cost.
- **Speed** — no upload/download round trip.

## Architecture

```
src/
├── app/                  # Next.js App Router routes (SEO pages, sitemap, robots)
│   ├── [slug]/           # Dynamic conversion pages (jpg-to-png, png-to-jpg, ...)
│   ├── formats/[format]/ # Format info pages (jpg, png, webp, gif, bmp)
│   └── tools/            # Category pages
├── components/
│   ├── converter/        # File dropzone + conversion UI (client)
│   ├── seo/               # FAQ, breadcrumbs, related links, JSON-LD
│   ├── layout/            # Header, footer, mobile nav
│   └── home/               # Homepage-only components (search)
├── config/                # formats.ts + conversions.ts — the data that drives every SEO page
├── hooks/                  # useImageConverter (drives the Web Worker)
├── lib/
│   ├── conversion/         # Pure browser conversion engines (Canvas API)
│   ├── security/           # File validation, magic-byte sniffing, sanitization
│   └── seo/                 # Metadata + structured data generation
└── workers/                 # Web Worker(s) that run heavy conversion off the main thread
```

### Adding a new conversion

Adding the next converter is a **data change**, not a rewrite:

1. Add the format to `src/config/formats.ts` if it doesn't exist yet.
2. Add the source/target pair to `src/config/conversions.ts`.
3. The `/[slug]` page, sitemap, format pages, and internal links all update automatically.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to your production domain before deploying (used for canonical URLs, sitemap, and Open Graph tags).

## Deployment

Designed for zero-cost static hosting (Vercel, Cloudflare Pages). All conversion pages are statically generated at build time — there is no required backend.

## Roadmap

- **Phase 1 (current):** image conversion (JPG, PNG, WebP, GIF, BMP), SEO architecture, format guides.
- **Phase 2:** PDF tools (merge, split, image-to-PDF).
- **Phase 3:** Audio/video conversion via FFmpeg WASM, loaded only on the pages that need it.
- **Phase 4:** Blog/guides, optional accounts, optional server-side fallback for conversions browsers can't handle.
