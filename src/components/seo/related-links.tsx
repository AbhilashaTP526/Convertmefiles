import Link from "next/link";

export interface RelatedLink {
  label: string;
  href: string;
  description?: string;
}

export function RelatedLinks({ title, links }: { title: string; links: RelatedLink[] }) {
  if (links.length === 0) return null;
  return (
    <section>
      <h2 className="text-xl font-bold text-zinc-900">{title}</h2>
      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block rounded-lg border border-zinc-200 p-4 transition-colors hover:border-indigo-300 hover:bg-indigo-50/50"
            >
              <span className="font-medium text-zinc-900">{link.label}</span>
              {link.description && <span className="mt-1 block text-sm text-zinc-500">{link.description}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
