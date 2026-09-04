"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to the console only — never surface stack traces to the user.
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] max-w-xl flex-col items-center justify-center py-16 text-center">
      <p className="text-sm font-semibold text-red-600">Something went wrong</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">We hit an unexpected error</h1>
      <p className="mt-3 text-zinc-600">
        Please try again. If the problem continues, refresh the page or come back a little later.
      </p>
      <Button variant="primary" onClick={reset} className="mt-6">
        Try again
      </Button>
    </Container>
  );
}
