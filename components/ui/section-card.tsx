import React from "react";
import { cn } from "@/lib/utils";

export interface SectionCardProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  titleAs?: keyof React.JSX.IntrinsicElements;
  titleClassName?: string;
}

export function SectionCard({
  title,
  subtitle,
  actions,
  children,
  className,
  titleAs: TitleTag = "h2",
  titleClassName,
}: SectionCardProps): React.JSX.Element {
  return (
    <section className={cn("card space-y-3", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <TitleTag className={cn("text-xl font-semibold text-white", titleClassName)}>{title}</TitleTag>
          {subtitle && <p className="text-sm text-white/70">{subtitle}</p>}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

