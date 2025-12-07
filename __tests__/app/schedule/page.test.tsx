import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { beforeEach, afterEach, vi } from "vitest";
import SchedulePage from "@/app/schedule/page";
import * as directus from "@/lib/directus";
import { mockSchedule } from "@/__tests__/fixtures/schedule";

vi.mock("@/lib/directus", () => ({
  getSchedule: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

describe("SchedulePage (integration)", () => {
  const directusMock = vi.mocked(directus);

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T00:00:00Z"));
    vi.clearAllMocks();
    directusMock.getSchedule.mockResolvedValue(mockSchedule);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders schedule header, upcoming events, highlights, timeline, and calendar with real components", async () => {
    const page = await SchedulePage();
    render(page);

    expect(screen.getByRole("heading", { level: 1, name: /spring 2026 season/i })).toBeInTheDocument();
    expect(screen.getByText(/Season runs from/i)).toBeInTheDocument();
    expect(screen.getByText("Highlight 1")).toBeInTheDocument();
    expect(screen.getByText("Highlight 2")).toBeInTheDocument();
    expect(screen.getAllByText("Championship Game").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Practice Session").length).toBeGreaterThan(0);
    expect(screen.getByText(/Season Calendar/)).toBeInTheDocument();
  });
});
