import React from "react";
import { PageHeader } from "@/components/ui/page-header";

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
  return <PageHeader title={title} description={description} className={className} />;
}
