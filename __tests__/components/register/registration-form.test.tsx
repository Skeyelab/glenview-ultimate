import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { RegistrationForm } from '@/components/register/registration-form';
import { sampleParent1, sampleParent2, sampleChild1, sampleChild2, sampleNotes } from '@/__tests__/fixtures/registration';
import { buildRegistrationPayload } from '@/lib/register-utils';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}));

// Mock window.umami
const mockTrack = jest.fn();
global.window = {
  ...global.window,
  umami: {
    track: mockTrack,
  },
} as any;

describe('RegistrationForm', () => {
  let mockFetch: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock fetch globally
    global.fetch = jest.fn() as jest.Mock;
    mockFetch = global.fetch as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the form with initial fields', () => {
    render(<RegistrationForm />);
    expect(screen.getByDisplayValue('')).toBeInTheDocument(); // Empty name field
    expect(screen.getByRole('textbox', { type: 'email' })).toBeInTheDocument();
    expect(screen.getAllByRole('textbox').length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Submit Registration/i })).toBeInTheDocument();
  });

  it('shows validation errors for required fields on submit', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm />);
    const submitButton = screen.getByRole('button', { name: /Submit Registration/i });
    await user.click(submitButton);
    
    // HTML5 validation should prevent submission - check that form doesn't submit
    // (fetch should not be called when validation fails)
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm />);
    const emailInput = screen.getByRole('textbox', { type: 'email' });
    await user.type(emailInput, 'invalid-email');
    await user.tab();
    
    // HTML5 email validation
    expect(emailInput).toBeInvalid();
  });

  it('submits correct payload on successful submission', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    render(<RegistrationForm />);
    
    // Fill in parent fields - find inputs by querying empty textboxes
    const emptyTextboxes = screen.getAllByDisplayValue('');
    await user.type(emptyTextboxes[0], sampleParent1.name); // First empty is name
    await user.type(emptyTextboxes[1], sampleParent1.email); // Second is email
    await user.type(emptyTextboxes[2], sampleParent1.phone); // Third is phone
    
    // Fill in child fields
    await user.type(emptyTextboxes[3], sampleChild1.full_name); // Fourth is child name
    
    // Fill in notes - find textarea by label
    const notesLabel = screen.getByText(/Notes/i);
    const notesTextarea = notesLabel.closest('div')?.querySelector('textarea');
    if (notesTextarea) {
      await user.type(notesTextarea, sampleNotes);
    }
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /Submit Registration/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: expect.any(String),
      });
    });

    const callBody = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    const expectedPayload = buildRegistrationPayload(
      [sampleParent1],
      [{ full_name: sampleChild1.full_name }],
      sampleNotes,
      false
    );
    expect(callBody).toMatchObject({
      parent1_name: expectedPayload.parent1_name,
      parent1_email: expectedPayload.parent1_email,
      parent1_phone: expectedPayload.parent1_phone,
      children: expectedPayload.children,
      notes: expectedPayload.notes,
      marketing_opt_in: expectedPayload.marketing_opt_in,
    });
  });

  it('shows success message on successful submission', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    render(<RegistrationForm />);
    
    // Fill in required fields
    const emptyTextboxes = screen.getAllByDisplayValue('');
    await user.type(emptyTextboxes[0], sampleParent1.name);
    await user.type(emptyTextboxes[1], sampleParent1.email);
    await user.type(emptyTextboxes[3], sampleChild1.full_name);
    
    const submitButton = screen.getByRole('button', { name: /Submit Registration/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Thanks! Your registration was received./i)).toBeInTheDocument();
    });
  });

  it('handles duplicate email error (409) and highlights correct field', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({
        code: 'DUPLICATE_EMAIL',
        field: 'parent1_email',
      }),
    } as Response);

    render(<RegistrationForm />);
    
    // Fill in required fields
    const emptyTextboxes = screen.getAllByDisplayValue('');
    await user.type(emptyTextboxes[0], sampleParent1.name);
    await user.type(emptyTextboxes[1], sampleParent1.email);
    await user.type(emptyTextboxes[3], sampleChild1.full_name);
    
    const submitButton = screen.getByRole('button', { name: /Submit Registration/i });
    await user.click(submitButton);

    await waitFor(() => {
      const emailInputs = screen.getAllByRole('textbox');
      const emailInput = emailInputs.find(input => input.getAttribute('type') === 'email');
      expect(emailInput).toHaveClass('border-red-500');
      expect(screen.getByText(/already been registered/i)).toBeInTheDocument();
    });
  });

  it('handles duplicate email error for parent2', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({
        code: 'DUPLICATE_EMAIL',
        field: 'parent2_email',
      }),
    } as Response);

    render(<RegistrationForm />);
    
    // Add second parent
    const addParentButton = screen.getByRole('button', { name: /Add second parent/i });
    await user.click(addParentButton);
    
    // Fill in required fields
    const nameInputs = screen.getAllByRole('textbox', { name: /Full Name/i });
    const emailInputs = screen.getAllByRole('textbox', { name: /Email/i });
    await user.type(nameInputs[0], sampleParent1.name);
    await user.type(emailInputs[0], sampleParent1.email);
    await user.type(nameInputs[1], sampleParent2.name);
    await user.type(emailInputs[1], sampleParent2.email);
    const emptyTextboxes = screen.getAllByDisplayValue('');
    await user.type(emptyTextboxes[3], sampleChild1.full_name);
    
    const submitButton = screen.getByRole('button', { name: /Submit Registration/i });
    await user.click(submitButton);

    await waitFor(() => {
      const emailInputs = screen.getAllByRole('textbox').filter(input => input.getAttribute('type') === 'email');
      expect(emailInputs[1]).toHaveClass('border-red-500');
      expect(emailInputs[0]).not.toHaveClass('border-red-500');
    });
  });

  it('handles generic server error', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({
        error: 'Internal server error',
      }),
    } as Response);

    render(<RegistrationForm />);
    
    // Fill in required fields
    const emptyTextboxes = screen.getAllByDisplayValue('');
    await user.type(emptyTextboxes[0], sampleParent1.name);
    await user.type(emptyTextboxes[1], sampleParent1.email);
    await user.type(emptyTextboxes[3], sampleChild1.full_name);
    
    const submitButton = screen.getByRole('button', { name: /Submit Registration/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Internal server error/i)).toBeInTheDocument();
    });
  });

  it('shows submitting status during submission', async () => {
    const user = userEvent.setup();
    let resolveFetch: (value: Response) => void;
    const fetchPromise = new Promise<Response>((resolve) => {
      resolveFetch = resolve;
    });
    mockFetch.mockReturnValueOnce(fetchPromise);

    render(<RegistrationForm />);
    
    // Fill in required fields
    const emptyTextboxes = screen.getAllByDisplayValue('');
    await user.type(emptyTextboxes[0], sampleParent1.name);
    await user.type(emptyTextboxes[1], sampleParent1.email);
    await user.type(emptyTextboxes[3], sampleChild1.full_name);
    
    const submitButton = screen.getByRole('button', { name: /Submit Registration/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Submitting.../i)).toBeInTheDocument();
    });

    resolveFetch!({
      ok: true,
      json: async () => ({}),
    } as Response);
  });

  it('includes marketing opt-in in payload when checked', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    render(<RegistrationForm />);
    
    // Fill in required fields
    const emptyTextboxes = screen.getAllByDisplayValue('');
    await user.type(emptyTextboxes[0], sampleParent1.name);
    await user.type(emptyTextboxes[1], sampleParent1.email);
    await user.type(emptyTextboxes[3], sampleChild1.full_name);
    
    // Check marketing opt-in
    const marketingCheckbox = screen.getByLabelText(/I agree to receive updates/i);
    await user.click(marketingCheckbox);
    
    const submitButton = screen.getByRole('button', { name: /Submit Registration/i });
    await user.click(submitButton);

    await waitFor(() => {
      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body as string);
      expect(callBody.marketing_opt_in).toBe(true);
    });
  });

  it('includes parent2 in payload when second parent is added', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    render(<RegistrationForm />);
    
    // Add second parent
    const addParentButton = screen.getByRole('button', { name: /Add second parent/i });
    await user.click(addParentButton);
    
    // Fill in parent fields - after adding second parent, get updated empty inputs
    const emptyTextboxes = screen.getAllByDisplayValue('');
    await user.type(emptyTextboxes[0], sampleParent1.name);
    await user.type(emptyTextboxes[1], sampleParent1.email);
    await user.type(emptyTextboxes[3], sampleParent2.name);
    await user.type(emptyTextboxes[4], sampleParent2.email);
    
    // Fill in child field
    await user.type(emptyTextboxes[6], sampleChild1.full_name);
    
    const submitButton = screen.getByRole('button', { name: /Submit Registration/i });
    await user.click(submitButton);

    await waitFor(() => {
      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body as string);
      expect(callBody.parent2_name).toBe(sampleParent2.name);
      expect(callBody.parent2_email).toBe(sampleParent2.email);
    });
  });

  it('includes multiple children in payload', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    render(<RegistrationForm />);
    
    // Fill in parent fields
    const emptyTextboxes = screen.getAllByDisplayValue('');
    await user.type(emptyTextboxes[0], sampleParent1.name);
    await user.type(emptyTextboxes[1], sampleParent1.email);
    
    // Fill in first child
    await user.type(emptyTextboxes[3], sampleChild1.full_name);
    
    // Add second child
    const addChildButton = screen.getByRole('button', { name: /Add a child/i });
    await user.click(addChildButton);
    
    // After adding child, get updated empty textboxes
    const updatedEmptyTextboxes = screen.getAllByDisplayValue('');
    // Find the second child name input (should be after first child's fields)
    await user.type(updatedEmptyTextboxes[7], sampleChild2.full_name);
    
    const submitButton = screen.getByRole('button', { name: /Submit Registration/i });
    await user.click(submitButton);

    await waitFor(() => {
      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body as string);
      expect(callBody.children).toHaveLength(2);
      expect(callBody.children[0].full_name).toBe(sampleChild1.full_name);
      expect(callBody.children[1].full_name).toBe(sampleChild2.full_name);
    });
  });

  it('calls onSubmit callback on successful submission', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = jest.fn();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    render(<RegistrationForm onSubmit={mockOnSubmit} />);
    
    // Fill in required fields
    const emptyTextboxes = screen.getAllByDisplayValue('');
    await user.type(emptyTextboxes[0], sampleParent1.name);
    await user.type(emptyTextboxes[1], sampleParent1.email);
    await user.type(emptyTextboxes[3], sampleChild1.full_name);
    
    const submitButton = screen.getByRole('button', { name: /Submit Registration/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });

  it('clears error field when parent email is edited after error', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({
        code: 'DUPLICATE_EMAIL',
        field: 'parent1_email',
      }),
    } as Response);

    render(<RegistrationForm />);
    
    // Fill in required fields
    const emptyTextboxes = screen.getAllByDisplayValue('');
    await user.type(emptyTextboxes[0], sampleParent1.name);
    await user.type(emptyTextboxes[1], sampleParent1.email);
    await user.type(emptyTextboxes[3], sampleChild1.full_name);
    
    const submitButton = screen.getByRole('button', { name: /Submit Registration/i });
    await user.click(submitButton);

    await waitFor(() => {
      const emailInputs = screen.getAllByRole('textbox');
      const emailInput = emailInputs.find(input => input.getAttribute('type') === 'email');
      expect(emailInput).toHaveClass('border-red-500');
    });

    // Edit email
    const emailInputs = screen.getAllByRole('textbox');
    const emailInput = emailInputs.find(input => input.getAttribute('type') === 'email');
    await user.clear(emailInput!);
    await user.type(emailInput!, 'newemail@example.com');

    // Error styling should be cleared
    await waitFor(() => {
      expect(emailInput).not.toHaveClass('border-red-500');
    });
  });
});
