import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ChildFormFields } from "@/components/register/child-form-fields";

describe("ChildFormFields", () => {
  it("updates full name, age, experience, and availability", () => {
    const onUpdate = jest.fn();
    render(
      <ChildFormFields
        child={{ full_name: "", availability: [] }}
        index={0}
        onUpdate={onUpdate}
        canRemove={false}
      />,
    );
    const textboxes = screen.getAllByRole("textbox");
    fireEvent.change(textboxes[0], { target: { value: "Kid" } });
    expect(onUpdate).toHaveBeenCalledWith(0, { full_name: "Kid" });
    fireEvent.change(textboxes[1], { target: { value: "11" } });
    expect(onUpdate).toHaveBeenCalledWith(0, { age: "11" });
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "beginner" } });
    expect(onUpdate).toHaveBeenCalledWith(0, { experience: "beginner" });
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    expect(onUpdate).toHaveBeenCalledWith(0, expect.objectContaining({ availability: expect.any(Array) }));
  });
});


