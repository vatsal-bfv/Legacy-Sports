import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function InsightCard({
  title,
  value,
  subtitle,
  href,
  accent,
}: {
  title: string;
  value: string;
  subtitle?: string;
  href?: string;
  accent?: "blue" | "orange" | "red" | "green";
}) {
  const content = (
    <Card
      className={cn(
        "transition-all duration-300 hover:-translate-y-0.5 hover:border-orange hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]",
        href && "cursor-pointer"
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={cn(
            "text-2xl font-extrabold tracking-[-0.02em]",
            accent === "red" && "text-red-600",
            accent === "green" && "text-emerald-600",
            accent === "orange" && "text-orange",
            (!accent || accent === "blue") && "text-pitch"
          )}
        >
          {value}
        </p>
        {subtitle && (
          <p className="mt-1 text-xs text-smoke">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}
