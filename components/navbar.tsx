'use client';
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LOGO_ID } from "@/lib/config";
import { getDirectusAssetUrl } from "@/lib/directus";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/what-is-ultimate", label: "What is Ultimate?" },
  { href: "/news", label: "News" },
  { href: "/schedule", label: "Schedule" },
];

export function Navbar(): React.JSX.Element {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  const logoUrl = directusUrl ? getDirectusAssetUrl(LOGO_ID) : null;

  React.useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="border-b border-white/10 md:border-none">
      <div className="container py-4 flex items-center justify-between gap-3 md:gap-4">
        <Link href="/" className="flex items-center gap-3">
          {logoUrl && (
            <Image
              src={logoUrl}
              alt="Glenview Ultimate"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
          )}
          <span className="font-semibold text-lg text-white">Glenview Ultimate</span>
        </Link>
        <nav className="hidden md:flex gap-4 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "px-2 py-1 rounded-md text-white/80 hover:text-white transition-colors",
                pathname === l.href && "bg-white/20 text-white"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <Button asChild>
            <Link href="/register">Register</Link>
          </Button>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-white/30 p-2 text-white hover:bg-white/10 focus:outline-none focus-visible:ring focus-visible:ring-white/50 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => {
            setMenuOpen((prev) => !prev);
          }}
        >
          <span className="sr-only">Toggle navigation</span>
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            role="img"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div className="container pb-4 md:hidden" id="mobile-nav">
          <nav className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "px-2 py-1 rounded-md text-white/80 hover:text-white transition-colors",
                  pathname === l.href && "bg-white/20 text-white"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Button asChild className="mt-3 w-full">
            <Link href="/register">Register</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
