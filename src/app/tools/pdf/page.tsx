import type { Metadata } from "next";
import Link from "next/link";
import { conversions } from "@/config/conversions";
import { getConversionMeta } from "@/lib/seo/conversion-content";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "PDF Tools",
  description: "Create and merge PDF files for free, right in your browser — no upload required.",
  alternates: { canonical: "/tools/pdf" },
};

const pdfConversions = conversions.filter((c) => c.engine === "pdf");

export default function PdfToolsPage() {
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Tools", path: "/tools" }, { name: "PDF", path: "/tools/pdf" }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900">PDF Tools</h1>
      <p className="mt-3 max-w-2xl text-lg text-zinc-600">
        Create and combine PDF files locally in your browser — no upload required.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pdfConversions.map((c) => {
          const meta = getConversionMeta(c);
          return (
            <Link key={c.slug} href={`/${c.slug}`} className="rounded-xl border border-zinc-200 p-5 hover:border-indigo-300 hover:shadow-sm">
              <p className="font-semibold text-zinc-900">{meta.title}</p>
              <p className="mt-1 text-sm text-zinc-500">Free, private, and instant</p>
            </Link>
          );
        })}
        <Link href="/merge-pdf" className="rounded-xl border border-zinc-200 p-5 hover:border-indigo-300 hover:shadow-sm">
          <p className="font-semibold text-zinc-900">Merge PDF Files</p>
          <p className="mt-1 text-sm text-zinc-500">Combine multiple PDFs into one</p>
        </Link>
      </div>
    </Container>
  );
}
