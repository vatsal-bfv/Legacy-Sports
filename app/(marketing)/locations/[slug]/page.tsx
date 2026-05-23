import { notFound } from "next/navigation";
import { demoStore } from "@/lib/demo/store";
import { LeadCaptureForm } from "@/components/shared/LeadCaptureForm";

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = demoStore.locations.find((l) => l.slug === slug);
  if (!location) notFound();

  const coaches = demoStore.coaches.filter(
    (c) => c.primary_location_id === location.id
  );

  return (
    <div>
      <div
        className="h-64 bg-cover bg-center md:h-96"
        style={{ backgroundImage: `url(${location.photo_urls[0]})` }}
      />
      <div className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-4xl font-bold">{location.name}</h1>
        <p className="mt-2 text-[#9DA3AE]">{location.address}</p>
        <p className="mt-1 text-[#9DA3AE]">{location.phone}</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold">Facility</h2>
            <p className="mt-2 text-[#9DA3AE]">
              {location.square_footage.toLocaleString()} sq ft
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {location.amenities.map((a) => (
                <span
                  key={a}
                  className="rounded-full bg-[#15171B] px-3 py-1 text-sm capitalize"
                >
                  {a}
                </span>
              ))}
            </div>
            <h2 className="mt-8 text-xl font-semibold">Hours</h2>
            <ul className="mt-2 space-y-1 text-sm text-[#9DA3AE]">
              {Object.entries(location.hours).map(([day, hours]) => (
                <li key={day}>
                  {day}: {hours}
                </li>
              ))}
            </ul>
            <h2 className="mt-8 text-xl font-semibold">Coaches</h2>
            <ul className="mt-2 space-y-2">
              {coaches.map((c) => (
                <li key={c.id} className="text-sm">
                  {c.first_name} {c.last_name} — {c.specialties.join(", ")}
                </li>
              ))}
            </ul>
          </div>
          <div id="book">
            <h2 className="text-xl font-semibold">Book a tour</h2>
            <div className="mt-4 rounded-lg border border-[#2A2D34] bg-[#15171B] p-6">
              <LeadCaptureForm
                locations={demoStore.locations}
                programs={demoStore.programs}
                defaultLocationId={location.id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
