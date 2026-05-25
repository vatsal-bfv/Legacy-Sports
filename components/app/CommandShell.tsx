"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";
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
  Sparkles,
  Users,
  Kanban,
  Calendar,
  MessageSquare,
  Building2,
  Eye,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";

const MobileNavContext = createContext<(() => void) | null>(null);

export function useOpenMobileNav() {
  return useContext(MobileNavContext) ?? (() => {});
}

const nav = [
  { href: "/command-os", label: "Command Center", icon: Sparkles },
  { href: "/command-os/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/command-os/athletes", label: "Athletes", icon: Users },
  { href: "/command-os/leads", label: "Leads", icon: Kanban },
  { href: "/command-os/schedule", label: "Schedule", icon: Calendar },
  { href: "/command-os/communications", label: "Communications", icon: MessageSquare },
  { href: "/command-os/operations", label: "Operations", icon: Building2 },
  { href: "/command-os/scouts", label: "Scouts", icon: Eye },
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

function CommandAccountFooter({
  pathname,
  userName,
  onLogout,
  onNavigate,
  className,
}: {
  pathname: string;
  userName: string;
  onLogout: () => void;
  onNavigate?: () => void;
  className?: string;
}) {
  const settingsActive = pathname.startsWith("/command-os/settings");

  return (
    <div className={cn("space-y-1 border-t border-bone", className)}>
      <Link
        href="/command-os/settings"
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-medium transition-colors",
          settingsActive
            ? "bg-orange/10 text-pitch"
            : "text-slate hover:bg-bone hover:text-pitch"
        )}
      >
        <Settings
          className={cn(
            "h-4 w-4 shrink-0",
            settingsActive ? "text-orange" : "text-smoke"
          )}
        />
        Settings
      </Link>
      <div className="flex items-center gap-2 px-3 py-2.5">
        <span className="min-w-0 flex-1 truncate text-sm text-slate">
          {userName}
        </span>
        <button
          type="button"
          onClick={onLogout}
          className="shrink-0 rounded-[8px] p-2 text-slate hover:bg-bone hover:text-pitch"
          aria-label="Log out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
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
  const isCommandCenter = pathname === "/command-os";

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  function openMobileNav() {
    setMobileNavOpen(true);
  }

  return (
    <LocationProvider>
      <MobileNavContext.Provider value={openMobileNav}>
        <div className="flex h-dvh overflow-hidden bg-field text-pitch">
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
            <nav className="flex-1 overflow-y-auto p-3">
              <CommandNavLinks pathname={pathname} />
            </nav>
            <CommandAccountFooter
              pathname={pathname}
              userName={userName}
              onLogout={logout}
              className="p-3"
            />
          </aside>

          <div className="flex min-h-0 flex-1 flex-col">
            {!isCommandCenter ? (
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
                  <div className="ml-auto flex shrink-0 items-center">
                    <NotificationsBell />
                  </div>
                </div>
              </header>
            ) : null}
            <main
              className={cn(
                "flex min-h-0 flex-1 flex-col",
                isCommandCenter
                  ? "overflow-hidden p-0"
                  : "overflow-y-auto p-4 lg:p-6"
              )}
            >
              {children}
            </main>
          </div>

          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetContent
              side="left"
              className="flex w-[min(100vw-2rem,18rem)] flex-col border-bone bg-chalk p-0 text-pitch [&_[data-slot=sheet-title]]:text-pitch [&_[data-slot=sheet-close]]:text-slate [&_[data-slot=sheet-close]]:hover:bg-bone [&_[data-slot=sheet-close]]:hover:text-pitch"
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
                className="flex-1 overflow-y-auto p-3"
              />
              <CommandAccountFooter
                pathname={pathname}
                userName={userName}
                onLogout={logout}
                onNavigate={() => setMobileNavOpen(false)}
                className="p-3"
              />
            </SheetContent>
          </Sheet>
        </div>
      </MobileNavContext.Provider>
    </LocationProvider>
  );
}
