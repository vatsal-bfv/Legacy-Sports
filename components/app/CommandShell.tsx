"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LocationProvider } from "@/components/app/LocationProvider";
import { LocationSwitcher } from "@/components/app/LocationSwitcher";
import { NaturalLanguageInput } from "@/components/app/NaturalLanguageInput";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Kanban,
  Calendar,
  MessageSquare,
  Building2,
  Eye,
  Settings,
  LogOut,
  Heart,
  DollarSign,
} from "lucide-react";

const nav = [
  { href: "/command-os", label: "Command Center", icon: LayoutDashboard },
  { href: "/command-os/athletes", label: "Athletes", icon: Users },
  { href: "/command-os/leads", label: "Leads", icon: Kanban },
  { href: "/command-os/schedule", label: "Schedule", icon: Calendar },
  { href: "/command-os/communications", label: "Communications", icon: MessageSquare },
  { href: "/command-os/operations", label: "Operations", icon: Building2 },
  { href: "/command-os/scouts", label: "Scouts", icon: Eye },
  { href: "/command-os/retention", label: "Retention", icon: Heart },
  { href: "/command-os/cost-comparison", label: "Cost Comparison", icon: DollarSign },
  { href: "/command-os/settings", label: "Settings", icon: Settings },
];

export function CommandShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <LocationProvider>
      <div className="flex min-h-screen bg-[#0A0B0D] text-[#F5F6F7]">
        <aside className="hidden w-56 shrink-0 flex-col border-r border-[#2A2D34] bg-[#0A0B0D] lg:flex">
          <div className="flex h-16 items-center border-b border-[#2A2D34] px-4">
            <span className="text-xs font-bold tracking-widest text-[#3B82F6]">
              LEGACY COMMAND
            </span>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {nav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  pathname === href || (href !== "/command-os" && pathname.startsWith(href))
                    ? "bg-[#1A1D24] text-[#F5F6F7]"
                    : "text-[#9DA3AE] hover:bg-[#15171B] hover:text-[#F5F6F7]"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-[#2A2D34] bg-[#0A0B0D]/95 backdrop-blur">
            <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
              <LocationSwitcher />
              <div className="hidden flex-1 md:block">
                <NaturalLanguageInput compact />
              </div>
              <div className="ml-auto flex items-center gap-3">
                <span className="text-sm text-[#9DA3AE]">{userName}</span>
                <button
                  onClick={logout}
                  className="rounded-md p-2 text-[#9DA3AE] hover:bg-[#15171B] hover:text-[#F5F6F7]"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </LocationProvider>
  );
}
