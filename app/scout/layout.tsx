import { getSession } from "@/lib/auth/guards";
import { isScoutRole } from "@/lib/auth/roles";
import { ScoutNav } from "@/components/scout/ScoutNav";

export default async function ScoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const showNav = session && isScoutRole(session.role);

  return (
    <div className="min-h-screen bg-field text-pitch">
      {showNav && <ScoutNav />}
      <main className={showNav ? "pt-14 md:pt-[68px]" : undefined}>
        {children}
      </main>
    </div>
  );
}
