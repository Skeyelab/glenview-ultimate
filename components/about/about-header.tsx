import React from "react";

export interface AboutHeaderProps {
  title?: string;
  description: string;
  className?: string;
}

export function AboutHeader({
  title = "About Glenview Ultimate",
  description,
  className,
}: AboutHeaderProps): React.JSX.Element {
  return (
    <div className={className}>
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      <p className="text-white/90">{description}</p>
    </div>
  );
}
