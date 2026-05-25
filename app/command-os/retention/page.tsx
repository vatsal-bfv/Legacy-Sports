import { redirect } from "next/navigation";

export default function RetentionPage() {
  redirect("/command-os/communications?retention=at_risk");
}
