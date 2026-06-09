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
        "relative px-1 py-1 text-white/70 hover:text-white transition-colors duration-150",
        "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:rounded-full after:bg-white after:transition-opacity after:duration-150",
        isActive ? "text-white after:opacity-100" : "after:opacity-0 hover:after:opacity-30",
        className
      )}
    >
      {label}
    </Link>
  );
}

