import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "success" | "warning" | "danger" | "scout";
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variant === "default" && "bg-[#1E2127] text-[#9DA3AE]",
        variant === "success" && "bg-emerald-500/20 text-emerald-400",
        variant === "warning" && "bg-amber-500/20 text-amber-400",
        variant === "danger" && "bg-red-500/20 text-red-400",
        variant === "scout" && "bg-orange/10 text-orange",
        className
      )}
      {...props}
    />
  );
}
