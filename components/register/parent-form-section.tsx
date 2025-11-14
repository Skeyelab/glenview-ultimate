'use client';

import React from "react";
import type { Parent } from "@/lib/register-types";
import { ParentFormFields } from "./parent-form-fields";

interface ParentFormSectionProps {
  parents: Parent[];
  errorField: string | null;
  onUpdate: (index: number, patch: Partial<Parent>) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function ParentFormSection({
  parents,
  errorField,
  onUpdate,
  onAdd,
  onRemove,
}: ParentFormSectionProps): React.JSX.Element {
  return (
    <div className="card grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Parents / Guardians</h2>
        {parents.length < 2 && (
          <button type="button" className="button secondary" onClick={onAdd}>
            + Add second parent / guardian
          </button>
        )}
      </div>
      {parents.map((parent, i) => (
        <ParentFormFields
          key={i}
          parent={parent}
          index={i}
          errorField={errorField}
          onUpdate={onUpdate}
          onRemove={parents.length > 1 ? () => onRemove(i) : undefined}
          canRemove={parents.length > 1}
        />
      ))}
    </div>
  );
}

