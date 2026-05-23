export function AthleteHologramFallback() {
  return (
    <div className="flex h-full min-h-[320px] flex-col items-center justify-center bg-chalk px-6">
      <svg
        viewBox="0 0 200 280"
        className="h-full max-h-[380px] w-full max-w-[240px] opacity-80"
        role="img"
        aria-label="Athlete performance hologram preview"
      >
        <ellipse cx="100" cy="248" rx="72" ry="12" fill="#ff5a1f" opacity="0.12" />
        <ellipse cx="100" cy="248" rx="52" ry="8" fill="none" stroke="#ff5a1f" strokeOpacity="0.3" />
        <path
          d="M100 38c-12 0-22 10-22 22s10 22 22 22 22-10 22-22-10-22-22-22zm-28 58c-8 6-14 18-16 32-2 14 0 28 4 40 4 12 10 22 16 28 6-6 12-16 16-28 4-12 6-26 4-40-2-14-8-26-16-32zm56 0c-8 6-14 18-16 32-2 14 0 28 4 40 4 12 10 22 16 28 6-6 12-16 16-28 4-12 6-26 4-40-2-14-8-26-16-32z"
          fill="none"
          stroke="#ff5a1f"
          strokeWidth="2"
          strokeOpacity="0.55"
        />
      </svg>
      <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-smoke">
        Athlete model preview
      </p>
    </div>
  );
}
