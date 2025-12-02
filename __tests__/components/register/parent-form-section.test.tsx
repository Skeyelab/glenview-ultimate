import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { beforeEach, vi } from 'vitest';
import { ParentFormSection } from '@/components/register/parent-form-section';
import type { Parent } from '@/lib/register-types';
import { sampleParent1, sampleParent2 } from '@/__tests__/fixtures/registration';

// Mock ParentFormFields
vi.mock('@/components/register/parent-form-fields', () => ({
  ParentFormFields: ({ parent, index, errorField, onUpdate, onRemove }: {
    parent: Parent;
    index: number;
    errorField: string | null;
    onUpdate: (index: number, patch: Partial<Parent>) => void;
    onRemove?: () => void;
  }) => (
    <div data-testid={`parent-form-${index}`} data-error-field={errorField || ''}>
      <span>{parent.name}</span>
      {onRemove && (
        <button onClick={onRemove} data-testid={`remove-${index}`}>
          Remove
        </button>
      )}
    </div>
  ),
}));

describe('ParentFormSection', () => {
  const mockUpdate = vi.fn();
  const mockAdd = vi.fn();
  const mockRemove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders section title', () => {
    render(
      <ParentFormSection
        parents={[sampleParent1]}
        errorField={null}
        onUpdate={mockUpdate}
        onAdd={mockAdd}
        onRemove={mockRemove}
      />,
    );
    expect(screen.getByRole('heading', { level: 2, name: /Parents \/ Guardians/i })).toBeInTheDocument();
  });

  it('renders all parents', () => {
    render(
      <ParentFormSection
        parents={[sampleParent1, sampleParent2]}
        errorField={null}
        onUpdate={mockUpdate}
        onAdd={mockAdd}
        onRemove={mockRemove}
      />,
    );
    expect(screen.getByTestId('parent-form-0')).toBeInTheDocument();
    expect(screen.getByTestId('parent-form-1')).toBeInTheDocument();
  });

  it('passes errorField to ParentFormFields', () => {
    render(
      <ParentFormSection
        parents={[sampleParent1]}
        errorField="parent1_email"
        onUpdate={mockUpdate}
        onAdd={mockAdd}
        onRemove={mockRemove}
      />,
    );
    const form = screen.getByTestId('parent-form-0');
    expect(form).toHaveAttribute('data-error-field', 'parent1_email');
  });

  it('passes null errorField when not provided', () => {
    render(
      <ParentFormSection
        parents={[sampleParent1]}
        errorField={null}
        onUpdate={mockUpdate}
        onAdd={mockAdd}
        onRemove={mockRemove}
      />,
    );
    const form = screen.getByTestId('parent-form-0');
    expect(form).toHaveAttribute('data-error-field', '');
  });

  it('shows add button when parents count is less than 2', () => {
    render(
      <ParentFormSection
        parents={[sampleParent1]}
        errorField={null}
        onUpdate={mockUpdate}
        onAdd={mockAdd}
        onRemove={mockRemove}
      />,
    );
    const addButton = screen.getByRole('button', { name: /Add second parent/i });
    expect(addButton).toBeInTheDocument();
  });

  it('hides add button when parents count is 2', () => {
    render(
      <ParentFormSection
        parents={[sampleParent1, sampleParent2]}
        errorField={null}
        onUpdate={mockUpdate}
        onAdd={mockAdd}
        onRemove={mockRemove}
      />,
    );
    expect(screen.queryByRole('button', { name: /Add second parent/i })).not.toBeInTheDocument();
  });

  it('calls onAdd when add button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ParentFormSection
        parents={[sampleParent1]}
        errorField={null}
        onUpdate={mockUpdate}
        onAdd={mockAdd}
        onRemove={mockRemove}
      />,
    );
    const addButton = screen.getByRole('button', { name: /Add second parent/i });
    await user.click(addButton);
    expect(mockAdd).toHaveBeenCalledTimes(1);
  });

  it('passes onRemove to ParentFormFields when parents.length > 1', () => {
    render(
      <ParentFormSection
        parents={[sampleParent1, sampleParent2]}
        errorField={null}
        onUpdate={mockUpdate}
        onAdd={mockAdd}
        onRemove={mockRemove}
      />,
    );
    expect(screen.getByTestId('remove-0')).toBeInTheDocument();
    expect(screen.getByTestId('remove-1')).toBeInTheDocument();
  });

  it('does not pass onRemove when parents.length is 1', () => {
    render(
      <ParentFormSection
        parents={[sampleParent1]}
        errorField={null}
        onUpdate={mockUpdate}
        onAdd={mockAdd}
        onRemove={mockRemove}
      />,
    );
    expect(screen.queryByTestId('remove-0')).not.toBeInTheDocument();
  });

  it('calls onRemove with correct index when remove is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ParentFormSection
        parents={[sampleParent1, sampleParent2]}
        errorField={null}
        onUpdate={mockUpdate}
        onAdd={mockAdd}
        onRemove={mockRemove}
      />,
    );
    const removeButton = screen.getByTestId('remove-1');
    await user.click(removeButton);
    expect(mockRemove).toHaveBeenCalledWith(1);
  });

  it('handles empty parents array', () => {
    render(
      <ParentFormSection
        parents={[]}
        errorField={null}
        onUpdate={mockUpdate}
        onAdd={mockAdd}
        onRemove={mockRemove}
      />,
    );
    expect(screen.getByRole('heading', { level: 2, name: /Parents \/ Guardians/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add second parent/i })).toBeInTheDocument();
  });
});


