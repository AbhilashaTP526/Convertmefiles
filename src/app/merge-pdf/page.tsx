import type { Metadata } from "next";
import { FiCheckCircle } from "react-icons/fi";
import { siteConfig } from "@/config/site";
import { buildFaqJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FaqSection } from "@/components/seo/faq-section";
import { RelatedLinks } from "@/components/seo/related-links";
import { JsonLd } from "@/components/seo/json-ld";
import { PdfMergeTool } from "@/components/converter/pdf-merge-tool";

export const metadata: Metadata = {
  title: "Merge PDF Files",
  description: "Combine multiple PDF files into one document, free and private, right in your browser. No upload required.",
  alternates: { canonical: "/merge-pdf" },
};

const faqs = [
  {
    question: "How do I merge PDF files?",
    answer: "Add two or more PDF files using the drop zone above — they'll be combined in the order you add them. Click \"Merge\" and download the result.",
  },
  {
    question: "Is this PDF merge tool free?",
    answer: "Yes. It's completely free with no sign-up and no limit on how many times you use it.",
  },
  {
    question: "Are my PDF files uploaded to a server?",
    answer: "No. Merging happens entirely inside your browser using the pdf-lib library. Your files are never uploaded, stored, or transmitted anywhere.",
  },
  {
    question: "Can I change the order of the pages?",
    answer: "Files are merged in the order they appear in the list — remove and re-add a file to change its position.",
  },
  {
    question: "Is there a limit on file size or number of files?",
    answer: "We recommend keeping each PDF under 40MB. You can add as many files as your browser's memory allows.",
  },
];

const breadcrumbItems = [
  { name: "Home", path: "/" },
  { name: "Tools", path: "/tools" },
  { name: "Merge PDF", path: "/merge-pdf" },
];

export default function MergePdfPage() {
  return (
    <>
      <JsonLd data={[buildFaqJsonLd(faqs), buildBreadcrumbJsonLd(breadcrumbItems)]} />

      <Container className="py-8">
        <Breadcrumbs items={breadcrumbItems} />
      </Container>

      <Container className="max-w-3xl pb-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Merge PDF Files</h1>
        <p className="mt-3 text-lg text-zinc-600">
          Combine multiple PDFs into a single document instantly and privately. Everything happens on your own
          device — nothing is uploaded to a server.
        </p>
      </Container>

      <Container className="max-w-3xl py-6">
        <PdfMergeTool />
      </Container>

      <Container className="max-w-3xl space-y-12 py-12">
        <section>
          <h2 className="text-xl font-bold text-zinc-900">How to merge PDF files</h2>
          <ol className="mt-3 space-y-2">
            {[
              "Add two or more PDF files using the drop zone above (or drag and drop them in).",
              "Reorder your selection by removing and re-adding files, if needed.",
              'Click "Merge" and wait a moment while your browser combines them locally.',
              'Click "Download" to save the merged PDF.',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-zinc-600">
                <FiCheckCircle aria-hidden className="mt-0.5 shrink-0 text-emerald-600" />
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-bold text-zinc-900">Is this private?</h2>
          <p className="mt-3 leading-relaxed text-zinc-600">
            Yes. This tool runs entirely in your browser using the pdf-lib library — your files are never uploaded
            to {siteConfig.shortName}’s servers, stored, or logged.
          </p>
        </section>

        <FaqSection faqs={faqs} />

        <RelatedLinks
          title="Related tools"
          links={[
            { label: "JPG to PDF Converter", href: "/jpg-to-pdf" },
            { label: "PNG to PDF Converter", href: "/png-to-pdf" },
            { label: "PDF format guide", href: "/formats/pdf" },
          ]}
        />
      </Container>
    </>
  );
}
