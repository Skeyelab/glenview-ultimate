'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  label: string;
  className?: string;
}

export function NavLink({ href, label, className }: NavLinkProps): React.JSX.Element {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "px-2 py-1 rounded-md text-white/80 hover:text-white transition-colors",
        isActive && "bg-white/20 text-white",
        className
      )}
    >
      {label}
    </Link>
  );
}

