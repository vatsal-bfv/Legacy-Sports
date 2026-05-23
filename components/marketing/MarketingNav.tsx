import Link from "next/link";

export function MarketingNav() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-[#2A2D34]/50 bg-[#0A0B0D]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold tracking-[0.3em] text-[#F5F6F7]">
          LEGACY
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/programs" className="text-sm text-[#9DA3AE] hover:text-[#F5F6F7]">
            Programs
          </Link>
          <Link href="/locations" className="text-sm text-[#9DA3AE] hover:text-[#F5F6F7]">
            Locations
          </Link>
          <Link href="/athletes" className="text-sm text-[#9DA3AE] hover:text-[#F5F6F7]">
            Athletes
          </Link>
          <Link href="/about" className="text-sm text-[#9DA3AE] hover:text-[#F5F6F7]">
            About
          </Link>
        </nav>
        <Link
          href="/locations/mesa#book"
          className="rounded-md bg-[#FF5A1F] px-4 py-2 text-sm font-medium text-white hover:bg-[#E04E15]"
        >
          Book assessment
        </Link>
      </div>
    </header>
  );
}
