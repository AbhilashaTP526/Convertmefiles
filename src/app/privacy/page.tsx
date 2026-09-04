import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} handles your files and data.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <Container className="max-w-3xl space-y-6 py-12">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy" }]} />
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Privacy Policy</h1>
      <p className="text-sm text-zinc-500">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

      <section>
        <h2 className="text-xl font-bold text-zinc-900">Your files</h2>
        <p className="mt-2 leading-relaxed text-zinc-600">
          Every converter currently offered on {siteConfig.shortName} processes files entirely inside your browser
          using JavaScript and the Canvas API. Your files are never uploaded to our servers, never stored, and never
          logged. If a future tool requires server-side processing, that page will clearly say so before you use it.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-900">Information we collect</h2>
        <p className="mt-2 leading-relaxed text-zinc-600">
          We collect standard, privacy-conscious analytics — such as which pages are viewed and whether a conversion
          started or completed — to understand how the site is used and to fix problems. We do not collect file
          contents, file names, or the data inside the files you convert.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-900">Cookies and local storage</h2>
        <p className="mt-2 leading-relaxed text-zinc-600">
          We use minimal local storage strictly for site functionality (such as remembering your preferences). We do
          not use tracking cookies to build cross-site advertising profiles.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-900">Third parties</h2>
        <p className="mt-2 leading-relaxed text-zinc-600">
          Because file conversion happens on your device, no third party ever receives your file data through our
          service.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-900">Changes to this policy</h2>
        <p className="mt-2 leading-relaxed text-zinc-600">
          If this policy changes — for example, if we introduce a tool that requires server-side processing — we
          will update this page and clearly label the affected tool.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-900">Contact</h2>
        <p className="mt-2 leading-relaxed text-zinc-600">
          Questions about this policy? Visit our{" "}
          <Link href="/contact" className="font-medium text-indigo-600 hover:underline">
            contact page
          </Link>
          .
        </p>
      </section>
    </Container>
  );
}
