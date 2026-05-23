import Link from "next/link";
import { LocationsMap } from "@/components/marketing/LocationsMap";
import { demoStore } from "@/lib/demo/store";

export default function LocationsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="text-4xl font-bold">Locations</h1>
      <p className="mt-4 text-[#9DA3AE]">
        5 state-of-the-art facilities across the Phoenix metro.
      </p>
      <div className="mt-10">
        <LocationsMap />
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {demoStore.locations.map((loc) => (
          <Link
            key={loc.id}
            href={`/locations/${loc.slug}`}
            className="overflow-hidden rounded-lg border border-[#2A2D34] bg-[#15171B]"
          >
            <div
              className="h-48 bg-cover bg-center"
              style={{ backgroundImage: `url(${loc.photo_urls[0]})` }}
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold">{loc.name}</h2>
              <p className="mt-2 text-sm text-[#9DA3AE]">{loc.address}</p>
              <p className="mt-2 text-sm text-[#FF5A1F]">Book a tour →</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
