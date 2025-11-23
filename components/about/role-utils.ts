export function normalizeRole(role: string, squad?: string | null): string {
  // Handle "captain" role with squad field
  if (role === "captain" || role === "Captain") {
    if (squad === "boys") return "boys_team_captain";
    if (squad === "girls") return "girls_team_captain";
    // Fallback if squad is missing - try to infer from role display text
    return role;
  }

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

export function getRoleDisplayTitle(role: string, squad?: string | null): string {
  const normalized = normalizeRole(role, squad);
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

export function isLeadershipRole(role: string, squad?: string | null): role is LeadershipRole {
  return LEADERSHIP_ROLES.includes(normalizeRole(role, squad) as LeadershipRole);
}
