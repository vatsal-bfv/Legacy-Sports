import { Suspense } from "react";
import { CommsHub } from "@/components/app/CommsHub";

export default function CommunicationsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate">Loading inbox…</p>}>
      <CommsHub />
    </Suspense>
  );
}
