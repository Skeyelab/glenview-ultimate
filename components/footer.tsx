import React from "react";
import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/schedule", label: "Schedule" },
  { href: "/what-is-ultimate", label: "What is Ultimate?" },
  { href: "/register", label: "Register" },
];

export function Footer(): React.JSX.Element {
  return (
    <footer className="border-t border-white/20 mt-8">
      <div className="container py-8 space-y-6">
        <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-white/50">
          <div>© {new Date().getFullYear()} Glenview Ultimate</div>
          <div>
            made with love by{" "}
            <a
              href="https://ericdahl.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              ericdahl.dev
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
