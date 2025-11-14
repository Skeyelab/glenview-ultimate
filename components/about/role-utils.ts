export function normalizeRole(role: string): string {
  // Handle both display text and value formats
  const roleMap: Record<string, string> = {
    "boys_team_captain": "boys_team_captain",
    "Boys Team Captain": "boys_team_captain",
    "girls_team_captain": "girls_team_captain",
    "Girls Team Captain": "girls_team_captain",
    "head_coach": "head_coach",
    "Head Coach": "head_coach",
  };
  return roleMap[role] ?? role;
}

export function getRoleDisplayTitle(role: string): string {
  const normalized = normalizeRole(role);
  switch (normalized) {
    case "boys_team_captain":
      return "Boys Team Captain";
    case "girls_team_captain":
      return "Girls Team Captain";
    case "head_coach":
      return "Head Coach";
    default:
      return role;
  }
}

export const LEADERSHIP_ROLES = ["boys_team_captain", "girls_team_captain", "head_coach"] as const;

export type LeadershipRole = (typeof LEADERSHIP_ROLES)[number];

export function isLeadershipRole(role: string): role is LeadershipRole {
  return LEADERSHIP_ROLES.includes(normalizeRole(role) as LeadershipRole);
}
