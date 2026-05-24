"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScoutLogoutButton } from "@/components/scout/ScoutLogoutButton";

const NAV_LINKS = [
  { href: "/scout", label: "Dashboard", exact: true },
  { href: "/scout/search", label: "Search", exact: false },
  { href: "/scout/billing", label: "Billing", exact: false },
];

export function ScoutNav() {
  const pathname = usePathname();

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-[999] h-14 border-b border-steel/40 bg-ink/88 backdrop-blur-2xl md:h-[68px]">
      <div className="flex h-full items-center justify-between px-[var(--legacy-gutter)]">
        <Link href="/scout" className="flex items-center text-ghost no-underline">
          <span className="legacy-display text-[26px] uppercase tracking-[0.1em]">
            LEGACY
          </span>
          <span className="mx-3 h-5 w-px bg-orange/50" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ash">
            Scout Portal
          </span>
        </Link>

        <nav className="flex items-center gap-6 sm:gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative hidden pb-0.5 text-[13px] font-medium transition-colors duration-200 sm:inline-block",
                isActive(link.href, link.exact)
                  ? "text-ghost"
                  : "text-coal hover:text-ghost"
              )}
            >
              {link.label}
              <span
                className={cn(
                  "absolute inset-x-0 bottom-[-2px] h-px origin-left bg-orange transition-all duration-300",
                  isActive(link.href, link.exact)
                    ? "scale-x-100 opacity-50"
                    : "scale-x-0 opacity-100"
                )}
              />
            </Link>
          ))}
          <ScoutLogoutButton />
        </nav>
      </div>
    </header>
  );
}
