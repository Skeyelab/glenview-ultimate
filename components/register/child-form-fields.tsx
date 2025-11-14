'use client';

import React from "react";
import type { Child } from "@/lib/register-types";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

interface ChildFormFieldsProps {
  child: Child;
  index: number;
  onUpdate: (index: number, patch: Partial<Child>) => void;
  onRemove?: () => void;
  canRemove: boolean;
}

export function ChildFormFields({
  child,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: ChildFormFieldsProps): React.JSX.Element {
  return (
    <div className="border border-white/20 rounded p-3 grid gap-3">
      <div className="grid-2">
        <div>
          <label className="label">Child Full Name</label>
          <input
            className="input"
            value={child.full_name}
            onChange={(e) => {
              onUpdate(index, { full_name: e.target.value });
            }}
            required
          />
        </div>
        <div>
          <label className="label">Age</label>
          <input
            className="input"
            value={child.age ?? ""}
            onChange={(e) => {
              onUpdate(index, { age: e.target.value });
            }}
          />
        </div>
      </div>
      <div className="grid-2">
        <div>
          <label className="label">Experience</label>
          <select
            className="select"
            value={child.experience ?? ""}
            onChange={(e) => {
              const { value } = e.target;
              onUpdate(index, {
                experience:
                  value === "beginner" || value === "intermediate" || value === "advanced"
                    ? value
                    : undefined,
              });
            }}
          >
            <option value="">Select…</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label className="label">Availability (check all that apply)</label>
          <div className="flex gap-3 flex-wrap">
            {WEEK_DAYS.map((day) => (
              <label key={day} className="text-sm text-white/90">
                <input
                  type="checkbox"
                  checked={child.availability?.includes(day) ?? false}
                  onChange={(e) => {
                    const current = new Set(child.availability ?? []);
                    if (e.target.checked) current.add(day);
                    else current.delete(day);
                    onUpdate(index, { availability: Array.from(current) });
                  }}
                />{" "}
                {day}
              </label>
            ))}
          </div>
        </div>
      </div>
      {canRemove && onRemove && (
        <button type="button" className="button secondary" onClick={onRemove}>
          Remove
        </button>
      )}
    </div>
  );
}

