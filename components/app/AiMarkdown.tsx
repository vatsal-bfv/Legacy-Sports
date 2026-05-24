"use client";

import { Streamdown } from "streamdown";
import "streamdown/styles.css";
import { cn } from "@/lib/utils";

type AiMarkdownProps = {
  children: string;
  isAnimating?: boolean;
  className?: string;
};

export function AiMarkdown({
  children,
  isAnimating = false,
  className,
}: AiMarkdownProps) {
  if (!children.trim()) return null;

  return (
    <Streamdown
      isAnimating={isAnimating}
      className={cn(
        "legacy-ai-markdown text-sm leading-relaxed text-pitch",
        className
      )}
    >
      {children}
    </Streamdown>
  );
}
