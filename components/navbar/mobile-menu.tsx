'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavLink } from "./nav-link";
import type { NavLinkItem } from "./nav-links";

interface MobileMenuProps {
  links: readonly NavLinkItem[];
  isOpen: boolean;
}

export function MobileMenu({ links, isOpen }: MobileMenuProps): React.JSX.Element {
  if (!isOpen) return <></>;

  return (
    <div className="container pb-4 md:hidden" id="mobile-nav">
      <nav className="flex flex-col rounded-lg border border-white/10 bg-white/10 p-2 backdrop-blur">
        {links.map((link) => (
          <NavLink key={link.href} href={link.href} label={link.label} className="py-3 px-3 text-base after:hidden" />
        ))}
      </nav>
      <Button asChild className="mt-3 w-full">
        <Link href="/register">Register</Link>
      </Button>
    </div>
  );
}

