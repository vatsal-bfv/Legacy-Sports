import Link from "next/link";
import Image from "next/image";
import {
  featuredAthletes,
  formatFeaturedSport,
  getFeaturedAthleteName,
} from "@/lib/marketing/featured-athletes";

export default function AthletesPage() {
  return (
    <div className="mx-auto max-w-7xl px-[var(--legacy-gutter)] pb-16 pt-28">
      <h1 className="text-4xl font-bold text-pitch">Success Stories</h1>
      <p className="mt-4 text-slate">
        Athletes who transformed their trajectory at Legacy.
      </p>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {featuredAthletes.map((athlete) => (
          <Link
            key={athlete.id}
            href={`/athletes/${athlete.slug}`}
            data-cursor="link"
            className="overflow-hidden rounded-[14px] border border-bone bg-chalk transition hover:border-orange/50 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
          >
            <div className="relative h-56 overflow-hidden">
              <Image
                src={athlete.photo_url}
                alt={`Portrait of ${getFeaturedAthleteName(athlete)}, a Legacy athlete`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-pitch">
                {getFeaturedAthleteName(athlete)}
              </h2>
              <p className="text-sm capitalize text-orange">
                {formatFeaturedSport(athlete.sport)}
              </p>
              <p className="mt-2 line-clamp-3 text-sm text-slate">{athlete.story}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
