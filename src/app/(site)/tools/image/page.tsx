import type { Metadata } from "next";
import Link from "next/link";
import { conversions } from "@/config/conversions";
import { getConversionMeta } from "@/lib/seo/conversion-content";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Image Converters",
  description: "Convert and compress images between JPG, PNG, WebP, GIF, and BMP — free, private, and instant, right in your browser.",
  alternates: { canonical: "/tools/image" },
};

const imageConversions = conversions.filter((c) => c.engine === "image");
const compressConversions = conversions.filter((c) => c.engine === "compress");

export default function ImageToolsPage() {
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Tools", path: "/tools" }, { name: "Image", path: "/tools/image" }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900">Image Converters</h1>
      <p className="mt-3 max-w-2xl text-lg text-zinc-600">
        Convert between JPG, PNG, WebP, GIF, and BMP, or shrink a file&rsquo;s size without changing its format. All
        processing runs locally in your browser — no upload required.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {imageConversions.map((c) => {
          const meta = getConversionMeta(c);
          return (
            <Link key={c.slug} href={`/${c.slug}`} className="rounded-xl border border-zinc-200 p-5 hover:border-indigo-300 hover:shadow-sm">
              <p className="font-semibold text-zinc-900">{meta.title}</p>
              <p className="mt-1 text-sm text-zinc-500">Free, private, and instant</p>
            </Link>
          );
        })}
      </div>

      <h2 className="mt-12 text-xl font-bold text-zinc-900">Compress images</h2>
      <p className="mt-2 max-w-2xl text-zinc-600">Reduce a file&rsquo;s size while keeping the same format.</p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {compressConversions.map((c) => {
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
