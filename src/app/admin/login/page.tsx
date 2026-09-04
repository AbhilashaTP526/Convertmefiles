import { Suspense } from "react";
import { FiShield } from "react-icons/fi";
import { siteConfig } from "@/config/site";
import { LoginForm } from "@/components/admin/login-form";

export const metadata = {
  title: "Sign in",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2 text-zinc-900">
          <FiShield aria-hidden className="text-indigo-600" size={22} />
          <span className="font-bold">{siteConfig.shortName} Admin</span>
        </div>
        <p className="mt-2 text-sm text-zinc-500">Sign in to manage analytics and ad settings.</p>
        <div className="mt-6">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
