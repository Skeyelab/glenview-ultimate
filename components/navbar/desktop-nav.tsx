'use client';
import { NavLink } from "./nav-link";

interface NavLinkData {
  href: string;
  label: string;
}

interface DesktopNavProps {
  links: readonly NavLinkData[];
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

