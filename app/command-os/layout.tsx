import { redirect } from "next/navigation";
import { CommandOsProviders } from "@/components/app/CommandOsProviders";
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
    <CommandOsProviders userName={session.displayName}>
      {children}
    </CommandOsProviders>
  );
}
