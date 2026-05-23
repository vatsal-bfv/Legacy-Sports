"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ScoutLogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/scout/login");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={logout}
      className="gap-2 text-gray-600 hover:text-[#1A2332]"
    >
      <LogOut className="h-4 w-4" />
      Log out
    </Button>
  );
}
