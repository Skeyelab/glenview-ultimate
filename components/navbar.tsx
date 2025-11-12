'use client';
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/news", label: "News" },
];

const LOGO_ID = "c3db7679-c7b9-4d7d-add9-761a96e59b86";

export function Navbar() {
  const pathname = usePathname();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
    if (directusUrl) {
      setLogoUrl(`${directusUrl}/assets/${LOGO_ID}`);
    }
  }, []);

  return (
    <div className="container py-4 flex items-center justify-between">
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
      <nav className="flex gap-4 text-sm">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={cn("px-2 py-1 rounded-md text-white/80 hover:text-white transition-colors", pathname === l.href && "bg-white/20 text-white")}>
            {l.label}
          </Link>
        ))}
      </nav>
      <Button asChild><Link href="/register">Register</Link></Button>
    </div>
  );
}
