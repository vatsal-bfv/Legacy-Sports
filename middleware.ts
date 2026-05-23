import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

const ROLE_COOKIE = "legacy_demo_role";

function isCommandHost(host: string) {
  return host.startsWith("command.") || host.includes("command.localhost");
}

function getRole(request: NextRequest): string | null {
  return request.cookies.get(ROLE_COOKIE)?.value ?? null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? "";
  const isCommand = isCommandHost(host);
  const isScoutPath = pathname.startsWith("/scout");
  const isCommandPath = pathname.startsWith("/command-os");
  const isStaffLogin = pathname === "/login";
  const isScoutLogin = pathname === "/scout/login";
  const isApi = pathname.startsWith("/api");

  let response = isSupabaseConfigured()
    ? await updateSession(request)
    : NextResponse.next({ request });

  if (isApi) return response;

  const role = getRole(request);

  const needsStaff =
    isCommandPath || (isCommand && !isStaffLogin && pathname !== "/login");
  const needsScout =
    isScoutPath && !isScoutLogin && pathname !== "/scout/login";

  if (needsStaff && !isStaffLogin) {
    if (!role) {
      if (isCommand) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (role !== "legacy_staff") {
      return NextResponse.redirect(new URL("/scout/login", request.url));
    }
    if (isCommand && !pathname.startsWith("/command-os")) {
      const url = request.nextUrl.clone();
      url.pathname =
        pathname === "/" ? "/command-os" : `/command-os${pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  if (isStaffLogin && role === "legacy_staff") {
    const dest = isCommand ? "/" : "/command-os";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  if (needsScout) {
    if (!role) {
      return NextResponse.redirect(new URL("/scout/login", request.url));
    }
    if (role !== "scout") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (isScoutLogin && role === "scout") {
    return NextResponse.redirect(new URL("/scout", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
