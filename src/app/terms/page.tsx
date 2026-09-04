import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that govern your use of ${siteConfig.name}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <Container className="max-w-3xl space-y-6 py-12">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Terms of Service", path: "/terms" }]} />
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Terms of Service</h1>
      <p className="text-sm text-zinc-500">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

      <section>
        <h2 className="text-xl font-bold text-zinc-900">Use of the service</h2>
        <p className="mt-2 leading-relaxed text-zinc-600">
          {siteConfig.shortName} provides free, browser-based file conversion tools. You may use these tools for
          personal or commercial purposes, provided you do not attempt to abuse, disrupt, or reverse-engineer the
          service in a way that harms other users.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-900">Your content</h2>
        <p className="mt-2 leading-relaxed text-zinc-600">
          You retain full ownership of any files you convert. Because conversion happens locally in your browser, we
          never receive, store, or have access to your files.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-900">No warranty</h2>
        <p className="mt-2 leading-relaxed text-zinc-600">
          The service is provided “as is,” without warranty of any kind. While we aim for accurate, reliable
          conversions, we cannot guarantee that every conversion will be lossless or error-free in every browser and
          device combination. Always keep a copy of your original file.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-900">Limitation of liability</h2>
        <p className="mt-2 leading-relaxed text-zinc-600">
          To the maximum extent permitted by law, {siteConfig.shortName} is not liable for any indirect, incidental,
          or consequential damages arising from your use of the service.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-900">Changes to these terms</h2>
        <p className="mt-2 leading-relaxed text-zinc-600">
          We may update these terms from time to time. Continued use of the service after changes are posted
          constitutes acceptance of the updated terms.
        </p>
      </section>
    </Container>
  );
}
