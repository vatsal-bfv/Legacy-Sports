import Link from "next/link";
import { demoStore } from "@/lib/demo/store";
import { formatCurrency } from "@/lib/utils";

export default function ProgramsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-16 pt-28">
      <h1 className="text-4xl font-bold">Programs</h1>
      <p className="mt-4 text-[#9DA3AE]">
        Training paths for every age and ambition.
      </p>
      <div className="mt-12 space-y-6">
        {demoStore.programs.map((p) => (
          <div
            key={p.id}
            className="rounded-lg border border-[#2A2D34] bg-[#15171B] p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">{p.name}</h2>
                <p className="mt-2 max-w-2xl text-[#9DA3AE]">{p.description}</p>
                <p className="mt-2 text-sm text-[#9DA3AE]">
                  Ages {p.target_age_min}–{p.target_age_max}
                </p>
              </div>
              <p className="text-2xl font-bold text-[#FF5A1F]">
                {formatCurrency(p.monthly_price)}/mo
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-16 rounded-lg bg-[#FF5A1F]/10 p-8 text-center">
        <p className="text-lg font-medium">Ready to start?</p>
        <Link
          href="/locations/suwanee#book"
          className="mt-4 inline-block rounded-md bg-[#FF5A1F] px-6 py-3 text-white"
        >
          Book a free assessment
        </Link>
      </div>
    </div>
  );
}
