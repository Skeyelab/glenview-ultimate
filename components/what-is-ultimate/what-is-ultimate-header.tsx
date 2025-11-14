import React from "react";
import { cn } from "@/lib/utils";

export interface WhatIsUltimateHeaderProps {
  title?: string;
  className?: string;
}

export function WhatIsUltimateHeader({
  title = "What is Ultimate?",
  className,
}: WhatIsUltimateHeaderProps): React.JSX.Element {
  return <h1 className={cn("text-3xl font-bold text-white", className)}>{title}</h1>;
}
