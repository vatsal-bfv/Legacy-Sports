import Link from "next/link";
import { demoStore } from "@/lib/demo/store";
import { formatCurrency } from "@/lib/utils";

export default function HomePage() {
  const programs = demoStore.programs;
  const locations = demoStore.locations;

  return (
    <>
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          poster="https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=1200"
        >
          <source
            src="https://videos.pexels.com/video-files/4761414/4761414-uhd_2560_1440_25fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0B0D]/60 to-[#0A0B0D]" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            Where athletes become recruits.
          </h1>
          <p className="mt-6 text-lg text-[#9DA3AE]">
            Arizona&apos;s premier multi-location training complex. 5 locations.
            Elite coaching. Data-driven development.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/locations/mesa#book"
              className="rounded-md bg-[#FF5A1F] px-8 py-3 font-medium text-white hover:bg-[#E04E15]"
            >
              Book a free assessment
            </Link>
            <Link
              href="/programs"
              className="rounded-md border border-[#2A2D34] px-8 py-3 font-medium hover:bg-[#15171B]"
            >
              Explore programs
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-[#2A2D34] bg-[#15171B] py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          {[
            { label: "Athletes trained", value: "12,400+" },
            { label: "College commitments", value: "340+" },
            { label: "Locations", value: "5" },
            { label: "Years", value: "12" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-[#FF5A1F]">{stat.value}</p>
              <p className="mt-1 text-sm text-[#9DA3AE]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6">
        <h2 className="text-center text-3xl font-bold">Programs</h2>
        <div className="mx-auto mt-12 grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((p) => (
            <div
              key={p.id}
              className="rounded-lg border border-[#2A2D34] bg-[#15171B] p-6"
            >
              <h3 className="text-xl font-semibold">{p.name}</h3>
              <p className="mt-2 text-sm text-[#9DA3AE]">{p.description}</p>
              <p className="mt-4 font-semibold text-[#FF5A1F]">
                {formatCurrency(p.monthly_price)}/mo
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#15171B] py-20 px-6">
        <h2 className="text-center text-3xl font-bold">Locations</h2>
        <div className="mx-auto mt-12 grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((loc) => (
            <Link
              key={loc.id}
              href={`/locations/${loc.slug}`}
              className="group overflow-hidden rounded-lg border border-[#2A2D34] bg-[#0A0B0D]"
            >
              <div
                className="h-40 bg-cover bg-center transition-transform group-hover:scale-105"
                style={{ backgroundImage: `url(${loc.photo_urls[0]})` }}
              />
              <div className="p-4">
                <h3 className="font-semibold">{loc.name}</h3>
                <p className="text-sm text-[#9DA3AE]">{loc.address}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#2A2D34] py-12 px-6 text-center text-sm text-[#9DA3AE]">
        © Legacy Sports Complex · Phoenix Metro
      </footer>
    </>
  );
}
