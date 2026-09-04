"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { siteConfig } from "@/config/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="rounded-md p-2 text-zinc-700 hover:bg-zinc-100"
      >
        {open ? <FiX aria-hidden size={22} /> : <FiMenu aria-hidden size={22} />}
      </button>
      {open && (
        <nav id="mobile-nav-menu" className="absolute inset-x-0 top-16 z-30 border-b border-zinc-200 bg-white shadow-sm">
          <ul className="flex flex-col p-2">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-4 py-3 text-base font-medium text-zinc-800 hover:bg-zinc-50"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
