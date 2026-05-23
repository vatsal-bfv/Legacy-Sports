import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demoStore } from "@/lib/demo/store";
import { formatCurrency } from "@/lib/utils";

export default function OperationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Operations</h1>
      <Tabs defaultValue="locations">
        <TabsList>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="coaches">Coaches</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
        </TabsList>
        <TabsContent value="locations" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {demoStore.locations.map((loc) => (
            <Card key={loc.id}>
              <CardHeader>
                <CardTitle>{loc.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#9DA3AE]">{loc.address}</p>
                <p className="mt-2 text-sm">
                  {loc.square_footage.toLocaleString()} sq ft
                </p>
                <p className="mt-2 text-xs text-emerald-400">87% utilization</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="coaches" className="grid gap-4 sm:grid-cols-2">
          {demoStore.coaches.map((c) => (
            <Card key={c.id}>
              <CardHeader>
                <CardTitle>
                  {c.first_name} {c.last_name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#9DA3AE]">{c.bio}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {c.specialties.map((s) => (
                    <span
                      key={s}
                      className="rounded bg-[#0A0B0D] px-2 py-0.5 text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="programs" className="grid gap-4 sm:grid-cols-2">
          {demoStore.programs.map((p) => (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle>{p.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#9DA3AE]">{p.description}</p>
                <p className="mt-2 font-semibold">
                  {formatCurrency(p.monthly_price)}/mo
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
