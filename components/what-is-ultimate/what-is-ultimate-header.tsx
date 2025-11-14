import React from "react";
import { PageHeader } from "@/components/ui/page-header";

export interface WhatIsUltimateHeaderProps {
  title?: string;
  className?: string;
}

export function WhatIsUltimateHeader({
  title = "What is Ultimate?",
  className,
}: WhatIsUltimateHeaderProps): React.JSX.Element {
  return <PageHeader title={title} className={className} />;
}
