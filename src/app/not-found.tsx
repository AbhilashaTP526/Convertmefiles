import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] max-w-xl flex-col items-center justify-center py-16 text-center">
      <p className="text-sm font-semibold text-indigo-600">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">Page not found</h1>
      <p className="mt-3 text-zinc-600">
        We couldn’t find that page. It may have been moved, or the URL might be mistyped.
      </p>
      <div className="mt-6 flex gap-3">
        <Button as={Link} href="/" variant="primary">
          Go home
        </Button>
        <Button as={Link} href="/tools" variant="outline">
          Browse tools
        </Button>
      </div>
    </Container>
  );
}
