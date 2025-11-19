'use client';

import React, { useState } from "react";
import type { Parent, Child } from "@/lib/register-types";
import { buildRegistrationPayload, parseApiError } from "@/lib/register-utils";
import { ParentFormSection } from "./parent-form-section";
import { ChildFormSection } from "./child-form-section";
import { TurnstileField, type TurnstileFieldHandle } from "./turnstile-field";

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
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileStatusMessage, setTurnstileStatusMessage] = useState<string | null>(null);
  const turnstileRef = React.useRef<TurnstileFieldHandle | null>(null);

  const trackEvent = React.useCallback((eventName: string, data?: Record<string, unknown>): void => {
    if (typeof window === "undefined") return;
    const track = window.umami?.track;
    if (typeof track === "function") {
      track(eventName, data);
    }
  }, []);

  function updateChild(i: number, patch: Partial<Child>): void {
    setChildren((prev) => prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  }

  function addChild(): void {
    if (children.length >= 3) return;
    setChildren((prev) => [...prev, { full_name: "", availability: [] }]);
    trackEvent("registration_add_child", {
      childCount: children.length + 1,
    });
  }

  function removeChild(i: number): void {
    setChildren((prev) => prev.filter((_, idx) => idx !== i));
    trackEvent("registration_remove_child", {
      removedIndex: i,
      childCount: Math.max(children.length - 1, 0),
    });
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
    trackEvent("registration_add_parent", {
      parentCount: parents.length + 1,
    });
  }

  function removeParent(i: number): void {
    if (parents.length <= 1) return; // Require at least one parent
    // Clear error field if removing the parent that had an error
    const fieldName = i === 0 ? "parent1_email" : "parent2_email";
    if (errorField === fieldName) {
      setErrorField(null);
    }
    setParents((prev) => prev.filter((_, idx) => idx !== i));
    trackEvent("registration_remove_parent", {
      removedIndex: i,
      parentCount: Math.max(parents.length - 1, 0),
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setErrorField(null);
    if (!turnstileToken) {
      const missingMessage = "Please complete the verification challenge.";
      setStatus("❌ " + missingMessage);
      setTurnstileStatusMessage(missingMessage);
      trackEvent("registration_form_submit_error", {
        message: missingMessage,
        field: undefined,
        turnstileTokenPresent: false,
      });
      return;
    }
    setTurnstileStatusMessage(null);
    setStatus("Submitting...");
    trackEvent("registration_form_submit", {
      parentCount: parents.length,
      childCount: children.length,
      marketingOptIn: marketing_opt_in,
      turnstileTokenPresent: Boolean(turnstileToken),
    });
    try {
      const payload = buildRegistrationPayload(parents, children, notes, marketing_opt_in, turnstileToken);

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
          trackEvent("registration_form_validation_error", { field, turnstileTokenPresent: Boolean(turnstileToken) });
        }
        trackEvent("registration_form_submit_error", {
          message: error,
          field,
          turnstileTokenPresent: Boolean(turnstileToken),
        });
        throw new Error(error);
      }
      setStatus("✅ Thanks! Your registration was received.");
      setErrorField(null);
      trackEvent("registration_form_submit_success", {
        parentCount: parents.length,
        childCount: children.length,
        marketingOptIn: marketing_opt_in,
        turnstileTokenPresent: Boolean(turnstileToken),
      });
      turnstileRef.current?.reset();
      setTurnstileToken(null);
      onSubmit?.();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setStatus("❌ " + errorMessage);
      trackEvent("registration_form_submit_error", {
        message: errorMessage,
        field: errorField ?? undefined,
        turnstileTokenPresent: Boolean(turnstileToken),
      });
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
              trackEvent("registration_marketing_opt_in", { optedIn: e.target.checked });
            }}
          />
          I agree to receive updates about the club.
        </label>
      </div>

      <TurnstileField
        ref={turnstileRef}
        statusMessage={turnstileStatusMessage}
        onTokenChange={(token) => {
          setTurnstileToken(token);
          if (token) {
            setTurnstileStatusMessage(null);
          }
        }}
      />

      <div className="flex items-center gap-3">
        <button type="submit" className="button">
          Submit Registration
        </button>
        {status && <span className="text-sm text-white/90">{status}</span>}
      </div>
    </form>
  );
}

