'use client';

import React, { useState } from "react";
import type { Parent, Child } from "@/lib/register-types";
import { buildRegistrationPayload, parseApiError } from "@/lib/register-utils";
import { ParentFormSection } from "./parent-form-section";
import { ChildFormSection } from "./child-form-section";

interface RegistrationFormProps {
  onSubmit?: () => void;
}

export function RegistrationForm({ onSubmit }: RegistrationFormProps): React.JSX.Element {
  const [parents, setParents] = useState<Parent[]>([{ name: "", email: "", phone: "" }]);
  const [children, setChildren] = useState<Child[]>([{ full_name: "", availability: [] }]);
  const [notes, setNotes] = useState("");
  const [marketing_opt_in, setOptIn] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<string | null>(null);

  function updateChild(i: number, patch: Partial<Child>): void {
    setChildren((prev) => prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  }

  function addChild(): void {
    if (children.length >= 3) return;
    setChildren((prev) => [...prev, { full_name: "", availability: [] }]);
  }

  function removeChild(i: number): void {
    setChildren((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateParent(i: number, patch: Partial<Parent>): void {
    setParents((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
    // Clear error field if editing the parent that had an error
    if (errorField && patch.email !== undefined) {
      const fieldName = i === 0 ? "parent1_email" : "parent2_email";
      if (errorField === fieldName) {
        setErrorField(null);
      }
    }
  }

  function addParent(): void {
    if (parents.length >= 2) return;
    setParents((prev) => [...prev, { name: "", email: "", phone: "" }]);
  }

  function removeParent(i: number): void {
    if (parents.length <= 1) return; // Require at least one parent
    // Clear error field if removing the parent that had an error
    const fieldName = i === 0 ? "parent1_email" : "parent2_email";
    if (errorField === fieldName) {
      setErrorField(null);
    }
    setParents((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setStatus("Submitting...");
    setErrorField(null);
    try {
      const payload = buildRegistrationPayload(parents, children, notes, marketing_opt_in);

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body: unknown = await res.json();
      if (!res.ok) {
        const { error, field } = parseApiError(body);
        if (field) {
          setErrorField(field);
        }
        throw new Error(error);
      }
      setStatus("✅ Thanks! Your registration was received.");
      setErrorField(null);
      onSubmit?.();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setStatus("❌ " + errorMessage);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <ParentFormSection
        parents={parents}
        errorField={errorField}
        onUpdate={updateParent}
        onAdd={addParent}
        onRemove={removeParent}
      />

      <ChildFormSection
        children={children}
        onUpdate={updateChild}
        onAdd={addChild}
        onRemove={removeChild}
      />

      <div className="card grid gap-3">
        <label className="label">Notes (optional)</label>
        <textarea
          className="textarea"
          rows={4}
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
          }}
        />
        <label htmlFor="marketing-opt-in" className="text-sm text-white/90 flex items-center gap-2 cursor-pointer">
          <input
            id="marketing-opt-in"
            type="checkbox"
            checked={marketing_opt_in}
            onChange={(e) => {
              setOptIn(e.target.checked);
            }}
          />
          I agree to receive updates about the club.
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className="button">
          Submit Registration
        </button>
        {status && <span className="text-sm text-white/90">{status}</span>}
      </div>
    </form>
  );
}

