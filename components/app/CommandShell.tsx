"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LocationProvider } from "@/components/app/LocationProvider";
import { LocationSwitcher } from "@/components/app/LocationSwitcher";
import { NaturalLanguageInput } from "@/components/app/NaturalLanguageInput";
import { NotificationsBell } from "@/components/app/NotificationsBell";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  Menu,
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
  { href: "/command-os/settings", label: "Settings", icon: Settings },
];

function isNavActive(pathname: string, href: string) {
  return (
    pathname === href ||
    (href !== "/command-os" && pathname.startsWith(href))
  );
}

function CommandNavLinks({
  pathname,
  onNavigate,
  className,
}: {
  pathname: string;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <nav className={cn("space-y-1", className)}>
      {nav.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-medium transition-colors",
            isNavActive(pathname, href)
              ? "bg-orange/10 text-pitch"
              : "text-slate hover:bg-bone hover:text-pitch"
          )}
        >
          <Icon
            className={cn(
              "h-4 w-4 shrink-0",
              isNavActive(pathname, href) ? "text-orange" : "text-smoke"
            )}
          />
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function CommandShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <LocationProvider>
      <div className="flex min-h-screen bg-field text-pitch">
        <aside className="hidden w-60 shrink-0 flex-col border-r border-bone bg-chalk lg:flex">
          <div className="flex h-[68px] items-center border-b border-bone px-5">
            <Link href="/command-os" className="flex items-center no-underline">
              <span className="legacy-display text-[22px] uppercase tracking-[0.08em] text-pitch">
                LEGACY
              </span>
              <span className="mx-2.5 h-4 w-px bg-orange/50" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-smoke">
                Command
              </span>
            </Link>
          </div>
          <nav className="flex-1 p-3">
            <CommandNavLinks pathname={pathname} />
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 overflow-visible border-b border-bone bg-field/95 backdrop-blur-xl">
            <div className="flex min-h-[68px] items-center gap-3 px-4 py-2 lg:gap-4 lg:px-6">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="rounded-[8px] p-2 text-slate hover:bg-bone hover:text-pitch lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <LocationSwitcher />
              <div className="hidden flex-1 md:block">
                <NaturalLanguageInput compact />
              </div>
              <div className="ml-auto flex items-center gap-3">
                <NotificationsBell />
                <span className="hidden text-sm text-slate sm:inline">
                  {userName}
                </span>
                <button
                  onClick={logout}
                  className="rounded-[8px] p-2 text-slate hover:bg-bone hover:text-pitch"
                  aria-label="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>

        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetContent
            side="left"
            className="w-[min(100vw-2rem,18rem)] border-bone bg-chalk p-0 text-pitch [&_[data-slot=sheet-title]]:text-pitch [&_[data-slot=sheet-close]]:text-slate [&_[data-slot=sheet-close]]:hover:bg-bone [&_[data-slot=sheet-close]]:hover:text-pitch"
          >
            <SheetHeader className="border-b border-bone px-5 py-5 text-left">
              <SheetTitle className="flex items-center">
                <span className="legacy-display text-[22px] uppercase tracking-[0.08em]">
                  LEGACY
                </span>
                <span className="mx-2.5 h-4 w-px bg-orange/50" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-smoke">
                  Command
                </span>
              </SheetTitle>
            </SheetHeader>
            <CommandNavLinks
              pathname={pathname}
              onNavigate={() => setMobileNavOpen(false)}
              className="p-3"
            />
          </SheetContent>
        </Sheet>
      </div>
    </LocationProvider>
  );
}
