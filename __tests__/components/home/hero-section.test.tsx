import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { HeroSection } from "@/components/home/hero-section";
import type { SeasonSchedule } from "@/lib/directus";
import { HERO_TITLE, HERO_CTA_LABEL, HERO_CTA_URL, HERO_PRE_REGISTRATION_TEXT } from "@/lib/constants";

describe("HeroSection", () => {
  const baseSeason: SeasonSchedule = {
    season_year: 2026,
    year: 2026,
    title: "2026 Season Schedule",
    start_month: "March",
    end_month: "May",
    highlights: [],
    events: [],
  };

  it("renders heading, CTA and pre-registration text", () => {
    render(<HeroSection season={null} logoUrl={null} />);
    expect(screen.getByRole("heading", { level: 1, name: HERO_TITLE })).toBeInTheDocument();
    const cta = screen.getByRole("link", { name: HERO_CTA_LABEL });
    expect(cta).toHaveAttribute("href", HERO_CTA_URL);
    expect(screen.getByText(HERO_PRE_REGISTRATION_TEXT)).toBeInTheDocument();
  });

  it("renders season label when season is provided", () => {
    render(<HeroSection season={baseSeason} logoUrl={null} />);
    expect(screen.getByText(/2026 Season Schedule/)).toBeInTheDocument();
    expect(screen.getByText(/\(March–May\)/)).toBeInTheDocument();
  });

  it("renders logo when logoUrl is provided", () => {
    render(<HeroSection season={null} logoUrl="/logo.png" />);
    // Uses Next/Image which renders an img element in tests
    expect(screen.getByAltText("Glenview Ultimate")).toBeInTheDocument();
  });
});


