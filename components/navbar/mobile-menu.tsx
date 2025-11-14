'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavLink } from "./nav-link";

interface NavLinkData {
  href: string;
  label: string;
}

interface MobileMenuProps {
  links: readonly NavLinkData[];
  isOpen: boolean;
  ctaLabel?: string | null;
  ctaHref?: string | null;
}

export function MobileMenu({ links, isOpen, ctaLabel, ctaHref }: MobileMenuProps): React.JSX.Element {
  if (!isOpen) return <></>;

  return (
    <div className="container pb-4 md:hidden" id="mobile-nav">
      <nav className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur">
        {links.map((link) => (
          <NavLink key={link.href} href={link.href} label={link.label} />
        ))}
      </nav>
      {ctaLabel && ctaHref && (
        <Button asChild className="mt-3 w-full">
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      )}
    </div>
  );
}

