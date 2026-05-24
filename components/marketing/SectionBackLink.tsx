"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import type { LandingSectionHref } from "@/lib/marketing/landing-sections";
import { scrollToTarget } from "@/lib/lenis";
import { cn } from "@/lib/utils";

export function SectionBackLink({
  href,
  children,
  className,
}: {
  href: LandingSectionHref;
  children: ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (isHome) {
      event.preventDefault();
      scrollToTarget(href.slice(1), { offset: -80 });
    }
  }

  return (
    <Link
      href={href}
      data-cursor="link"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold transition-colors",
        className
      )}
    >
      <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
      {children}
    </Link>
  );
}
