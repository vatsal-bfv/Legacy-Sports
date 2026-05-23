import { MarketingNav } from "@/components/marketing/MarketingNav";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-field text-pitch">
      <MarketingNav />
      <main>{children}</main>
    </div>
  );
}
