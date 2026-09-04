import Link from "next/link";
import { FiShield } from "react-icons/fi";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { SearchBar } from "@/components/home/search-bar";
import { MobileNav } from "@/components/layout/mobile-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <Container>
        <div className="relative flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-zinc-900">
            <FiShield aria-hidden className="text-indigo-600" size={22} />
            <span>{siteConfig.shortName}</span>
          </Link>

          <div className="hidden max-w-xs flex-1 sm:block">
            <SearchBar />
          </div>

          <nav aria-label="Main" className="hidden items-center gap-6 sm:flex">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-zinc-700 hover:text-indigo-600"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <MobileNav />
        </div>
        <div className="pb-3 sm:hidden">
          <SearchBar />
        </div>
      </Container>
    </header>
  );
}
