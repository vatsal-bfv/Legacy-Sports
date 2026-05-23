import { redirect } from "next/navigation";
import { CommandShell } from "@/components/app/CommandShell";
import { getSession } from "@/lib/auth/guards";
import { isStaffRole } from "@/lib/auth/roles";

export default async function CommandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || !isStaffRole(session.role)) {
    redirect("/login");
  }

  return (
    <CommandShell userName={session.displayName}>{children}</CommandShell>
  );
}
