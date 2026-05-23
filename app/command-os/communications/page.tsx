"use client";

import { useState } from "react";
import { demoStore } from "@/lib/demo/store";
import { cn } from "@/lib/utils";

export default function CommunicationsPage() {
  const threads = demoStore.messages;
  const [selected, setSelected] = useState(threads[0]?.id ?? "");

  const current = threads.find((m) => m.id === selected);

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      <div className="w-80 shrink-0 overflow-y-auto rounded-lg border border-[#2A2D34] bg-[#15171B]">
        <h2 className="border-b border-[#2A2D34] p-4 font-semibold">Threads</h2>
        {threads.map((m) => {
          const athlete = demoStore.athletes.find((a) => a.id === m.athlete_id);
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelected(m.id)}
              className={cn(
                "w-full border-b border-[#2A2D34]/50 p-4 text-left text-sm hover:bg-[#12141A]",
                selected === m.id && "bg-[#12141A]"
              )}
            >
              <p className="font-medium">
                {athlete
                  ? `${athlete.first_name} ${athlete.last_name}`
                  : "Lead"}
              </p>
              <p className="truncate text-[#9DA3AE]">{m.body}</p>
            </button>
          );
        })}
      </div>
      <div className="flex flex-1 flex-col rounded-lg border border-[#2A2D34] bg-[#15171B]">
        {current ? (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-6">
              {threads
                .filter((m) => m.athlete_id === current.athlete_id)
                .map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "max-w-[80%] rounded-lg p-4 text-sm",
                      m.direction === "outbound"
                        ? "ml-auto bg-[#3B82F6]/20"
                        : "bg-[#0A0B0D]"
                    )}
                  >
                    {m.body}
                  </div>
                ))}
            </div>
            <div className="border-t border-[#2A2D34] p-4">
              <input
                placeholder="Reply..."
                className="w-full rounded-md border border-[#2A2D34] bg-[#0A0B0D] px-4 py-2 text-sm"
              />
            </div>
          </>
        ) : (
          <p className="p-6 text-[#9DA3AE]">Select a thread</p>
        )}
      </div>
    </div>
  );
}
