import React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function PageHeader({
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
}: PageHeaderProps): React.JSX.Element {
  return (
    <div className={className}>
      <h1 className={cn("text-4xl md:text-5xl font-bold text-white", titleClassName)}>{title}</h1>
      {description && <p className={cn("text-white/80 mt-3 text-lg max-w-2xl", descriptionClassName)}>{description}</p>}
    </div>
  );
}
