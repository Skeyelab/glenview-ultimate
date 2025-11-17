import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ChildFormFields } from '@/components/register/child-form-fields';
import type { Child } from '@/lib/register-types';
import { sampleChild1 } from '@/__tests__/fixtures/registration';

describe('ChildFormFields', () => {
  const mockUpdate = jest.fn();
  const mockRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(
      <ChildFormFields
        child={sampleChild1}
        index={0}
        onUpdate={mockUpdate}
        canRemove={false}
      />
    );
    expect(screen.getByDisplayValue('Alice Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText(/Availability/i)).toBeInTheDocument();
  });

  it('displays child data in fields', () => {
    render(
      <ChildFormFields
        child={sampleChild1}
        index={0}
        onUpdate={mockUpdate}
        canRemove={false}
      />
    );
    expect(screen.getByDisplayValue('Alice Doe')).toHaveValue('Alice Doe');
    expect(screen.getByDisplayValue('10')).toHaveValue('10');
    expect(screen.getByRole('combobox')).toHaveValue('beginner');
  });

  it('calls onUpdate when name field changes', async () => {
    render(
      <ChildFormFields
        child={sampleChild1}
        index={0}
        onUpdate={mockUpdate}
        canRemove={false}
      />
    );
    const nameInput = screen.getByDisplayValue('Alice Doe');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    expect(mockUpdate).toHaveBeenCalledWith(0, { full_name: 'New Name' });
  });

  it('calls onUpdate when age field changes', async () => {
    render(
      <ChildFormFields
        child={sampleChild1}
        index={0}
        onUpdate={mockUpdate}
        canRemove={false}
      />
    );
    const ageInput = screen.getByDisplayValue('10');
    fireEvent.change(ageInput, { target: { value: '11' } });
    expect(mockUpdate).toHaveBeenCalledWith(0, { age: '11' });
  });

  it('calls onUpdate when experience select changes', async () => {
    const user = userEvent.setup();
    render(
      <ChildFormFields
        child={sampleChild1}
        index={0}
        onUpdate={mockUpdate}
        canRemove={false}
      />
    );
    const experienceSelect = screen.getByRole('combobox');
    await user.selectOptions(experienceSelect, 'intermediate');
    expect(mockUpdate).toHaveBeenCalledWith(0, { experience: 'intermediate' });
  });

  it('calls onUpdate with undefined when experience is cleared', async () => {
    const user = userEvent.setup();
    render(
      <ChildFormFields
        child={sampleChild1}
        index={0}
        onUpdate={mockUpdate}
        canRemove={false}
      />
    );
    const experienceSelect = screen.getByRole('combobox');
    await user.selectOptions(experienceSelect, '');
    expect(mockUpdate).toHaveBeenCalledWith(0, { experience: undefined });
  });

  it('renders all weekday checkboxes', () => {
    render(
      <ChildFormFields
        child={sampleChild1}
        index={0}
        onUpdate={mockUpdate}
        canRemove={false}
      />
    );
    expect(screen.getByLabelText(/Mon/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tue/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Wed/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Thu/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fri/i)).toBeInTheDocument();
  });

  it('checks availability checkboxes based on child data', () => {
    render(
      <ChildFormFields
        child={sampleChild1}
        index={0}
        onUpdate={mockUpdate}
        canRemove={false}
      />
    );
    expect(screen.getByLabelText(/Mon/i)).toBeChecked();
    expect(screen.getByLabelText(/Tue/i)).not.toBeChecked();
    expect(screen.getByLabelText(/Wed/i)).toBeChecked();
    expect(screen.getByLabelText(/Fri/i)).toBeChecked();
  });

  it('calls onUpdate when availability checkbox is checked', async () => {
    const user = userEvent.setup();
    const childWithoutTue: Child = {
      ...sampleChild1,
      availability: ['Mon', 'Wed'],
    };
    render(
      <ChildFormFields
        child={childWithoutTue}
        index={0}
        onUpdate={mockUpdate}
        canRemove={false}
      />
    );
    const tueCheckbox = screen.getByLabelText(/Tue/i);
    await user.click(tueCheckbox);
    expect(mockUpdate).toHaveBeenCalledWith(0, {
      availability: ['Mon', 'Wed', 'Tue'],
    });
  });

  it('calls onUpdate when availability checkbox is unchecked', async () => {
    const user = userEvent.setup();
    render(
      <ChildFormFields
        child={sampleChild1}
        index={0}
        onUpdate={mockUpdate}
        canRemove={false}
      />
    );
    const monCheckbox = screen.getByLabelText(/Mon/i);
    await user.click(monCheckbox);
    expect(mockUpdate).toHaveBeenCalledWith(0, {
      availability: ['Wed', 'Fri'],
    });
  });

  it('handles empty availability array', () => {
    const childWithoutAvailability: Child = {
      ...sampleChild1,
      availability: [],
    };
    render(
      <ChildFormFields
        child={childWithoutAvailability}
        index={0}
        onUpdate={mockUpdate}
        canRemove={false}
      />
    );
    expect(screen.getByLabelText(/Mon/i)).not.toBeChecked();
  });

  it('handles undefined availability', () => {
    const childWithoutAvailability: Child = {
      ...sampleChild1,
      availability: undefined,
    };
    render(
      <ChildFormFields
        child={childWithoutAvailability}
        index={0}
        onUpdate={mockUpdate}
        canRemove={false}
      />
    );
    expect(screen.getByLabelText(/Mon/i)).not.toBeChecked();
  });

  it('marks name field as required', () => {
    render(
      <ChildFormFields
        child={sampleChild1}
        index={0}
        onUpdate={mockUpdate}
        canRemove={false}
      />
    );
    expect(screen.getByDisplayValue('Alice Doe')).toBeRequired();
  });

  it('renders remove button when canRemove is true and onRemove is provided', () => {
    render(
      <ChildFormFields
        child={sampleChild1}
        index={0}
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
      <ChildFormFields
        child={sampleChild1}
        index={0}
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
      <ChildFormFields
        child={sampleChild1}
        index={0}
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
