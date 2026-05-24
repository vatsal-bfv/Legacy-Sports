"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { scrollToTarget } from "@/lib/lenis";

export default function LocationSlugTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    scrollToTarget(0, { immediate: true });
  }, [pathname]);

  return children;
}
