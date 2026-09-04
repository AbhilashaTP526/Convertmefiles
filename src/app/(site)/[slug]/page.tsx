import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { conversions, conversionBySlug, getRelatedConversions } from "@/config/conversions";
import { formats } from "@/config/formats";
import {
  getConversionMeta,
  getWhatIsParagraph,
  getWhyConvertParagraph,
  getComparisonRows,
  getLimitationNote,
  getEngineDescription,
} from "@/lib/seo/conversion-content";
import { buildWebApplicationJsonLd, buildFaqJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FaqSection } from "@/components/seo/faq-section";
import { RelatedLinks } from "@/components/seo/related-links";
import { JsonLd } from "@/components/seo/json-ld";
import { ImageConverter } from "@/components/converter/image-converter";
import { PdfFromImagesConverter } from "@/components/converter/pdf-from-images-converter";
import { AudioConverter } from "@/components/converter/audio-converter";
import { articleFor } from "@/lib/utils/grammar";
import { AdPlacement } from "@/components/ads/ad-placement";
import { FiCheckCircle, FiInfo } from "react-icons/fi";

export const dynamicParams = false;

export function generateStaticParams() {
  return conversions.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const conversion = conversionBySlug[slug];
  if (!conversion) return {};
  const meta = getConversionMeta(conversion);
  return {
    title: meta.title,
    description: meta.metaDescription,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title: meta.metaTitle,
      description: meta.metaDescription,
      url: `/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: meta.metaTitle,
      description: meta.metaDescription,
    },
  };
}

export default async function ConversionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const conversion = conversionBySlug[slug];
  if (!conversion) notFound();

  const source = formats[conversion.source];
  const target = formats[conversion.target];
  const meta = getConversionMeta(conversion);
  const comparisonRows = getComparisonRows(conversion);
  const limitationNote = getLimitationNote(conversion);
  const related = getRelatedConversions(conversion);

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools" },
    { name: meta.title, path: `/${slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          buildWebApplicationJsonLd(conversion, meta.metaTitle, meta.metaDescription),
          buildFaqJsonLd(conversion.faqs),
          buildBreadcrumbJsonLd(breadcrumbItems),
        ]}
      />

      <Container className="py-8">
        <Breadcrumbs items={breadcrumbItems} />
      </Container>

      <Container className="max-w-3xl pb-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">{meta.h1}</h1>
        <p className="mt-3 text-lg text-zinc-600">{meta.intro}</p>
      </Container>

      <Container className="max-w-3xl py-6">
        {conversion.engine === "pdf" ? (
          <PdfFromImagesConverter conversion={conversion} />
        ) : conversion.engine === "audio" || conversion.engine === "video" ? (
          <AudioConverter conversion={conversion} />
        ) : (
          <ImageConverter conversion={conversion} />
        )}
        {limitationNote && (
          <p className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            <FiInfo aria-hidden className="mt-0.5 shrink-0" />
            <span>{limitationNote}</span>
          </p>
        )}
        <AdPlacement slotKey="belowConverter" />
      </Container>

      <Container className="max-w-3xl space-y-12 py-12">
        <section>
          <h2 className="text-xl font-bold text-zinc-900">
            What is {source.name} to {target.name} conversion?
          </h2>
          <p className="mt-3 leading-relaxed text-zinc-600">{getWhatIsParagraph(conversion)}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-zinc-900">
            How to convert {source.name} to {target.name}
          </h2>
          <ol className="mt-3 space-y-2">
            {[
              `Choose ${articleFor(source.name)} ${source.name} file using the drop zone above (or drag and drop it in).`,
              `Wait a moment while your browser converts the file locally.`,
              `Click "Download" to save your new ${target.name} file.`,
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-zinc-600">
                <FiCheckCircle aria-hidden className="mt-0.5 shrink-0 text-emerald-600" />
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-bold text-zinc-900">
            Why convert {source.name} to {target.name}?
          </h2>
          <p className="mt-3 leading-relaxed text-zinc-600">{getWhyConvertParagraph(conversion)}</p>
        </section>

        {comparisonRows.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-zinc-900">
              {source.name} vs {target.name}
            </h2>
            <div className="mt-3 overflow-x-auto rounded-lg border border-zinc-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 text-zinc-500">
                  <tr>
                    <th className="p-3 font-medium">Property</th>
                    <th className="p-3 font-medium">{source.name}</th>
                    <th className="p-3 font-medium">{target.name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {comparisonRows.map((row) => (
                    <tr key={row.label}>
                      <td className="p-3 font-medium text-zinc-700">{row.label}</td>
                      <td className="p-3 text-zinc-600">{row.source}</td>
                      <td className="p-3 text-zinc-600">{row.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xl font-bold text-zinc-900">Is this conversion private?</h2>
          <p className="mt-3 leading-relaxed text-zinc-600">
            Yes. This {source.name} to {target.name} converter runs entirely in your browser using{" "}
            {getEngineDescription(conversion)} — your file is never uploaded to our servers, stored, or logged.
            Closing this tab discards everything.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-zinc-900">Supported browsers</h2>
          <p className="mt-3 leading-relaxed text-zinc-600">
            This converter works in all modern browsers, including Chrome, Firefox, Safari, and Edge, on both desktop
            and mobile (Android and iOS).
          </p>
        </section>

        <FaqSection faqs={conversion.faqs} />

        <AdPlacement slotKey="belowContent" />

        <RelatedLinks
          title="Related converters"
          links={related.map((c) => ({ label: getConversionMeta(c).title, href: `/${c.slug}` }))}
        />

        <RelatedLinks
          title="Related file formats"
          links={[
            { label: `${source.name} format`, href: `/formats/${source.id}`, description: source.fullName },
            { label: `${target.name} format`, href: `/formats/${target.id}`, description: target.fullName },
          ]}
        />

        <p className="text-sm text-zinc-500">
          Looking for other tools?{" "}
          <Link href="/tools" className="font-medium text-indigo-600 hover:underline">
            Browse all converters
          </Link>
          .
        </p>
      </Container>
    </>
  );
}
