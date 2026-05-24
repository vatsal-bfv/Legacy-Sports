import { redirect } from "next/navigation";
import { LANDING_SECTIONS } from "@/lib/marketing/landing-sections";

export default function LocationsIndexPage() {
  redirect(LANDING_SECTIONS.locations);
}
