'use client';
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { DesktopNav } from "./desktop-nav";
import { MobileMenuButton } from "./mobile-menu-button";
import { MobileMenu } from "./mobile-menu";
import type { NavLinkItem } from "./nav-links";

interface NavbarProps {
  links: readonly NavLinkItem[];
}

export function Navbar({ links }: NavbarProps): React.JSX.Element {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="border-b border-white/10 md:border-none">
      <div className="container py-4 flex items-center justify-between gap-3 md:gap-4">
        <Logo />
        <DesktopNav links={links} />
        <div className="hidden md:block">
          <Button asChild>
            <Link href="/register">Register</Link>
          </Button>
        </div>
        <MobileMenuButton isOpen={menuOpen} onClick={() => setMenuOpen((prev) => !prev)} />
      </div>
      <MobileMenu links={links} isOpen={menuOpen} />
    </div>
  );
}

