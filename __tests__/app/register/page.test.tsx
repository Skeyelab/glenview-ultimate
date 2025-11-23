import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { beforeEach, vi } from 'vitest';
import RegisterPage from '@/app/register/page';

// Mock window.umami
const mockTrack = vi.fn();
Object.defineProperty(window, 'umami', {
  value: {
    track: mockTrack,
  },
  writable: true,
  configurable: true,
});

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Ensure window.umami is set up
    if (typeof window !== 'undefined') {
      (window as any).umami = {
        track: mockTrack,
      };
    }
  });

  it('should render page title', () => {
    render(<RegisterPage />);
    expect(screen.getByRole('heading', { level: 1, name: /registration/i })).toBeInTheDocument();
  });

  it('should render description text', () => {
    render(<RegisterPage />);
    expect(screen.getByText(/tell us about your family/i)).toBeInTheDocument();
    expect(screen.getByText(/you can add up to three kids/i)).toBeInTheDocument();
  });

  it('should render RegistrationForm component', () => {
    render(<RegisterPage />);
    expect(screen.getByRole('button', { name: /submit registration/i })).toBeInTheDocument();
  });

  it('should track page view on mount', async () => {
    render(<RegisterPage />);
    await waitFor(() => {
      expect(mockTrack).toHaveBeenCalledWith('registration_form_view');
    });
  });
});
