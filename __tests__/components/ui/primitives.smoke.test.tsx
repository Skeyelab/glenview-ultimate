import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

describe("UI primitives (smoke)", () => {
  it("renders core primitives and forwards refs", () => {
    const buttonRef = React.createRef<HTMLButtonElement>();
    const inputRef = React.createRef<HTMLInputElement>();
    const textareaRef = React.createRef<HTMLTextAreaElement>();

    render(
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" aria-label="Name" ref={inputRef} />
        <Textarea aria-label="Notes" ref={textareaRef} />
        <Button ref={buttonRef}>Submit</Button>
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
          <CardContent>Card Body</CardContent>
        </Card>
      </div>,
    );

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Notes")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByText("Card Title")).toBeInTheDocument();
    expect(screen.getByText("Card Body")).toBeInTheDocument();

    expect(buttonRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
    expect(textareaRef.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});

