import Link from "next/link";
import Image from "next/image";
import publicAthletes from "@/content/public-athletes.json";

export default function AthletesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="text-4xl font-bold">Success Stories</h1>
      <p className="mt-4 text-[#9DA3AE]">
        Athletes who transformed their trajectory at Legacy.
      </p>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {publicAthletes.map((a) => (
          <Link
            key={a.id}
            href={`/athletes/${a.slug}`}
            className="overflow-hidden rounded-lg border border-[#2A2D34] bg-[#15171B] transition hover:border-[#FF5A1F]/50"
          >
            <Image
              src={a.photo_url}
              alt=""
              width={400}
              height={300}
              className="h-56 w-full object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold">
                {a.first_name} {a.last_name}
              </h2>
              <p className="text-sm capitalize text-[#FF5A1F]">{a.sport}</p>
              <p className="mt-2 text-sm text-[#9DA3AE]">{a.story}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
