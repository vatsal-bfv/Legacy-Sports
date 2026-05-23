import { MarketingNav } from "@/components/marketing/MarketingNav";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#F5F6F7]">
      <MarketingNav />
      <main className="pt-16">{children}</main>
    </div>
  );
}
