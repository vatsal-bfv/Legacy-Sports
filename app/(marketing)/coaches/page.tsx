import { redirect } from "next/navigation";
import { LANDING_SECTIONS } from "@/lib/marketing/landing-sections";

export default function CoachesIndexPage() {
  redirect(LANDING_SECTIONS.coaches);
}
