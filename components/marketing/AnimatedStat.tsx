"use client";

import { useEffect, useState } from "react";

export function AnimatedStat({
  label,
  target,
  suffix = "",
}: {
  label: string;
  target: number;
  suffix?: string;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  const formatted =
    target >= 1000 ? value.toLocaleString("en-US") : String(value);

  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-[#FF5A1F]">
        {formatted}
        {suffix}
      </p>
      <p className="mt-1 text-sm text-[#9DA3AE]">{label}</p>
    </div>
  );
}
