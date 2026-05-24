import { MarketingNav } from "@/components/marketing/MarketingNav";
import { SiteFooter } from "@/components/marketing/SiteFooter";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-field text-pitch">
      <MarketingNav />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
