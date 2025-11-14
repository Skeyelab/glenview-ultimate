import React from "react";
import { cn } from "@/lib/utils";

export interface NewsHeaderProps {
  title?: string;
  className?: string;
}

export function NewsHeader({ title = "News", className }: NewsHeaderProps): React.JSX.Element {
  return <h1 className={cn("text-3xl font-bold text-white", className)}>{title}</h1>;
}
