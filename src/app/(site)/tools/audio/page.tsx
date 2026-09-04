import type { Metadata } from "next";
import Link from "next/link";
import { conversions } from "@/config/conversions";
import { getConversionMeta } from "@/lib/seo/conversion-content";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Audio Tools",
  description: "Extract and convert audio from video files for free, right in your browser — no upload required.",
  alternates: { canonical: "/tools/audio" },
};

const audioConversions = conversions.filter((c) => c.engine === "audio" || c.engine === "video");

export default function AudioToolsPage() {
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Tools", path: "/tools" }, { name: "Audio", path: "/tools/audio" }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900">Audio Tools</h1>
      <p className="mt-3 max-w-2xl text-lg text-zinc-600">
        Extract audio from video files locally in your browser, powered by a WebAssembly build of FFmpeg — no upload
        required.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {audioConversions.map((c) => {
          const meta = getConversionMeta(c);
          return (
            <Link key={c.slug} href={`/${c.slug}`} className="rounded-xl border border-zinc-200 p-5 hover:border-indigo-300 hover:shadow-sm">
              <p className="font-semibold text-zinc-900">{meta.title}</p>
              <p className="mt-1 text-sm text-zinc-500">Free, private, and instant</p>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
