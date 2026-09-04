"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { FiAlertCircle, FiLoader, FiLock, FiMail } from "react-icons/fi";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? "Login failed.");
        setIsSubmitting(false);
        return;
      }

      const next = searchParams.get("next");
      const destination = next && next.startsWith("/admin") ? next : "/admin";
      // A hard navigation, not router.replace(): the client Router Cache may
      // hold a stale "redirect to /admin/login" entry for the destination
      // from before this session was authenticated. router.refresh() doesn't
      // help — it only clears the cache for the *current* route, not the
      // destination. A full navigation guarantees a fresh, authenticated request.
      window.location.assign(destination);
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
          Admin email
        </label>
        <div className="relative mt-1.5">
          <FiMail aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            id="email"
            type="email"
            required
            autoFocus
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 py-2.5 pl-10 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
          Admin password
        </label>
        <div className="relative mt-1.5">
          <FiLock aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 py-2.5 pl-10 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <FiAlertCircle aria-hidden className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <FiLoader aria-hidden className="animate-spin" /> : null}
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
