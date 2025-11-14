'use client';

import React from "react";
import type { Child } from "@/lib/register-types";
import { ChildFormFields } from "./child-form-fields";

interface ChildFormSectionProps {
  children: Child[];
  onUpdate: (index: number, patch: Partial<Child>) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function ChildFormSection({
  children,
  onUpdate,
  onAdd,
  onRemove,
}: ChildFormSectionProps): React.JSX.Element {
  return (
    <div className="card grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Kids</h2>
        {children.length < 3 && (
          <button type="button" className="button secondary" onClick={onAdd}>
            + Add a child
          </button>
        )}
      </div>
      {children.map((child, i) => (
        <ChildFormFields
          key={i}
          child={child}
          index={i}
          onUpdate={onUpdate}
          onRemove={children.length > 1 ? () => onRemove(i) : undefined}
          canRemove={children.length > 1}
        />
      ))}
    </div>
  );
}

