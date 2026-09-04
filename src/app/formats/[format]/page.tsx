import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FiCheck, FiX } from "react-icons/fi";
import { formats, formatList, type FormatId } from "@/config/formats";
import { getConversionsFor } from "@/config/conversions";
import { getConversionMeta } from "@/lib/seo/conversion-content";
import { buildFormatArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { RelatedLinks } from "@/components/seo/related-links";
import { JsonLd } from "@/components/seo/json-ld";

export function generateStaticParams() {
  return formatList.map((f) => ({ format: f.id }));
}

export const dynamicParams = false;

function getFormat(id: string) {
  return (formats as Record<string, (typeof formats)[FormatId]>)[id];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ format: string }>;
}): Promise<Metadata> {
  const { format: id } = await params;
  const format = getFormat(id);
  if (!format) return {};
  const title = `${format.name} File Format`;
  const description = `${format.fullName}: extensions, MIME type, common uses, pros and cons, and how to convert ${format.name} files.`;
  return {
    title,
    description,
    alternates: { canonical: `/formats/${id}` },
  };
}

export default async function FormatPage({
  params,
}: {
  params: Promise<{ format: string }>;
}) {
  const { format: id } = await params;
  const format = getFormat(id);
  if (!format) notFound();

  const relatedConversions = getConversionsFor(format.id);
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Formats", path: "/formats" },
    { name: format.name, path: `/formats/${format.id}` },
  ];

  return (
    <>
      <JsonLd data={[buildFormatArticleJsonLd(format), buildBreadcrumbJsonLd(breadcrumbItems)]} />

      <Container className="py-8">
        <Breadcrumbs items={breadcrumbItems} />
      </Container>

      <Container className="max-w-3xl space-y-10 pb-16">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">{format.fullName}</h1>
          <p className="mt-3 text-lg text-zinc-600">{format.description}</p>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoCard label="Extensions" value={format.extensions.join(", ")} />
          <InfoCard label="MIME type(s)" value={format.mimeTypes.join(", ")} />
          <InfoCard label="Compression" value={formatCompressionLabel(format.compression)} />
          <InfoCard label="Transparency" value={format.supportsTransparency ? "Supported" : "Not supported"} />
        </section>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Advantages</h2>
            <ul className="mt-3 space-y-2">
              {format.pros.map((pro) => (
                <li key={pro} className="flex items-start gap-2 text-sm text-zinc-600">
                  <FiCheck aria-hidden className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Disadvantages</h2>
            <ul className="mt-3 space-y-2">
              {format.cons.map((con) => (
                <li key={con} className="flex items-start gap-2 text-sm text-zinc-600">
                  <FiX aria-hidden className="mt-0.5 shrink-0 text-red-500" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-zinc-900">Common uses</h2>
          <ul className="mt-3 list-inside list-disc space-y-1 text-zinc-600">
            {format.commonUses.map((use) => (
              <li key={use}>{use}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-zinc-900">How to open a {format.name} file</h2>
          <p className="mt-3 leading-relaxed text-zinc-600">{format.howToOpen}</p>
        </section>

        <RelatedLinks
          title={`Popular ${format.name} conversions`}
          links={relatedConversions.map((c) => ({ label: getConversionMeta(c).title, href: `/${c.slug}` }))}
        />

        <RelatedLinks
          title="Related formats"
          links={format.relatedFormats.map((id) => ({
            label: `${formats[id].name} format`,
            href: `/formats/${id}`,
            description: formats[id].fullName,
          }))}
        />
      </Container>
    </>
  );
}

function formatCompressionLabel(c: string) {
  if (c === "lossy") return "Lossy";
  if (c === "lossless") return "Lossless";
  if (c === "none") return "Uncompressed";
  return "Lossy or lossless";
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">{label}</p>
      <p className="mt-1 font-medium text-zinc-800">{value}</p>
    </div>
  );
}
