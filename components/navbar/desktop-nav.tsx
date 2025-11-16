'use client';
import { NavLink } from "./nav-link";
import type { NavLinkItem } from "./nav-links";

interface DesktopNavProps {
  links: readonly NavLinkItem[];
}

export function DesktopNav({ links }: DesktopNavProps): React.JSX.Element {
  return (
    <nav className="hidden md:flex gap-4 text-sm">
      {links.map((link) => (
        <NavLink key={link.href} href={link.href} label={link.label} />
      ))}
    </nav>
  );
}

