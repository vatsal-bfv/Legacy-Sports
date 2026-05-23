import { cn } from "@/lib/utils";

export type SectionTexturePattern =
  | "dots"
  | "grid"
  | "diagonal"
  | "radial"
  | "cross"
  | "noise";

export type SectionTextureTone = "light" | "dark";

export function SectionTexture({
  pattern,
  tone,
  className,
}: {
  pattern: SectionTexturePattern;
  tone: SectionTextureTone;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "legacy-section-texture",
        `legacy-texture-${pattern}-${tone}`,
        className
      )}
    />
  );
}
