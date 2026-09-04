"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiBarChart2, FiDollarSign, FiExternalLink, FiLogOut, FiShield } from "react-icons/fi";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: FiBarChart2 },
  { label: "AdSense", href: "/admin/adsense", icon: FiDollarSign },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-zinc-900">
            <FiShield aria-hidden className="text-indigo-600" size={20} />
            <span>{siteConfig.shortName} Admin</span>
          </div>
          <nav aria-label="Admin" className="flex items-center gap-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium",
                    active ? "bg-indigo-50 text-indigo-700" : "text-zinc-600 hover:bg-zinc-100"
                  )}
                >
                  <Icon aria-hidden size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" target="_blank" className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800">
            View site <FiExternalLink aria-hidden size={14} />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
          >
            <FiLogOut aria-hidden size={16} /> Log out
          </button>
        </div>
      </div>
    </header>
  );
}
