"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { QueryResponse } from "@/lib/ai/query-cache";
import { AiMarkdown } from "@/components/app/AiMarkdown";

export function QueryResultRenderer({
  response,
  isAnimating = false,
}: {
  response: QueryResponse;
  isAnimating?: boolean;
}) {
  if (response.type === "narrative") {
    return (
      <AiMarkdown isAnimating={isAnimating}>{response.markdown}</AiMarkdown>
    );
  }

  if (response.type === "chart") {
    const data = response.data as Record<string, unknown>[];
    const keys = data[0]
      ? Object.keys(data[0]).filter((k) => k !== response.x)
      : [response.y];

    return (
      <div>
        <h4 className="mb-4 font-semibold text-[#F5F6F7]">{response.title}</h4>
        <ResponsiveContainer width="100%" height={240}>
          {response.chartType === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2D34" />
              <XAxis dataKey={response.x} stroke="#9DA3AE" fontSize={12} />
              <YAxis stroke="#9DA3AE" fontSize={12} />
              <Tooltip contentStyle={{ background: "#15171B", border: "1px solid #2A2D34" }} />
              <Bar dataKey={response.y} fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2D34" />
              <XAxis dataKey={response.x} stroke="#9DA3AE" fontSize={12} />
              <YAxis stroke="#9DA3AE" fontSize={12} />
              <Tooltip contentStyle={{ background: "#15171B", border: "1px solid #2A2D34" }} />
              {keys.map((k, i) => (
                <Line
                  key={k}
                  type="monotone"
                  dataKey={k}
                  stroke={i === 0 ? "#3B82F6" : "#FF5A1F"}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  }

  if (response.type === "list") {
    return (
      <div>
        {response.title && (
          <h4 className="mb-3 font-semibold text-[#F5F6F7]">{response.title}</h4>
        )}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2A2D34] text-left text-[#9DA3AE]">
              {response.columns.map((c) => (
                <th key={c.key} className="pb-2 pr-4">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {response.items.map((item, i) => (
              <tr key={i} className="border-b border-[#2A2D34]/50">
                {response.columns.map((c) => (
                  <td key={c.key} className="py-2 pr-4 text-[#F5F6F7]">
                    {String(item[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (response.type === "mixed") {
    return (
      <div className="space-y-6">
        {response.blocks.map((block, i) => (
          <QueryResultRenderer
            key={i}
            response={block}
            isAnimating={isAnimating}
          />
        ))}
      </div>
    );
  }

  return null;
}
