"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { gsap } from "@/lib/gsap";
import { scrollToTarget, getLenis } from "@/lib/lenis";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { id: "about", label: "About", href: "/#about" },
  { id: "locations", label: "Locations", href: "/#locations" },
  { id: "programs", label: "Programs", href: "/#programs" },
  { id: "coaches", label: "Coaches", href: "/#coaches" },
  { id: "athletes", label: "Athletes", href: "/#athletes" },
  { id: "testimonials", label: "Testimonials", href: "/#testimonials" },
  { id: "command", label: "Command OS", href: "/#command" },
  { id: "intake", label: "Contact", href: "/#intake" },
];

const MENU_LOCATIONS = [
  "Suwanee",
  "Lawrenceville",
  "Hoschton",
  "Canton",
  "Alpharetta",
];

const NAV_OFFSET = 120;

function resolveActiveSection() {
  let current = "";

  for (const link of NAV_LINKS) {
    const section = document.getElementById(link.id);
    if (!section) {
      continue;
    }

    if (section.getBoundingClientRect().top <= NAV_OFFSET) {
      current = link.id;
    }
  }

  return current;
}

export function MarketingNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const visibleActiveSection = isHome ? activeSection : "";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(!isHome || window.scrollY > 100);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    if (!isHome) {
      return;
    }

    const updateActiveSection = () => {
      setActiveSection(resolveActiveSection());
    };

    updateActiveSection();

    let lenisAttached = false;
    let lenisPollId = 0;

    const attachLenis = () => {
      const lenis = getLenis();
      if (!lenis || lenisAttached) {
        return lenisAttached;
      }

      lenis.on("scroll", updateActiveSection);
      lenisAttached = true;
      return true;
    };

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    if (!attachLenis()) {
      lenisPollId = window.setInterval(() => {
        if (attachLenis()) {
          window.clearInterval(lenisPollId);
        }
      }, 100);
    }

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      window.clearInterval(lenisPollId);

      const lenis = getLenis();
      if (lenisAttached && lenis) {
        lenis.off("scroll", updateActiveSection);
      }
    };
  }, [isHome, pathname]);

  useEffect(() => {
    const menu = menuRef.current;

    if (!menu) {
      return;
    }

    document.body.style.overflow = menuOpen ? "hidden" : "";

    if (menuOpen) {
      const links = menu.querySelectorAll("[data-menu-link]");

      gsap.killTweensOf(menu);
      gsap.killTweensOf(links);
      gsap.set(menu, { yPercent: -100, display: "block" });
      gsap.to(menu, {
        yPercent: 0,
        duration: 0.65,
        ease: "legacyEase",
      });
      gsap.fromTo(
        links,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.07,
          ease: "legacyEase",
          delay: 0.2,
        }
      );
      return;
    }

    if (!menuVisible) {
      return;
    }

    gsap.killTweensOf(menu);
    gsap.to(menu, {
      yPercent: -100,
      duration: 0.45,
      ease: "legacyEase",
      onComplete: () => setMenuVisible(false),
    });

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, menuVisible]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");

    function onChange(event: MediaQueryListEvent) {
      if (event.matches) {
        setMenuOpen(false);
      }
    }

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const handleAnchorClick = (
    event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    href: string
  ) => {
    if (!isHome || !href.startsWith("/#")) {
      setMenuOpen(false);
      return;
    }

    event.preventDefault();
    setMenuOpen(false);
    scrollToTarget(href.replace("/", ""), { offset: -80 });
  };

  const toggleMenu = () => {
    if (!menuOpen) {
      setMenuVisible(true);
    }

    setMenuOpen((current) => !current);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[999] h-14 transition-all duration-500 md:h-[68px]",
          scrolled || menuOpen
            ? "bg-ink/88 backdrop-blur-2xl"
            : "bg-transparent"
        )}
      >
        <div className="flex h-full items-center justify-between px-[var(--legacy-gutter)]">
          <Link
            href="/#top"
            data-cursor="link"
            onClick={(event) => handleAnchorClick(event, "/#top")}
            className="flex items-center text-ghost no-underline"
          >
            <span className="legacy-display text-[26px] uppercase tracking-[0.1em]">
              LEGACY
            </span>
            <span className="mx-3 h-5 w-px bg-orange/50" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ash">
              SPORTS COMPLEX
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                data-cursor="link"
                onClick={(event) => handleAnchorClick(event, link.href)}
                className={cn(
                  "relative pb-0.5 text-[13px] font-medium text-coal transition-colors duration-200 hover:text-ghost",
                  visibleActiveSection === link.id && "text-ghost"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute inset-x-0 bottom-[-2px] h-px origin-left bg-orange transition-all duration-300",
                    visibleActiveSection === link.id
                      ? "scale-x-100 opacity-50"
                      : "scale-x-0 opacity-100"
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center">
            <button
              type="button"
              data-cursor="link"
              onClick={() => scrollToTarget("#intake", { offset: -80 })}
              className="hidden rounded-full bg-orange px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-field transition-all duration-200 hover:scale-[1.02] hover:bg-ember sm:inline-flex"
            >
              Book A Session
            </button>
            <button
              type="button"
              data-cursor="link"
              onClick={toggleMenu}
              className="ml-5 min-w-[44px] text-right text-[11px] font-bold uppercase tracking-[0.14em] text-ash transition-colors duration-200 hover:text-ghost lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="legacy-overlay-menu"
            >
              {menuOpen ? "X" : "MENU"}
            </button>
          </div>
        </div>
      </header>

      {menuVisible ? (
        <div
          id="legacy-overlay-menu"
          ref={menuRef}
          className="fixed inset-0 z-[998] hidden bg-ink px-[var(--legacy-gutter)] pt-28 text-ghost"
        >
          <div className="flex h-full flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-center">
              {NAV_LINKS.map((link, index) => (
                <Link
                  key={link.id}
                  href={link.href}
                  data-menu-link
                  data-cursor="link"
                  onClick={(event) => handleAnchorClick(event, link.href)}
                  className="group flex items-center gap-4 no-underline"
                >
                  <span className="w-12 text-right text-[11px] font-bold uppercase tracking-[0.14em] text-orange">
                    [ {String(index + 1).padStart(2, "0")} ]
                  </span>
                  <span className="legacy-display text-[clamp(48px,8vw,88px)] uppercase tracking-[0.04em] text-ghost transition-all duration-300 group-hover:translate-x-3 group-hover:text-orange">
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-16 w-full max-w-4xl border-t border-steel pt-8">
              <div className="flex flex-wrap items-center justify-center gap-6 text-[13px] text-coal">
                {MENU_LOCATIONS.map((location) => (
                  <span key={location}>{location}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
