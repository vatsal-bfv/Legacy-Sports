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
        variant === "default" && "bg-bone text-slate",
        variant === "success" && "bg-emerald-500/15 text-emerald-700",
        variant === "warning" && "bg-amber-500/15 text-amber-700",
        variant === "danger" && "bg-red-500/15 text-red-700",
        variant === "scout" && "bg-orange/10 text-orange",
        className
      )}
      {...props}
    />
  );
}
