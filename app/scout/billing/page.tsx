import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/guards";
import { isScoutRole } from "@/lib/auth/roles";
import {
  ScoutCard,
  ScoutPageHeading,
  ScoutSectionLabel,
} from "@/components/scout/ScoutCard";
import { SectionTexture } from "@/components/marketing/landing/SectionTexture";

export default async function ScoutBillingPage() {
  const session = await getSession();
  if (!session || !isScoutRole(session.role)) {
    redirect("/scout/login");
  }

  return (
    <div className="relative px-[var(--legacy-gutter)] py-[clamp(48px,8vw,80px)]">
      <SectionTexture pattern="dots" tone="light" />

      <div className="relative mx-auto max-w-2xl">
        <ScoutSectionLabel>Billing</ScoutSectionLabel>
        <div className="mt-4">
          <ScoutPageHeading title="Subscription" />
        </div>

        <ScoutCard className="mt-10 p-[clamp(32px,5vw,48px)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate">
            Current plan
          </p>
          <p className="legacy-display mt-3 text-[clamp(36px,5vw,52px)] uppercase leading-none text-pitch">
            Scout Pro
          </p>
          <p className="mt-6 text-base text-slate">
            <span className="font-semibold text-pitch">$700</span> / seat / year
            · <span className="font-semibold text-orange">3 seats active</span>
          </p>
          <p className="mt-8 border-t border-bone pt-6 text-sm leading-relaxed text-slate">
            Access to licensed athlete data across Legacy Sports Complex
            locations.
          </p>
        </ScoutCard>
      </div>
    </div>
  );
}
