import { cookies } from "next/headers";
import type { Role } from "./roles";

const ROLE_COOKIE = "legacy_demo_role";
const EMAIL_COOKIE = "legacy_demo_email";
const NAME_COOKIE = "legacy_demo_name";

export type DemoSession = {
  role: Role;
  email: string;
  displayName: string;
} | null;

export async function getDemoSession(): Promise<DemoSession> {
  const cookieStore = await cookies();
  const role = cookieStore.get(ROLE_COOKIE)?.value as Role | undefined;
  const email = cookieStore.get(EMAIL_COOKIE)?.value;
  const displayName = cookieStore.get(NAME_COOKIE)?.value;
  if (!role || role === "anon" || !email) return null;
  return {
    role,
    email,
    displayName: displayName ?? email,
  };
}

export function demoSessionCookieHeaders(
  role: Role,
  email: string,
  displayName: string
): HeadersInit {
  const maxAge = 60 * 60 * 24 * 7;
  return {
    "Set-Cookie": [
      `${ROLE_COOKIE}=${role}; Path=/; Max-Age=${maxAge}; SameSite=Lax`,
      `${EMAIL_COOKIE}=${encodeURIComponent(email)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`,
      `${NAME_COOKIE}=${encodeURIComponent(displayName)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`,
    ].join(", "),
  };
}

export function clearDemoSessionCookies(): string {
  return [
    `${ROLE_COOKIE}=; Path=/; Max-Age=0`,
    `${EMAIL_COOKIE}=; Path=/; Max-Age=0`,
    `${NAME_COOKIE}=; Path=/; Max-Age=0`,
  ].join(", ");
}
