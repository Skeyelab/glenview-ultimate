'use client';

import React from "react";
import type { Parent } from "@/lib/register-types";

interface ParentFormFieldsProps {
  parent: Parent;
  index: number;
  errorField: string | null;
  onUpdate: (index: number, patch: Partial<Parent>) => void;
  onRemove?: () => void;
  canRemove: boolean;
}

export function ParentFormFields({
  parent,
  index,
  errorField,
  onUpdate,
  onRemove,
  canRemove,
}: ParentFormFieldsProps): React.JSX.Element {
  const fieldName = index === 0 ? "parent1_email" : "parent2_email";
  const hasError = errorField === fieldName;

  return (
    <div className="rounded-lg border border-white/15 bg-white/5 p-4 grid gap-3">
      <div className="grid-2">
        <div>
          <label className="label">Full Name</label>
          <input
            className="input"
            value={parent.name}
            onChange={(e) => {
              onUpdate(index, { name: e.target.value });
            }}
            required
          />
        </div>
        <div>
          <label className="label">Email</label>
          <input
            className={`input ${hasError ? "border-red-500" : ""}`}
            type="email"
            value={parent.email}
            onChange={(e) => {
              onUpdate(index, { email: e.target.value });
            }}
            required
          />
        </div>
      </div>
      <div>
        <label className="label">Cell</label>
        <input
          className="input"
          value={parent.phone}
          onChange={(e) => {
            onUpdate(index, { phone: e.target.value });
          }}
        />
      </div>
      {canRemove && onRemove && (
        <button type="button" className="button secondary" onClick={onRemove}>
          Remove
        </button>
      )}
    </div>
  );
}

