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
        "transition-all hover:border-[#3B82F6]/50 hover:bg-[#1A1D24]",
        href && "cursor-pointer"
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-[#9DA3AE]">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={cn(
            "text-2xl font-bold",
            accent === "red" && "text-red-400",
            accent === "green" && "text-emerald-400",
            accent === "orange" && "text-[#FF5A1F]",
            (!accent || accent === "blue") && "text-[#F5F6F7]"
          )}
        >
          {value}
        </p>
        {subtitle && (
          <p className="mt-1 text-xs text-[#9DA3AE]">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}
