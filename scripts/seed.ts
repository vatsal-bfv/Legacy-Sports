/**
 * Idempotent seed script for Legacy Sports Complex demo.
 * Run: npm run seed
 * Requires SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL for live DB.
 * Without Supabase, exports public-athletes.json from demo data.
 */
import "dotenv/config";
import { writeFileSync } from "fs";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";
import {
  athletes,
  coaches,
  locations,
  programs,
  measurables,
  initialLeads,
  messages,
  scoutUsers,
  videoClips,
  coachNotes,
  wearables,
  payments,
  sessions,
  attendance,
  publicAthletes,
} from "../lib/demo/data";
import { DEMO_PASSWORD, STAFF_EMAIL, SCOUT_EMAIL } from "../lib/constants";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function seedAuth(admin: ReturnType<typeof createClient>) {
  const users = [
    {
      email: STAFF_EMAIL,
      password: DEMO_PASSWORD,
      role: "legacy_staff",
      display_name: "Amber Chovanic",
    },
    {
      email: SCOUT_EMAIL,
      password: DEMO_PASSWORD,
      role: "scout",
      display_name: "Coach Mike Chen",
    },
  ];

  for (const u of users) {
    const { data: existing } = await admin.auth.admin.listUsers();
    const found = existing?.users?.find((x) => x.email === u.email);
    if (found) {
      await admin.auth.admin.updateUserById(found.id, {
        app_metadata: { role: u.role },
        user_metadata: { display_name: u.display_name },
      });
      console.log(`Updated auth user: ${u.email}`);
    } else {
      const { data, error } = await admin.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        app_metadata: { role: u.role },
        user_metadata: { display_name: u.display_name },
      });
      if (error) console.error(`Auth error ${u.email}:`, error.message);
      else console.log(`Created auth user: ${u.email}`, data.user?.id);
    }
  }
}

async function upsertTable(
  admin: ReturnType<typeof createClient>,
  table: string,
  rows: Record<string, unknown>[]
) {
  if (!rows.length) return;
  const { error } = await admin.from(table).upsert(rows, { onConflict: "id" });
  if (error) console.error(`Error seeding ${table}:`, error.message);
  else console.log(`Seeded ${table}: ${rows.length} rows`);
}

async function main() {
  const publicPath = join(process.cwd(), "content/public-athletes.json");
  writeFileSync(publicPath, JSON.stringify(publicAthletes, null, 2));
  console.log("Wrote content/public-athletes.json");

  if (!url || !serviceKey) {
    console.log(
      "Supabase not configured — demo mode uses in-memory data. Set env vars to seed DB."
    );
    return;
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  await seedAuth(admin);
  await upsertTable(admin, "locations", locations as unknown as Record<string, unknown>[]);
  await upsertTable(admin, "programs", programs as unknown as Record<string, unknown>[]);
  await upsertTable(admin, "coaches", coaches as unknown as Record<string, unknown>[]);
  await upsertTable(admin, "athletes", athletes as unknown as Record<string, unknown>[]);
  await upsertTable(admin, "measurables", measurables as unknown as Record<string, unknown>[]);
  await upsertTable(admin, "leads", initialLeads as unknown as Record<string, unknown>[]);
  await upsertTable(admin, "messages", messages as unknown as Record<string, unknown>[]);
  await upsertTable(admin, "scout_users", scoutUsers as unknown as Record<string, unknown>[]);
  await upsertTable(admin, "video_clips", videoClips as unknown as Record<string, unknown>[]);
  await upsertTable(admin, "coach_notes", coachNotes.map((n) => ({ ...n, embedding: null })) as unknown as Record<string, unknown>[]);
  await upsertTable(admin, "wearable_data", wearables.slice(0, 500) as unknown as Record<string, unknown>[]);
  await upsertTable(admin, "payments", payments as unknown as Record<string, unknown>[]);
  await upsertTable(admin, "sessions", sessions as unknown as Record<string, unknown>[]);
  await upsertTable(admin, "attendance", attendance as unknown as Record<string, unknown>[]);

  console.log("Seed complete.");
}

main().catch(console.error);
