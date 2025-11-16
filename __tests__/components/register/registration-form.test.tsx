import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RegistrationForm } from "@/components/register/registration-form";
import { parentA, child1, notes as NOTES } from "../../../tests/fixtures/registration";

describe("RegistrationForm", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  function fillParent1() {
    const textboxes = screen.getAllByRole("textbox");
    fireEvent.change(textboxes[0], { target: { value: parentA.name } }); // parent name
    fireEvent.change(textboxes[1], { target: { value: parentA.email } }); // parent email
    fireEvent.change(textboxes[2], { target: { value: parentA.phone } }); // parent phone
  }

  function fillChild1() {
    const textboxes = screen.getAllByRole("textbox");
    fireEvent.change(textboxes[3], { target: { value: child1.full_name } }); // child name
    fireEvent.change(textboxes[4], { target: { value: child1.age } }); // child age
    fireEvent.change(screen.getByRole("combobox"), { target: { value: child1.experience } });
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
  }

  it("submits successfully and shows success message", async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    } as any);
    const fetchSpy = global.fetch as jest.Mock;

    render(<RegistrationForm />);
    fillParent1();
    fillChild1();
    const allTextboxes = screen.getAllByRole("textbox");
    fireEvent.change(allTextboxes[allTextboxes.length - 1], { target: { value: NOTES } });
    fireEvent.click(screen.getByLabelText(/I agree to receive updates/i));
    fireEvent.click(screen.getByRole("button", { name: /Submit Registration/i }));

    await waitFor(() => {
      expect(screen.getByText(/Thanks! Your registration was received/i)).toBeInTheDocument();
    });
    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/register",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "content-type": "application/json" }),
      }),
    );
  });

  it("handles duplicate email error by highlighting field", async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ code: "DUPLICATE_EMAIL", field: "parent1_email" }),
    } as any);

    render(<RegistrationForm />);
    fillParent1();
    fillChild1();
    fireEvent.click(screen.getByRole("button", { name: /Submit Registration/i }));

    await waitFor(() => {
      expect(screen.getByText(/This email address has already been registered/i)).toBeInTheDocument();
    });
    // Parent1 email should have error class
    const email = screen.getAllByRole("textbox")[1];
    expect(email.className).toMatch(/border-red-500/);
  });

  it("handles generic server error gracefully", async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Server exploded" }),
    } as any);

    render(<RegistrationForm />);
    fillParent1();
    fillChild1();
    fireEvent.click(screen.getByRole("button", { name: /Submit Registration/i }));

    await waitFor(() => {
      expect(screen.getByText(/Server exploded/i)).toBeInTheDocument();
    });
  });
});


