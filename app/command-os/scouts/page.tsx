import { demoStore } from "@/lib/demo/store";
import { formatSnakeCaseLabel } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ScoutsPage() {
  const scouts = demoStore.scoutUsers;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Scouts — Data Licensing</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate">Active scout seats</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">6</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate">Monthly revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$4,200</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate">Top searched athlete</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">Marcus Johnson</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Active scouts viewing your data</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {scouts.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between border-b border-bone/50 pb-3"
              >
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-sm text-slate">{s.organization}</p>
                </div>
                <span className="text-xs text-slate">
                  {formatSnakeCaseLabel(s.role)}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
