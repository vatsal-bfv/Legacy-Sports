import { demoStore } from "@/lib/demo/store";

export default function SchedulePage() {
  const locations = demoStore.locations;
  const hours = [9, 10, 11, 14, 15, 16];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Schedule</h1>
      <div className="overflow-x-auto rounded-lg border border-[#2A2D34]">
        <table className="w-full min-w-[800px] text-sm">
          <thead>
            <tr className="bg-[#12141A]">
              <th className="p-3 text-left text-[#9DA3AE]">Time</th>
              {locations.map((l) => (
                <th key={l.id} className="p-3 text-left text-[#9DA3AE]">
                  {l.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((h) => (
              <tr key={h} className="border-t border-[#2A2D34]/50">
                <td className="p-3 text-[#9DA3AE]">
                  {h}:00 {h < 12 ? "AM" : "PM"}
                </td>
                {locations.map((loc) => {
                  const session = demoStore.sessions.find(
                    (s) =>
                      s.location_id === loc.id &&
                      new Date(s.starts_at).getHours() === h
                  );
                  const prog = session
                    ? demoStore.programs.find((p) => p.id === session.program_id)
                    : null;
                  return (
                    <td key={loc.id} className="p-3">
                      {prog ? (
                        <div className="rounded bg-[#3B82F6]/20 px-2 py-1 text-xs">
                          {prog.name}
                        </div>
                      ) : (
                        <span className="text-[#9DA3AE]">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
