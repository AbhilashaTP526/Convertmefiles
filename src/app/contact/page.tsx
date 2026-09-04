import type { Metadata } from "next";
import { FiMail } from "react-icons/fi";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with the ${siteConfig.name} team.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Container className="max-w-2xl space-y-6 py-12">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]} />
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Contact Us</h1>
      <p className="leading-relaxed text-zinc-600">
        Found a bug, have a feature request, or want to suggest a new converter? We’d love to hear from you.
      </p>
      <a
        href={`mailto:${siteConfig.contactEmail}`}
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
      >
        <FiMail aria-hidden /> {siteConfig.contactEmail}
      </a>
      <p className="text-sm text-zinc-500">
        Please don’t send us the actual files you’re having trouble with — describe the issue (file type, browser,
        device) instead, since we never want your files to leave your device.
      </p>
    </Container>
  );
}
