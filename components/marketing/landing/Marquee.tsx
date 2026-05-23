"use client";

import { cn } from "@/lib/utils";

export function Marquee({
  items,
  duration = 38,
  reverse = false,
  className,
  itemClassName,
}: {
  items: string[];
  duration?: number;
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
}) {
  const content = items.join(" — ");

  return (
    <div className={cn("overflow-hidden", className)}>
      <div
        className="flex min-w-max shrink-0 items-center"
        style={{
          animation: `${reverse ? "legacy-marquee-reverse" : "legacy-marquee"} ${duration}s linear infinite`,
        }}
      >
        {[0, 1].map((index) => (
          <span
            key={index}
            className={cn(
              "shrink-0 whitespace-nowrap px-6 uppercase",
              itemClassName
            )}
          >
            {content} —
          </span>
        ))}
      </div>
    </div>
  );
}
