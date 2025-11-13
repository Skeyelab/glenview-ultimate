import React from "react";
import { getSchedule } from "@/lib/directus";

export const revalidate = 300;

export default async function SchedulePage(): Promise<React.JSX.Element> {
  const schedule = await getSchedule();

  // Default schedule if no data from Directus
  const defaultSchedule = {
    year: 2026,
    title: "2026 Season Schedule",
    start_month: "March",
    end_month: "May",
    highlights: [
      "November 2025 - Pre-Registration Opens",
      "January 2026 - Park District assigns fields. Practice time & location to be announced",
      "February 2026 - Final Registration & uniform orders due",
      "March, April, May - Spring Season:",
      "  • Practice once a week for 12 weeks",
      "  • Time & Location TBD",
      "  • Skills, drills, and scrimmages",
      "  • Opportunity to attend 3-4 tournaments"
    ]
  };

  const displaySchedule = schedule ?? defaultSchedule;
  const highlights = displaySchedule.highlights ?? defaultSchedule.highlights;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">
        {displaySchedule.title ?? `${displaySchedule.year} Season Schedule`}
      </h1>
      
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-white">Timeline</h2>
        <div className="space-y-3">
          {highlights.map((item, index) => (
            <div key={index} className="border-l-2 border-white/30 pl-4 py-1">
              <p className="text-white/90">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {displaySchedule.start_month && displaySchedule.end_month && (
        <div className="notice">
          <p className="text-white/90 text-center">
            Season runs from <strong>{displaySchedule.start_month}</strong> to <strong>{displaySchedule.end_month}</strong> {displaySchedule.year}
          </p>
        </div>
      )}
    </div>
  );
}
