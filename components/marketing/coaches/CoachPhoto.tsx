"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getCoachPhotoPath } from "@/lib/marketing/coaches";

type CoachPhotoProps = {
  slug: string;
  name: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function CoachPhoto({
  slug,
  name,
  className,
  imageClassName,
  sizes = "100vw",
  priority = false,
}: CoachPhotoProps) {
  const [failed, setFailed] = useState(false);
  const initials = getInitials(name);

  if (failed) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#1a1c22_0%,#2a2d34_100%)]",
          className
        )}
      >
        <span className="legacy-display text-[clamp(48px,12vw,96px)] leading-none tracking-[0.04em] text-orange/35">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={getCoachPhotoPath(slug)}
      alt={`Portrait of ${name}`}
      fill
      priority={priority}
      sizes={sizes}
      className={cn("object-cover", imageClassName)}
      onError={() => setFailed(true)}
    />
  );
}
