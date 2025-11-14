import React from "react";
import { PageHeader } from "@/components/ui/page-header";

export interface NewsHeaderProps {
  title?: string;
  className?: string;
}

export function NewsHeader({ title = "News", className }: NewsHeaderProps): React.JSX.Element {
  return <PageHeader title={title} className={className} />;
}
