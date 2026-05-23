import type { Metadata } from "next";
import { LandingPage } from "@/components/marketing/landing/LandingPage";
import { demoStore } from "@/lib/demo/store";

export const metadata: Metadata = {
  title: {
    absolute: "Legacy Sports Complex - Where Athletes Become Recruits",
  },
  description:
    "Georgia's premier multi-location athlete development system. Performance training, combine prep, and a college recruiting pipeline powered by AI. 5 locations across Atlanta.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Legacy Sports Complex",
    description:
      "Where athletes become recruits. 5 Georgia locations. AI-powered athlete development.",
    images: "/og-image.jpg",
  },
};

export default function HomePage() {
  return (
    <LandingPage
      locations={demoStore.locations}
      programs={demoStore.programs}
    />
  );
}
