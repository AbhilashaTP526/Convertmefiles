# ConvertMeFiles

A privacy-first, SEO-optimized file conversion platform. File conversion runs **entirely in the browser** — no upload, no server processing, no account required. Built with Next.js App Router, TypeScript, and Tailwind CSS.

## Why client-side conversion?

- **Privacy** — your files never leave your device.
- **Cost** — no server CPU/storage for conversions, so it scales to any number of users at near-zero infrastructure cost.
- **Speed** — no upload/download round trip.

## Architecture

```
src/
├── app/
│   ├── (site)/            # Every public page — has its own layout (header/footer/ads)
│   │   ├── [slug]/         # Dynamic conversion pages (jpg-to-png, mp4-to-mp3, ...)
│   │   ├── formats/[format]/ # Format info pages
│   │   ├── tools/           # Category pages (image, pdf, audio)
│   │   └── merge-pdf/        # The one tool that doesn't fit the source→target slug pattern
│   ├── admin/               # Password-protected admin panel (its own layout, no public chrome)
│   │   └── (dashboard)/      # Nav-wrapped pages: / (stats) and /adsense (settings)
│   ├── api/
│   │   ├── admin/            # Protected: login, logout, settings, stats
│   │   └── track/             # Public, rate-limited: aggregate pageview/conversion events
│   ├── robots.ts / sitemap.ts # Public-page-only; /admin and /api are excluded
│   └── layout.tsx             # Minimal root shell — fonts, <html>/<body>, no chrome
├── proxy.ts                    # Gates /admin and /api/admin behind the session cookie
├── components/
│   ├── converter/               # File dropzone + conversion UI (client) — image/pdf/audio
│   ├── ads/                      # AdSense loader + slot components, driven by admin settings
│   ├── admin/                     # Admin-only UI (login form, nav, stat tiles, charts)
│   ├── analytics/                  # PageViewTracker (fires on route change)
│   ├── seo/                         # FAQ, breadcrumbs, related links, JSON-LD
│   └── layout/                       # Public header, footer, mobile nav
├── config/                          # formats.ts + conversions.ts — the data that drives every SEO page
├── hooks/                            # useImageConverter (drives the image Web Worker)
├── lib/
│   ├── conversion/                    # Pure browser conversion engines (Canvas API, pdf-lib, ffmpeg.wasm)
│   ├── security/                       # File validation, magic-byte sniffing, sanitization
│   ├── seo/                             # Metadata + structured data generation
│   ├── analytics/                        # Client-side event tracking helper
│   └── admin/                             # KV client, session auth, settings, stats, rate limiting
└── workers/                                # Web Worker(s) that run heavy conversion off the main thread
```

### Adding a new conversion

Adding the next converter is a **data change**, not a rewrite:

1. Add the format to `src/config/formats.ts` if it doesn't exist yet.
2. Add the source/target pair (and engine) to `src/config/conversions.ts`.
3. The `/[slug]` page, sitemap, format pages, and internal links all update automatically.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local`. Only `NEXT_PUBLIC_SITE_URL` matters for the core converter site; the rest are for the admin panel (see below) and can be left blank while you're just working on converters.

## Admin panel (`/admin`)

A password-protected dashboard for **analytics** (page views, conversion funnel, all tracked as aggregate counts — no PII) and **AdSense** (paste your publisher ID and ad slot IDs; ads appear immediately, no redeploy). It needs two things, both one-time setup:

1. **A password.** Set `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` (a random 32+ character string — `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` generates one) as environment variables.
2. **Storage.** In your Vercel project: **Storage → Create Database → Upstash Redis** (the free tier is generous), then connect it to the project. Vercel injects `KV_REST_API_URL` / `KV_REST_API_TOKEN` automatically — you don't need to copy them by hand. Redeploy once after connecting it.

Without step 2, the site still works completely normally — the admin panel just shows a banner explaining that analytics/settings aren't connected yet, and ads stay off. Nothing about the core converters depends on this.

Once both are set, sign in at `/admin`. Toggling ads on/off or changing ad slot IDs takes effect on the next page load — genuinely no code changes needed after initial setup.

## Deployment

Designed for zero-cost static hosting (Vercel, Cloudflare Pages). All conversion pages are statically generated at build time — there is no required backend for the converters themselves. The admin panel is the one part of the app that's server-rendered (it needs to check your session cookie on every request).

## Roadmap

- **Phase 1 (done):** image conversion (JPG, PNG, WebP, GIF, BMP), SEO architecture, format guides.
- **Phase 2 (done):** PDF tools — image-to-PDF, merge PDF.
- **Phase 3 (done):** Audio conversion (MP4 → MP3) via FFmpeg WASM, self-hosted and loaded only on the pages that need it.
- **Phase 4 (current):** Admin panel — built-in analytics dashboard, AdSense management.
- **Next up:** video conversion (MP4 ↔ WebM, MKV → MP4) using the same FFmpeg engine; blog/guides; optional server-side fallback for conversions browsers can't handle.
