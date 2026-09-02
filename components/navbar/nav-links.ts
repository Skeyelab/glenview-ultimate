export interface NavLinkItem {
  href: string;
  label: string;
}

export const NAV_LINKS: readonly NavLinkItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/what-is-ultimate", label: "What is Ultimate?" },
  { href: "/news", label: "News" },
  { href: "/schedule", label: "Schedule" },
  { href: "/team-photos", label: "Team Photos" },
];

