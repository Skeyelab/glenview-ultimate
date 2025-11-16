import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LeadershipSection } from "@/components/home/leadership-section";

describe("LeadershipSection", () => {
  it("renders default title and empty message when no people", () => {
    render(<LeadershipSection people={[]} />);
    expect(screen.getByRole("heading", { name: /Leadership/i })).toBeInTheDocument();
    expect(screen.getByText(/Captains & coach bios coming soon\./i)).toBeInTheDocument();
  });

  it("renders people list with name, role and email when provided", () => {
    render(
      <LeadershipSection
        people={[
          { id: 1, name: "Alice", role: "Coach", email: "a@example.com" } as any,
          { id: 2, name: "Bob", role: "Captain", email: null } as any,
        ]}
      />,
    );
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Coach")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "a@example.com" })).toHaveAttribute("href", "mailto:a@example.com");
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Captain")).toBeInTheDocument();
  });
});


