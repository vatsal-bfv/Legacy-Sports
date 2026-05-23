"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

/** ~$87K/yr — based on published pricing for Legacy's current stack (5 locations). */
const CURRENT_STACK_ANNUAL = 87_000;
const CURRENT_STACK_MONTHLY = CURRENT_STACK_ANNUAL / 12;

const currentStack = [
  {
    item: "Mindbody × 5 locations",
    detail: "Ultimate tier · ~$725/location/mo (Mindbody, 2026)",
    cost: 3625,
  },
  {
    item: "Mailchimp Premium",
    detail: "~15K contacts · from $350/mo (Mailchimp, 2026)",
    cost: 350,
  },
  {
    item: "Smart Waiver Enterprise",
    detail: "Multi-location · high waiver volume (Smartwaiver)",
    cost: 500,
  },
  {
    item: "ScreenCloud Pro",
    detail: "20 screens × $30/screen/mo (ScreenCloud)",
    cost: 600,
  },
  {
    item: "Firstbeat Sports Premium",
    detail: "~120 athlete profiles · ~$218/athlete/yr (Firstbeat)",
    cost: 2175,
  },
];

const legacyStack = [
  {
    item: "Legacy Command (unified)",
    detail: "Scheduling, CRM, measurables, comms, ops — all locations",
    cost: 2000,
  },
  {
    item: "Scout Portal revenue (proj.)",
    detail: "Data licensing · ramping through month 24",
    cost: -5500,
  },
];

/** Monthly net position: Legacy platform cost minus projected Scout revenue. */
const legacyNetMonthly =
  legacyStack.reduce((sum, i) => sum + i.cost, 0);

const projection = Array.from({ length: 24 }, (_, i) => {
  const month = i + 1;
  const scoutRamp = Math.min(1, month / 18);
  const legacyNet = 2000 - 5500 * scoutRamp;
  return {
    month: `M${month}`,
    current: CURRENT_STACK_MONTHLY,
    legacy: Math.round(legacyNet),
  };
});

export default function CostComparisonPage() {
  const currentTotal = currentStack.reduce((s, i) => s + i.cost, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Cost Comparison</h1>
        <p className="mt-1 text-[#9DA3AE]">
          Why it matters: Legacy runs Mindbody × 5 locations plus Mailchimp,
          Smart Waiver, ScreenCloud, and Firstbeat — about{" "}
          <span className="text-[#F5F6F7]">
            {formatCurrency(CURRENT_STACK_ANNUAL)}/year
          </span>{" "}
          in fragmented software today.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-[#2A2D34] bg-[#15171B] p-6">
          <h2 className="mb-1 font-semibold text-red-400">Current stack</h2>
          <p className="mb-4 text-xs text-[#9DA3AE]">
            Published list pricing · 5 Arizona locations
          </p>
          <ul className="space-y-3">
            {currentStack.map((i) => (
              <li key={i.item} className="text-sm">
                <div className="flex justify-between gap-4">
                  <span>{i.item}</span>
                  <span className="shrink-0">{formatCurrency(i.cost)}/mo</span>
                </div>
                <p className="mt-0.5 text-xs text-[#9DA3AE]">{i.detail}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-[#2A2D34] pt-4 font-bold">
            Total: {formatCurrency(currentTotal)}/mo ·{" "}
            {formatCurrency(CURRENT_STACK_ANNUAL)}/yr
          </p>
        </div>

        <div className="rounded-lg border border-[#3B82F6]/30 bg-[#15171B] p-6">
          <h2 className="mb-1 font-semibold text-[#3B82F6]">
            Legacy Command unified
          </h2>
          <p className="mb-4 text-xs text-[#9DA3AE]">
            One platform + Scout data revenue
          </p>
          <ul className="space-y-3">
            {legacyStack.map((i) => (
              <li key={i.item} className="text-sm">
                <div className="flex justify-between gap-4">
                  <span>{i.item}</span>
                  <span
                    className={`shrink-0 ${i.cost < 0 ? "text-emerald-400" : ""}`}
                  >
                    {i.cost < 0 ? "+" : ""}
                    {formatCurrency(Math.abs(i.cost))}/mo
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[#9DA3AE]">{i.detail}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-[#2A2D34] pt-4 font-bold text-emerald-400">
            Net at scale: {formatCurrency(Math.abs(legacyNetMonthly))}/mo
            {legacyNetMonthly < 0 ? " projected revenue" : " cost"}
          </p>
          <p className="mt-2 text-sm text-[#9DA3AE]">
            Scout Portal licensing offsets platform cost as scout seats ramp
            through month 18.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-[#2A2D34] bg-[#15171B] p-6">
        <h2 className="mb-1 font-semibold">24-month net projection</h2>
        <p className="mb-4 text-xs text-[#9DA3AE]">
          Red: current stack spend ({formatCurrency(CURRENT_STACK_MONTHLY)}/mo).
          Green: Legacy net position (platform minus Scout revenue).
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={projection}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2D34" />
            <XAxis
              dataKey="month"
              stroke="#9DA3AE"
              interval={2}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              stroke="#9DA3AE"
              tickFormatter={(v) =>
                v >= 1000 || v <= -1000 ? `$${Math.round(v / 1000)}k` : `$${v}`
              }
            />
            <Tooltip
              contentStyle={{
                background: "#15171B",
                border: "1px solid #2A2D34",
              }}
              formatter={(value: number, name: string) => [
                formatCurrency(Math.abs(value)) +
                  (name === "Legacy net" && value < 0 ? " net gain" : "/mo"),
                name,
              ]}
            />
            <Line
              type="monotone"
              dataKey="current"
              stroke="#ef4444"
              name="Current stack"
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="legacy"
              stroke="#10b981"
              name="Legacy net"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
