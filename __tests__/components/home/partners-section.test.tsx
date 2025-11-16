import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PartnersSection } from "@/components/home/partners-section";

describe("PartnersSection", () => {
  it("renders title and defaults when no partners provided", () => {
    render(<PartnersSection partners={[]} />);
    expect(screen.getByRole("heading", { name: /Partners/i })).toBeInTheDocument();
    // Default list contains USA Ultimate
    expect(screen.getByRole("link", { name: /USA Ultimate/i })).toBeInTheDocument();
  });

  it("renders provided partners when present", () => {
    render(
      <PartnersSection
        partners={[
          { id: 1, name: "Foo", url: "https://foo.example.com" } as any,
          { id: 2, name: "Bar", url: "https://bar.example.com" } as any,
        ]}
      />,
    );
    const linkFoo = screen.getByRole("link", { name: "Foo" });
    const linkBar = screen.getByRole("link", { name: "Bar" });
    expect(linkFoo).toHaveAttribute("href", "https://foo.example.com");
    expect(linkBar).toHaveAttribute("href", "https://bar.example.com");
  });
});


