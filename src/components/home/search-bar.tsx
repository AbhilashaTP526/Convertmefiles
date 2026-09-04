"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { FiSearch, FiX } from "react-icons/fi";
import { conversions } from "@/config/conversions";
import { formats } from "@/config/formats";
import { getConversionMeta } from "@/lib/seo/conversion-content";

interface SearchResult {
  label: string;
  sublabel: string;
  href: string;
  /** Lowercased text matched against the query — broader than the displayed label, so e.g. "jpeg" finds JPG results. */
  keywords: string;
}

const searchIndex: SearchResult[] = [
  ...conversions.map((c) => {
    const label = getConversionMeta(c).title;
    const source = formats[c.source];
    const target = formats[c.target];
    return {
      label,
      sublabel: "Converter",
      href: `/${c.slug}`,
      keywords: `${label} ${source.fullName} ${target.fullName} ${source.extensions.join(" ")} ${target.extensions.join(" ")}`.toLowerCase(),
    };
  }),
  ...Object.values(formats).map((f) => ({
    label: `${f.name} format`,
    sublabel: "File format guide",
    href: `/formats/${f.id}`,
    keywords: `${f.name} ${f.fullName} ${f.extensions.join(" ")}`.toLowerCase(),
  })),
];

export function SearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return searchIndex.filter((item) => item.keywords.includes(q)).slice(0, 8);
  }, [query]);

  return (
    <div className={`relative ${className ?? ""}`}>
      <div className="relative">
        <label htmlFor="site-search" className="sr-only">
          Search converters and file formats
        </label>
        <FiSearch aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          ref={inputRef}
          id="site-search"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          placeholder="Search converters, e.g. webp"
          className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-10 pr-9 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-400 hover:text-zinc-600"
          >
            <FiX aria-hidden />
          </button>
        )}
      </div>
      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-2 w-full max-w-sm overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg">
          {results.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                className="flex items-center justify-between px-4 py-2.5 text-sm text-zinc-800 hover:bg-zinc-50"
              >
                <span>{r.label}</span>
                <span className="text-xs text-zinc-400">{r.sublabel}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
