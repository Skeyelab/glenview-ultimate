import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { beforeEach, vi } from 'vitest';
import { ParentFormFields } from '@/components/register/parent-form-fields';
import { sampleParent1 } from '@/__tests__/fixtures/registration';

describe('ParentFormFields', () => {
  const mockUpdate = vi.fn();
  const mockRemove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(
      <ParentFormFields
        parent={sampleParent1}
        index={0}
        errorField={null}
        onUpdate={mockUpdate}
        canRemove={false}
      />
    );
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('555-0100')).toBeInTheDocument();
  });

  it('displays parent data in fields', () => {
    render(
      <ParentFormFields
        parent={sampleParent1}
        index={0}
        errorField={null}
        onUpdate={mockUpdate}
        canRemove={false}
      />
    );
    expect(screen.getByDisplayValue('John Doe')).toHaveValue('John Doe');
    expect(screen.getByDisplayValue('john@example.com')).toHaveValue('john@example.com');
    expect(screen.getByDisplayValue('555-0100')).toHaveValue('555-0100');
  });

  it('calls onUpdate when name field changes', async () => {
    const user = userEvent.setup();
    render(
      <ParentFormFields
        parent={sampleParent1}
        index={0}
        errorField={null}
        onUpdate={mockUpdate}
        canRemove={false}
      />
    );
    const nameInput = screen.getByDisplayValue('John Doe');
    await user.tripleClick(nameInput);
    await user.paste('Jane Doe');
    expect(mockUpdate).toHaveBeenLastCalledWith(0, { name: 'Jane Doe' });
  });

  it('calls onUpdate when email field changes', async () => {
    const user = userEvent.setup();
    render(
      <ParentFormFields
        parent={sampleParent1}
        index={0}
        errorField={null}
        onUpdate={mockUpdate}
        canRemove={false}
      />
    );
    const emailInput = screen.getByDisplayValue('john@example.com');
    await user.tripleClick(emailInput);
    await user.paste('newemail@example.com');
    expect(mockUpdate).toHaveBeenLastCalledWith(0, { email: 'newemail@example.com' });
  });

  it('calls onUpdate when phone field changes', async () => {
    const user = userEvent.setup();
    render(
      <ParentFormFields
        parent={sampleParent1}
        index={0}
        errorField={null}
        onUpdate={mockUpdate}
        canRemove={false}
      />
    );
    const phoneInput = screen.getByDisplayValue('555-0100');
    await user.tripleClick(phoneInput);
    await user.paste('555-9999');
    expect(mockUpdate).toHaveBeenLastCalledWith(0, { phone: '555-9999' });
  });

  it('marks name and email fields as required', () => {
    render(
      <ParentFormFields
        parent={sampleParent1}
        index={0}
        errorField={null}
        onUpdate={mockUpdate}
        canRemove={false}
      />
    );
    const nameInput = screen.getByDisplayValue('John Doe');
    const emailInput = screen.getByDisplayValue('john@example.com');
    const phoneInput = screen.getByDisplayValue('555-0100');
    expect(nameInput).toBeRequired();
    expect(emailInput).toBeRequired();
    expect(phoneInput).not.toBeRequired();
  });

  it('shows error styling when errorField matches parent1_email', () => {
    render(
      <ParentFormFields
        parent={sampleParent1}
        index={0}
        errorField="parent1_email"
        onUpdate={mockUpdate}
        canRemove={false}
      />
    );
    const emailInput = screen.getByDisplayValue('john@example.com');
    expect(emailInput).toHaveClass('border-red-500');
  });

  it('shows error styling when errorField matches parent2_email for index 1', () => {
    render(
      <ParentFormFields
        parent={sampleParent1}
        index={1}
        errorField="parent2_email"
        onUpdate={mockUpdate}
        canRemove={false}
      />
    );
    const emailInput = screen.getByDisplayValue('john@example.com');
    expect(emailInput).toHaveClass('border-red-500');
  });

  it('does not show error styling when errorField does not match', () => {
    render(
      <ParentFormFields
        parent={sampleParent1}
        index={0}
        errorField="parent2_email"
        onUpdate={mockUpdate}
        canRemove={false}
      />
    );
    const emailInput = screen.getByDisplayValue('john@example.com');
    expect(emailInput).not.toHaveClass('border-red-500');
  });

  it('renders remove button when canRemove is true and onRemove is provided', () => {
    render(
      <ParentFormFields
        parent={sampleParent1}
        index={0}
        errorField={null}
        onUpdate={mockUpdate}
        onRemove={mockRemove}
        canRemove={true}
      />
    );
    const removeButton = screen.getByRole('button', { name: /Remove/i });
    expect(removeButton).toBeInTheDocument();
  });

  it('does not render remove button when canRemove is false', () => {
    render(
      <ParentFormFields
        parent={sampleParent1}
        index={0}
        errorField={null}
        onUpdate={mockUpdate}
        onRemove={mockRemove}
        canRemove={false}
      />
    );
    expect(screen.queryByRole('button', { name: /Remove/i })).not.toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ParentFormFields
        parent={sampleParent1}
        index={0}
        errorField={null}
        onUpdate={mockUpdate}
        onRemove={mockRemove}
        canRemove={true}
      />
    );
    const removeButton = screen.getByRole('button', { name: /Remove/i });
    await user.click(removeButton);
    expect(mockRemove).toHaveBeenCalledTimes(1);
  });
});
