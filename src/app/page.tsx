import Link from "next/link";
import type { Metadata } from "next";
import { FiFileText, FiImage, FiLock, FiMusic, FiShield, FiSmartphone, FiVideo, FiZap } from "react-icons/fi";
import { siteConfig } from "@/config/site";
import { conversions } from "@/config/conversions";
import { formatList } from "@/config/formats";
import { getConversionMeta } from "@/lib/seo/conversion-content";
import { Container } from "@/components/ui/container";
import { FaqSection } from "@/components/seo/faq-section";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Free Private File Converter",
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

const categories = [
  { icon: FiImage, name: "Image", description: "JPG, PNG, WebP, GIF, BMP", href: "/tools/image", live: true },
  { icon: FiFileText, name: "PDF", description: "Image to PDF, merge PDFs", href: "/tools/pdf", live: true },
  { icon: FiMusic, name: "Audio", description: "Extract MP3 from video", href: "/tools/audio", live: true },
  { icon: FiVideo, name: "Video", description: "MP4, WebM conversion", href: "#", live: false },
];

const privacyPoints = [
  { icon: FiLock, title: "No uploads", body: "Files are processed with your browser's built-in tools — they never leave your device." },
  { icon: FiZap, title: "Instant results", body: "There's no queue and no waiting on a server. Conversion starts the moment you pick a file." },
  { icon: FiSmartphone, title: "Works everywhere", body: "Runs in any modern browser on desktop, Android, or iPhone — no app to install." },
];

const homeFaqs = [
  {
    question: "Do I need to create an account?",
    answer: `No. ${siteConfig.name} is free to use with no sign-up required.`,
  },
  {
    question: "Are my files really not uploaded anywhere?",
    answer:
      "For every converter currently on the site, conversion happens entirely inside your browser — using the Canvas API for images, pdf-lib for PDFs, and a WebAssembly build of FFmpeg for audio — your files are never sent to our servers.",
  },
  {
    question: "Is there a file size limit?",
    answer: "Yes, individual files are capped at 40MB so conversion stays fast and reliable across devices.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteConfig.name,
          url: siteConfig.url,
          description: siteConfig.description,
        }}
      />
      <section className="border-b border-zinc-100 bg-gradient-to-b from-indigo-50/60 to-white py-16 sm:py-24">
        <Container className="text-center">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Convert files privately — fast, free, and secure
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-zinc-600">{siteConfig.description}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {conversions.slice(0, 4).map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:border-indigo-300 hover:text-indigo-700"
              >
                {getConversionMeta(c).title}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <h2 className="text-2xl font-bold text-zinc-900">Popular converters</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {conversions.map((c) => {
              const meta = getConversionMeta(c);
              return (
                <Link
                  key={c.slug}
                  href={`/${c.slug}`}
                  className="rounded-xl border border-zinc-200 p-5 transition-colors hover:border-indigo-300 hover:shadow-sm"
                >
                  <p className="font-semibold text-zinc-900">{meta.title}</p>
                  <p className="mt-1 text-sm text-zinc-500">Free, private, and instant</p>
                </Link>
              );
            })}
            <Link
              href="/merge-pdf"
              className="rounded-xl border border-zinc-200 p-5 transition-colors hover:border-indigo-300 hover:shadow-sm"
            >
              <p className="font-semibold text-zinc-900">Merge PDF Files</p>
              <p className="mt-1 text-sm text-zinc-500">Free, private, and instant</p>
            </Link>
          </div>
        </Container>
      </section>

      <section className="border-y border-zinc-100 bg-zinc-50 py-16">
        <Container>
          <h2 className="text-2xl font-bold text-zinc-900">Browse by category</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const content = (
                <>
                  <Icon aria-hidden size={24} className="text-indigo-600" />
                  <p className="mt-3 font-semibold text-zinc-900">{cat.name}</p>
                  <p className="mt-1 text-sm text-zinc-500">{cat.description}</p>
                  {!cat.live && <p className="mt-2 text-xs font-medium text-zinc-400">Coming soon</p>}
                </>
              );
              return cat.live ? (
                <Link key={cat.name} href={cat.href} className="rounded-xl border border-zinc-200 bg-white p-5 hover:border-indigo-300 hover:shadow-sm">
                  {content}
                </Link>
              ) : (
                <div key={cat.name} className="rounded-xl border border-dashed border-zinc-200 bg-white p-5 opacity-70">
                  {content}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="flex items-center gap-2">
            <FiShield aria-hidden className="text-indigo-600" size={22} />
            <h2 className="text-2xl font-bold text-zinc-900">Why convert with {siteConfig.shortName}?</h2>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {privacyPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div key={point.title}>
                  <Icon aria-hidden size={22} className="text-indigo-600" />
                  <p className="mt-3 font-semibold text-zinc-900">{point.title}</p>
                  <p className="mt-1 text-sm text-zinc-600">{point.body}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-t border-zinc-100 bg-zinc-50 py-16">
        <Container>
          <h2 className="text-2xl font-bold text-zinc-900">File format guides</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {formatList.map((f) => (
              <Link
                key={f.id}
                href={`/formats/${f.id}`}
                className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:border-indigo-300 hover:text-indigo-700"
              >
                {f.name} format
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="max-w-3xl">
          <FaqSection faqs={homeFaqs} />
        </Container>
      </section>
    </>
  );
}
