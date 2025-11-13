import React from "react";
import Image from "next/image";
import { getAbout, getTeam, getDirectusAssetUrl, type TeamMember } from "@/lib/directus";

export const revalidate = 300;

function normalizeRole(role: string): string {
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

function getRoleDisplayTitle(role: string): string {
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

interface TeamMemberCardProps {
  member: TeamMember;
}

function TeamMemberCard({ member }: TeamMemberCardProps): React.JSX.Element {
  const photoUrl = getDirectusAssetUrl(member.photo);
  const roleTitle = getRoleDisplayTitle(member.role);
  const normalizedRole = normalizeRole(member.role);
  const isHeadCoach = normalizedRole === "head_coach";

  return (
    <div className={`card ${isHeadCoach ? "md:col-span-2" : ""}`}>
      <div className="mb-4 h-48 w-full rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={member.name}
            width={192}
            height={192}
            className="h-full w-full object-cover"
          />
        ) : (
          <p className="text-white/60 text-sm">Photo coming soon</p>
        )}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{roleTitle}</h3>
      <p className="text-white font-medium mb-1">{member.name}</p>
      {member.email && (
        <p className="text-white/90 mb-3">
          <a href={`mailto:${member.email}`} className="text-white hover:underline">
            {member.email}
          </a>
        </p>
      )}
      {member.bio && (
        <p className="text-white/90">{member.bio}</p>
      )}
    </div>
  );
}

export default async function AboutPage(): Promise<React.JSX.Element> {
  const [about, teamMembers] = await Promise.all([
    getAbout(),
    getTeam(),
  ]);

  // Prioritize Directus data - only use fallbacks in development if data is missing
  const clubDescription = about?.club_description ?? (process.env.NODE_ENV === "development"
    ? "The Glenview Ultimate Frisbee Club is a community based & parent run youth sports program in Glenview Illinois. Started in 2026 by Colin Carrigan, his sister, and his father. We teach the basics of Ultimate Frisbee with a heavy emphasis on 'Spirit of The Game'."
    : null);

  const whatKidsLearn = about?.what_kids_learn ?? (process.env.NODE_ENV === "development"
    ? [
        "Rules of Ultimate",
        "Proper way to throw a backhand & forehand",
        "How to run multiple types of offense & defense",
      ]
    : []);

  const leadershipRoles = ["boys_team_captain", "girls_team_captain", "head_coach"];
  const allLeadershipMembers = teamMembers.filter(member => {
    const normalizedRole = normalizeRole(member.role);
    return leadershipRoles.includes(normalizedRole);
  });

  // Separate captains and coach
  const captains = allLeadershipMembers.filter(member => {
    const normalizedRole = normalizeRole(member.role);
    return normalizedRole === "boys_team_captain" || normalizedRole === "girls_team_captain";
  }).sort((a, b) => {
    const order = ["boys_team_captain", "girls_team_captain"];
    const normalizedA = normalizeRole(a.role);
    const normalizedB = normalizeRole(b.role);
    return order.indexOf(normalizedA) - order.indexOf(normalizedB);
  });

  const coach = allLeadershipMembers.find(member => {
    const normalizedRole = normalizeRole(member.role);
    return normalizedRole === "head_coach";
  });


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">About Glenview Ultimate</h1>
      {clubDescription ? (
        <p className="text-white/90">
          {clubDescription}
        </p>
      ) : (
        <p className="text-white/60 italic">Club description coming soon.</p>
      )}

      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-white">What Kids Learn</h2>
        {whatKidsLearn.length > 0 ? (
          <ul className="list-disc list-inside space-y-2 text-white/90">
            {whatKidsLearn.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-white/60 italic">Information about what kids learn coming soon.</p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Team Leadership</h2>
        {captains.length > 0 || coach ? (
          <div className="space-y-4">
            {/* Captains side by side */}
            {captains.length > 0 && (
              <div className="grid-2">
                {captains.map((member) => (
                  <TeamMemberCard key={member.id} member={member} />
                ))}
              </div>
            )}
            {/* Coach below, spanning full width */}
            {coach && (
              <div className="grid-2">
                <TeamMemberCard key={coach.id} member={coach} />
              </div>
            )}
          </div>
        ) : (
          <div className="card md:col-span-2">
            <p className="text-white/90">Team leadership information coming soon.</p>
          </div>
        )}
      </section>
    </div>
  );
}
