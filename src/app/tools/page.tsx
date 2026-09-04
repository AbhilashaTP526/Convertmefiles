import type { Metadata } from "next";
import Link from "next/link";
import { FiFileText, FiImage, FiMusic, FiVideo } from "react-icons/fi";
import { conversions } from "@/config/conversions";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "All Conversion Tools",
  description: "Browse every file converter, organized by category — image, PDF, audio, and video.",
  alternates: { canonical: "/tools" },
};

const imageCount = conversions.filter((c) => c.engine === "image").length;
const pdfCount = conversions.filter((c) => c.engine === "pdf").length + 1; // + Merge PDF
const audioCount = conversions.filter((c) => c.engine === "audio" || c.engine === "video").length;

const categories = [
  { icon: FiImage, name: "Image", href: "/tools/image", count: imageCount, live: true },
  { icon: FiFileText, name: "PDF", href: "/tools/pdf", count: pdfCount, live: true },
  { icon: FiMusic, name: "Audio", href: "/tools/audio", count: audioCount, live: true },
  { icon: FiVideo, name: "Video", href: "#", count: 0, live: false },
];

export default function ToolsIndexPage() {
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Tools", path: "/tools" }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900">All Conversion Tools</h1>
      <p className="mt-3 max-w-2xl text-lg text-zinc-600">
        Every converter runs locally in your browser. Pick a category to see the available tools.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const content = (
            <>
              <Icon aria-hidden size={26} className="text-indigo-600" />
              <p className="mt-3 text-lg font-semibold text-zinc-900">{cat.name}</p>
              <p className="mt-1 text-sm text-zinc-500">
                {cat.live ? `${cat.count} converters available` : "Coming soon"}
              </p>
            </>
          );
          return cat.live ? (
            <Link key={cat.name} href={cat.href} className="rounded-xl border border-zinc-200 p-6 hover:border-indigo-300 hover:shadow-sm">
              {content}
            </Link>
          ) : (
            <div key={cat.name} className="rounded-xl border border-dashed border-zinc-200 p-6 opacity-60">
              {content}
            </div>
          );
        })}
      </div>
    </Container>
  );
}
