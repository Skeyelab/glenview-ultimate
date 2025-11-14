'use client';
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { DesktopNav } from "./desktop-nav";
import { MobileMenuButton } from "./mobile-menu-button";
import { MobileMenu } from "./mobile-menu";

interface NavbarProps {
  siteName: string;
  logoUrl: string | null;
  links: ReadonlyArray<{ href: string; label: string }>;
  ctaLabel?: string | null;
  ctaHref?: string | null;
}

export function Navbar({ siteName, logoUrl, links, ctaLabel, ctaHref }: NavbarProps): React.JSX.Element {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="border-b border-white/10 md:border-none">
      <div className="container py-4 flex items-center justify-between gap-3 md:gap-4">
        <Logo siteName={siteName} logoUrl={logoUrl} />
        <DesktopNav links={links} />
        {ctaLabel && ctaHref && (
          <div className="hidden md:block">
            <Button asChild>
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          </div>
        )}
        <MobileMenuButton isOpen={menuOpen} onClick={() => setMenuOpen((prev) => !prev)} />
      </div>
      <MobileMenu links={links} isOpen={menuOpen} ctaLabel={ctaLabel} ctaHref={ctaHref} />
    </div>
  );
}

