import React from "react";

interface FooterProps {
  siteName: string;
  footerText?: string | null;
}

export function Footer({ siteName, footerText }: FooterProps): React.JSX.Element {
  const defaultCopy = `© ${new Date().getFullYear()} ${siteName}`;
  return (
    <footer className="border-t border-white/20 mt-4">
      <div className="container py-8 text-sm text-white/70">{footerText || defaultCopy}</div>
    </footer>
  );
}

