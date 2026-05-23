import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/guards";
import { isScoutRole } from "@/lib/auth/roles";

export default async function ScoutBillingPage() {
  const session = await getSession();
  if (!session || !isScoutRole(session.role)) {
    redirect("/scout/login");
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-bold">Billing</h1>
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-8">
        <p className="text-sm text-gray-500">Current plan</p>
        <p className="mt-2 text-3xl font-bold">Scout Pro</p>
        <p className="mt-4 text-gray-600">
          $700 / seat / year · <strong>3 seats active</strong>
        </p>
        <p className="mt-6 text-sm text-gray-500">
          Access to licensed athlete data across Legacy Sports Complex locations.
        </p>
      </div>
    </div>
  );
}
