import { cn } from "@/lib/utils";

export function ScoutCard({
  children,
  className,
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[14px] border border-bone bg-chalk",
        hover &&
          "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:border-orange hover:shadow-[0_16px_48px_rgba(0,0,0,0.09),0_0_0_1.5px_var(--legacy-orange)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ScoutSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-orange">
      [ {children} ]
    </p>
  );
}

export function ScoutPageHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div>
      <h1 className="text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-pitch">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-sm text-slate">{subtitle}</p>
      )}
    </div>
  );
}
