import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/guards";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { demoStore } from "@/lib/demo/store";
import type { Lead } from "@/lib/demo/types";

export async function POST(request: Request) {
  const body = await request.json();

  const lead: Lead = {
    id: `lead-${Date.now()}`,
    created_at: new Date().toISOString(),
    source: "website",
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    phone: body.phone ?? "",
    athlete_name: body.athlete_name ?? "",
    athlete_age: body.athlete_age ?? 0,
    interested_program_id: body.interested_program_id ?? "",
    interested_location_id: body.interested_location_id ?? "",
    notes: body.notes ?? "",
    status: "new",
    assigned_coach_id: null,
  };

  if (isSupabaseConfigured()) {
    const admin = createAdminClient();
    if (admin) {
      const { data, error } = await admin.from("leads").insert(lead).select().single();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ lead: data });
    }
  }

  demoStore.addLead(lead);
  return NextResponse.json({ lead });
}

export async function GET(request: Request) {
  try {
    await requireStaff();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const since = new URL(request.url).searchParams.get("since");

  if (isSupabaseConfigured()) {
    const admin = createAdminClient();
    if (admin && since) {
      const { data } = await admin
        .from("leads")
        .select("*")
        .gt("created_at", since)
        .order("created_at", { ascending: false });
      return NextResponse.json({ leads: data ?? [] });
    }
  }

  const leads = since
    ? demoStore.getLeadsSince(since)
    : demoStore.leads;
  return NextResponse.json({ leads });
}
