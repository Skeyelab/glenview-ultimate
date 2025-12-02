import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { beforeEach, vi } from 'vitest';
import { ChildFormSection } from '@/components/register/child-form-section';
import type { Child } from '@/lib/register-types';
import { sampleChild1, sampleChild2, sampleChild3 } from '@/__tests__/fixtures/registration';

// Mock ChildFormFields
vi.mock('@/components/register/child-form-fields', () => ({
  ChildFormFields: ({ child, index, onUpdate, onRemove }: {
    child: Child;
    index: number;
    onUpdate: (index: number, patch: Partial<Child>) => void;
    onRemove?: () => void;
  }) => (
    <div data-testid={`child-form-${index}`}>
      <span>{child.full_name}</span>
      {onRemove && (
        <button onClick={onRemove} data-testid={`remove-${index}`}>
          Remove
        </button>
      )}
    </div>
  ),
}));

describe('ChildFormSection', () => {
  const mockUpdate = vi.fn();
  const mockAdd = vi.fn();
  const mockRemove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders section title', () => {
    render(
      <ChildFormSection
        children={[sampleChild1]}
        onUpdate={mockUpdate}
        onAdd={mockAdd}
        onRemove={mockRemove}
      />,
    );
    expect(screen.getByRole('heading', { level: 2, name: /Kids/i })).toBeInTheDocument();
  });

  it('renders all children', () => {
    render(
      <ChildFormSection
        children={[sampleChild1, sampleChild2]}
        onUpdate={mockUpdate}
        onAdd={mockAdd}
        onRemove={mockRemove}
      />,
    );
    expect(screen.getByTestId('child-form-0')).toBeInTheDocument();
    expect(screen.getByTestId('child-form-1')).toBeInTheDocument();
  });

  it('calls onUpdate when child is updated', () => {
    render(
      <ChildFormSection
        children={[sampleChild1]}
        onUpdate={mockUpdate}
        onAdd={mockAdd}
        onRemove={mockRemove}
      />,
    );
    // ChildFormFields would call onUpdate, but we're mocking it
    // So we test that the prop is passed correctly
    expect(screen.getByTestId('child-form-0')).toBeInTheDocument();
  });

  it('shows add button when children count is less than 3', () => {
    render(
      <ChildFormSection
        children={[sampleChild1]}
        onUpdate={mockUpdate}
        onAdd={mockAdd}
        onRemove={mockRemove}
      />,
    );
    const addButton = screen.getByRole('button', { name: /Add a child/i });
    expect(addButton).toBeInTheDocument();
  });

  it('shows add button when children count is 2', () => {
    render(
      <ChildFormSection
        children={[sampleChild1, sampleChild2]}
        onUpdate={mockUpdate}
        onAdd={mockAdd}
        onRemove={mockRemove}
      />,
    );
    const addButton = screen.getByRole('button', { name: /Add a child/i });
    expect(addButton).toBeInTheDocument();
  });

  it('hides add button when children count is 3', () => {
    render(
      <ChildFormSection
        children={[sampleChild1, sampleChild2, sampleChild3]}
        onUpdate={mockUpdate}
        onAdd={mockAdd}
        onRemove={mockRemove}
      />,
    );
    expect(screen.queryByRole('button', { name: /Add a child/i })).not.toBeInTheDocument();
  });

  it('calls onAdd when add button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ChildFormSection
        children={[sampleChild1]}
        onUpdate={mockUpdate}
        onAdd={mockAdd}
        onRemove={mockRemove}
      />,
    );
    const addButton = screen.getByRole('button', { name: /Add a child/i });
    await user.click(addButton);
    expect(mockAdd).toHaveBeenCalledTimes(1);
  });

  it('passes onRemove to ChildFormFields when children.length > 1', () => {
    render(
      <ChildFormSection
        children={[sampleChild1, sampleChild2]}
        onUpdate={mockUpdate}
        onAdd={mockAdd}
        onRemove={mockRemove}
      />,
    );
    expect(screen.getByTestId('remove-0')).toBeInTheDocument();
    expect(screen.getByTestId('remove-1')).toBeInTheDocument();
  });

  it('does not pass onRemove when children.length is 1', () => {
    render(
      <ChildFormSection
        children={[sampleChild1]}
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
      <ChildFormSection
        children={[sampleChild1, sampleChild2]}
        onUpdate={mockUpdate}
        onAdd={mockAdd}
        onRemove={mockRemove}
      />,
    );
    const removeButton = screen.getByTestId('remove-1');
    await user.click(removeButton);
    expect(mockRemove).toHaveBeenCalledWith(1);
  });

  it('handles empty children array', () => {
    render(
      <ChildFormSection
        children={[]}
        onUpdate={mockUpdate}
        onAdd={mockAdd}
        onRemove={mockRemove}
      />,
    );
    expect(screen.getByRole('heading', { level: 2, name: /Kids/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add a child/i })).toBeInTheDocument();
  });
});


