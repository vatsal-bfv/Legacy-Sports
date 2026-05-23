"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

const currentStack = [
  { item: "Mindbody", cost: 890 },
  { item: "Hudl", cost: 1200 },
  { item: "TeamBuildr", cost: 450 },
  { item: "Mailchimp", cost: 120 },
  { item: "Stripe fees", cost: 380 },
  { item: "Misc tools", cost: 560 },
];

const legacyStack = [
  { item: "Legacy Command", cost: 1200 },
  { item: "Scout Portal (proj.)", cost: -4200 },
];

const projection = [
  { month: "M1", current: 3600, legacy: -2800 },
  { month: "M6", current: 3600, legacy: -5200 },
  { month: "M12", current: 3600, legacy: -7800 },
  { month: "M18", current: 3600, legacy: -9200 },
  { month: "M24", current: 3600, legacy: -11000 },
];

export default function CostComparisonPage() {
  const currentTotal = currentStack.reduce((s, i) => s + i.cost, 0);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Cost Comparison</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-[#2A2D34] bg-[#15171B] p-6">
          <h2 className="mb-4 font-semibold text-red-400">Current stack</h2>
          <ul className="space-y-2">
            {currentStack.map((i) => (
              <li key={i.item} className="flex justify-between text-sm">
                <span>{i.item}</span>
                <span>{formatCurrency(i.cost)}/mo</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-[#2A2D34] pt-4 font-bold">
            Total: {formatCurrency(currentTotal)}/mo
          </p>
        </div>
        <div className="rounded-lg border border-[#3B82F6]/30 bg-[#15171B] p-6">
          <h2 className="mb-4 font-semibold text-[#3B82F6]">Legacy Command unified</h2>
          <ul className="space-y-2">
            {legacyStack.map((i) => (
              <li key={i.item} className="flex justify-between text-sm">
                <span>{i.item}</span>
                <span
                  className={i.cost < 0 ? "text-emerald-400" : ""}
                >
                  {i.cost < 0 ? "+" : ""}
                  {formatCurrency(Math.abs(i.cost))}/mo
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[#9DA3AE]">
            Scout Portal revenue offsets platform cost starting month 2.
          </p>
        </div>
      </div>
      <div className="rounded-lg border border-[#2A2D34] bg-[#15171B] p-6">
        <h2 className="mb-4 font-semibold">24-month net projection</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={projection}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2D34" />
            <XAxis dataKey="month" stroke="#9DA3AE" />
            <YAxis stroke="#9DA3AE" />
            <Tooltip contentStyle={{ background: "#15171B", border: "1px solid #2A2D34" }} />
            <Line type="monotone" dataKey="current" stroke="#ef4444" name="Current stack" />
            <Line type="monotone" dataKey="legacy" stroke="#10b981" name="Legacy net" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
