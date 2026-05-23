import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { getDemoSession } from "./demo-session";
import { isStaffRole, isScoutRole, type Role } from "./roles";

export type AuthUser = {
  id: string;
  email: string;
  role: Role;
  displayName: string;
};

export async function getSession(): Promise<AuthUser | null> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    if (!supabase) return null;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const role = (user.app_metadata?.role as Role) ?? "anon";
    return {
      id: user.id,
      email: user.email ?? "",
      role,
      displayName:
        (user.user_metadata?.display_name as string) ?? user.email ?? "",
    };
  }

  const demo = await getDemoSession();
  if (!demo) return null;
  return {
    id: demo.email,
    email: demo.email,
    role: demo.role,
    displayName: demo.displayName,
  };
}

export async function requireStaff(): Promise<AuthUser> {
  const session = await getSession();
  if (!session || !isStaffRole(session.role)) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function requireScout(): Promise<AuthUser> {
  const session = await getSession();
  if (!session || !isScoutRole(session.role)) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
