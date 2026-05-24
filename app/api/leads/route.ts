import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/guards";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { demoStore } from "@/lib/demo/store";
import type { Lead } from "@/lib/demo/types";
import { apiLog } from "@/lib/server/api-logger";

export async function POST(request: Request) {
  const log = apiLog("POST /api/leads");
  const body = await request.json();
  log.request({
    email: body.email,
    location_id: body.interested_location_id ?? null,
    program_id: body.interested_program_id ?? null,
  });

  try {
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
        const { data, error } = await admin
          .from("leads")
          .insert(lead)
          .select()
          .single();
        if (error) {
          log.error(500, error, { source: "supabase" });
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        log.response(201, { leadId: data.id, source: "supabase" });
        return NextResponse.json({ lead: data });
      }
    }

    demoStore.addLead(lead);

    const location = demoStore.locations.find(
      (l) => l.id === lead.interested_location_id
    );
    const program = demoStore.programs.find(
      (p) => p.id === lead.interested_program_id
    );

    demoStore.addMessage({
      id: `msg-lead-in-${Date.now()}`,
      created_at: lead.created_at,
      channel: "in_app",
      direction: "inbound",
      from_party: "lead",
      to_party: "coach",
      athlete_id: null,
      lead_id: lead.id,
      subject: null,
      body: `New website inquiry: ${lead.first_name} ${lead.last_name} for ${lead.athlete_name || "their athlete"} (age ${lead.athlete_age || "—"}) · ${program?.name ?? "Program TBD"} · ${location?.name ?? "Location TBD"}. ${lead.notes ? `Notes: ${lead.notes}` : ""}`.trim(),
      read_at: null,
      ai_generated: false,
    });

    log.response(201, { leadId: lead.id, source: "demo" });
    return NextResponse.json({ lead });
  } catch (error) {
    log.error(500, error);
    return NextResponse.json({ error: "Create lead failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const since = new URL(request.url).searchParams.get("since");

  try {
    await requireStaff();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (isSupabaseConfigured()) {
      const admin = createAdminClient();
      if (admin && since) {
        const { data, error } = await admin
          .from("leads")
          .select("*")
          .gt("created_at", since)
          .order("created_at", { ascending: false });
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ leads: data ?? [] });
      }
    }

    const leads = since ? demoStore.getLeadsSince(since) : demoStore.leads;
    return NextResponse.json({ leads });
  } catch {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
