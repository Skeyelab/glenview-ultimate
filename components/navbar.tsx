'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/news", label: "News" },
  { href: "/register", label: "Register" },
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <div className="container py-4 flex items-center justify-between">
      <Link href="/" className="font-semibold text-lg">Glenview Ultimate</Link>
      <nav className="flex gap-4 text-sm">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={cn("px-2 py-1 rounded-md", pathname === l.href && "bg-slate-100")}>
            {l.label}
          </Link>
        ))}
      </nav>
      <Button asChild><Link href="/register">Pre-Register</Link></Button>
    </div>
  );
}
