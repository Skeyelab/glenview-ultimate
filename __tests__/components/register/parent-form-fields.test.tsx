import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ParentFormFields } from "@/components/register/parent-form-fields";
import { parentA } from "../../../tests/fixtures/registration";

describe("ParentFormFields", () => {
  it("renders fields and calls onUpdate on input changes", () => {
    const onUpdate = jest.fn();
    render(
      <ParentFormFields
        parent={{ ...parentA }}
        index={0}
        errorField={null}
        onUpdate={onUpdate}
        canRemove={false}
      />,
    );
    const textboxes = screen.getAllByRole("textbox");
    fireEvent.change(textboxes[0], { target: { value: "New Name" } });
    expect(onUpdate).toHaveBeenCalledWith(0, { name: "New Name" });
    fireEvent.change(textboxes[1], { target: { value: "new@example.com" } });
    expect(onUpdate).toHaveBeenCalledWith(0, { email: "new@example.com" });
    fireEvent.change(textboxes[2], { target: { value: "999-9999" } });
    expect(onUpdate).toHaveBeenCalledWith(0, { phone: "999-9999" });
  });

  it("applies error styling when errorField matches", () => {
    const { rerender } = render(
      <ParentFormFields
        parent={{ ...parentA }}
        index={0}
        errorField={"parent1_email"}
        onUpdate={jest.fn()}
        canRemove={false}
      />,
    );
    expect(screen.getAllByRole("textbox")[1].className).toMatch(/border-red-500/);
    rerender(
      <ParentFormFields
        parent={{ ...parentA }}
        index={1}
        errorField={"parent2_email"}
        onUpdate={jest.fn()}
        canRemove={false}
      />,
    );
    expect(screen.getAllByRole("textbox")[1].className).toMatch(/border-red-500/);
  });
});


