'use client';

import React, { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { applyVisualEditing, isVisualEditingEnabled } from "@/lib/visual-editing";

export function HomeVisualEditingProvider({
  directusUrl,
  children,
}: {
  directusUrl: string;
  children: React.ReactNode;
}): React.ReactElement {
  const pathname = usePathname();
  const search = useSearchParams();
  const cleanupRef = useRef<null | (() => void)>(null);

  useEffect(() => {
    let mounted = true;
    async function run() {
      if (!isVisualEditingEnabled(search)) return;
      const result = await applyVisualEditing(directusUrl);
      if (!result) return;
      cleanupRef.current = result.remove;
    }
    run();
    return () => {
      if (!mounted) return;
      cleanupRef.current?.();
      mounted = false;
    };
  }, [pathname, search, directusUrl]);

  return <>{children}</>;
}
