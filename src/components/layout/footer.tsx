import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200 bg-zinc-50">
      <Container className="py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="font-bold text-zinc-900">{siteConfig.shortName}</p>
            <p className="mt-2 text-sm text-zinc-600">{siteConfig.tagline}</p>
          </div>
          <FooterColumn title="Resources" links={siteConfig.footerLinks.resources} />
          <FooterColumn title="Company" links={siteConfig.footerLinks.company} />
          <FooterColumn title="Legal" links={siteConfig.footerLinks.legal} />
        </div>
        <p className="mt-10 text-xs text-zinc-500">
          © {new Date().getFullYear()} {siteConfig.shortName}. All conversions run locally in your browser.
        </p>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-sm font-semibold text-zinc-900">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-zinc-600 hover:text-indigo-600">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
