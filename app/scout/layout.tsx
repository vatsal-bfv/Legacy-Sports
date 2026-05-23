import Link from "next/link";
import { getSession } from "@/lib/auth/guards";
import { isScoutRole } from "@/lib/auth/roles";

export default async function ScoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A2332]">
      {session && isScoutRole(session.role) && (
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
            <Link href="/scout" className="font-bold tracking-wide">
              LEGACY SCOUT PORTAL
            </Link>
            <nav className="flex gap-6 text-sm">
              <Link href="/scout" className="hover:text-[#3B82F6]">
                Dashboard
              </Link>
              <Link href="/scout/search" className="hover:text-[#3B82F6]">
                Search
              </Link>
              <Link href="/scout/billing" className="hover:text-[#3B82F6]">
                Billing
              </Link>
            </nav>
          </div>
        </header>
      )}
      {children}
    </div>
  );
}
