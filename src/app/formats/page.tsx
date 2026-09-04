import type { Metadata } from "next";
import Link from "next/link";
import { formatList } from "@/config/formats";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "File Format Guides",
  description: "Learn about common image file formats — extensions, MIME types, pros and cons, and how to convert between them.",
  alternates: { canonical: "/formats" },
};

export default function FormatsIndexPage() {
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Formats", path: "/formats" }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900">File Format Guides</h1>
      <p className="mt-3 max-w-2xl text-lg text-zinc-600">
        Everything you need to know about the file formats we support — what they’re for, their strengths and
        weaknesses, and how to convert them.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {formatList.map((format) => (
          <Link
            key={format.id}
            href={`/formats/${format.id}`}
            className="rounded-xl border border-zinc-200 p-5 hover:border-indigo-300 hover:shadow-sm"
          >
            <p className="font-semibold text-zinc-900">{format.name}</p>
            <p className="mt-1 text-sm text-zinc-500">{format.fullName}</p>
            <p className="mt-3 line-clamp-2 text-sm text-zinc-600">{format.description}</p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
