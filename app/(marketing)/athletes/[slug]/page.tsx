import { notFound } from "next/navigation";
import Image from "next/image";
import publicAthletes from "@/content/public-athletes.json";
import Link from "next/link";

export default async function PublicAthletePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const athlete = publicAthletes.find((a) => a.slug === slug);
  if (!athlete) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Link href="/athletes" className="text-sm text-[#9DA3AE] hover:text-[#FF5A1F]">
        ← All stories
      </Link>
      <div className="mt-8 flex flex-col gap-8 md:flex-row">
        <Image
          src={athlete.photo_url}
          alt=""
          width={300}
          height={300}
          className="rounded-xl"
        />
        <div>
          <h1 className="text-4xl font-bold">
            {athlete.first_name} {athlete.last_name}
          </h1>
          <p className="mt-2 capitalize text-[#FF5A1F]">{athlete.sport}</p>
          <p className="text-[#9DA3AE]">{athlete.school}</p>
          <p className="mt-6 leading-relaxed">{athlete.story}</p>
        </div>
      </div>
    </div>
  );
}
