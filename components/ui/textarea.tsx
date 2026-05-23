import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-[80px] w-full rounded-md border border-[#2A2D34] bg-[#15171B] px-3 py-2 text-sm text-[#F5F6F7] placeholder:text-[#9DA3AE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]",
      className
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
