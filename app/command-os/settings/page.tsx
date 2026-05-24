import { demoStore } from "@/lib/demo/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="text-slate">
        Demo environment — most configuration is read-only for the presentation.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {demoStore.locations.map((l) => (
                <li key={l.id} className="flex justify-between">
                  <span>{l.name}</span>
                  <span className="text-slate">{l.phone}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Stripe payments</span>
              <span className="text-emerald-400">Connected</span>
            </div>
            <div className="flex justify-between">
              <span>WHOOP wearables</span>
              <span className="text-emerald-400">Connected</span>
            </div>
            <div className="flex justify-between">
              <span>Gemini AI (Vercel AI SDK)</span>
              <span className="text-slate">API key optional</span>
            </div>
            <div className="flex justify-between">
              <span>Supabase Realtime</span>
              <span className="text-slate">Poll fallback active</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Staff users</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate">
            amber@legacy.demo (Director) · Demo password in README
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate">
            New leads and unread messages appear in the header bell. Polling
            interval:{" "}
            {process.env.NEXT_PUBLIC_LEADS_POLL_FALLBACK === "true"
              ? "2s"
              : "5s"}
            .
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
