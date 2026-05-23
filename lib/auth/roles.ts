export type Role = "legacy_staff" | "scout" | "anon";

export function isStaffRole(role: string | undefined): role is "legacy_staff" {
  return role === "legacy_staff";
}

export function isScoutRole(role: string | undefined): role is "scout" {
  return role === "scout";
}
