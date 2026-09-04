import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${siteConfig.name} and why file conversion happens in your browser instead of on a server.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <Container className="max-w-3xl space-y-6 py-12">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }]} />
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">About {siteConfig.shortName}</h1>
      <p className="leading-relaxed text-zinc-600">
        {siteConfig.shortName} is a free file conversion platform built around one core idea: your files belong on
        your device, not on someone else’s server. Most online converters work by uploading your file, processing it
        remotely, and sending back a result — which means your photos, documents, and personal files pass through
        infrastructure you have no visibility into.
      </p>
      <p className="leading-relaxed text-zinc-600">
        We built this platform differently. Conversions run using your browser’s own JavaScript and Canvas APIs, so
        the file never leaves your device. There’s nothing to upload, nothing stored on a server, and nothing to
        worry about once you close the tab.
      </p>
      <h2 className="text-xl font-bold text-zinc-900">Why it matters</h2>
      <p className="leading-relaxed text-zinc-600">
        Browser-based conversion is also just faster. There’s no upload time, no queue, and no server cost passed
        along to you — which is why {siteConfig.shortName} is, and will stay, free to use.
      </p>
      <h2 className="text-xl font-bold text-zinc-900">What’s next</h2>
      <p className="leading-relaxed text-zinc-600">
        We’re actively expanding the set of supported formats and tools, including PDF utilities and audio/video
        conversion powered by WebAssembly. Wherever a conversion genuinely can’t be done reliably in a browser,
        we’ll be upfront about it.
      </p>
    </Container>
  );
}
