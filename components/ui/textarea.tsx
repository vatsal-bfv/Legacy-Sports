import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-[80px] w-full rounded-[8px] border-[1.5px] border-bone bg-field px-3 py-2 text-sm text-pitch placeholder:text-smoke focus-visible:border-orange focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange/10",
      className
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
