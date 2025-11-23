import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { beforeEach, vi } from 'vitest';
import { NavLink } from '@/components/navbar/nav-link';
import * as nextNavigation from 'next/navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

// Mock next/link
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  },
}));

describe('NavLink', () => {
  const usePathname = vi.mocked(nextNavigation.usePathname);

  beforeEach(() => {
    vi.clearAllMocks();
    usePathname.mockReturnValue('/');
  });

  it('should render link with correct href and label', () => {
    render(<NavLink href="/about" label="About" />);
    const link = screen.getByRole('link', { name: /about/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/about');
  });

  it('should apply active styles when pathname matches href', () => {
    usePathname.mockReturnValue('/about');
    render(<NavLink href="/about" label="About" />);
    const link = screen.getByRole('link', { name: /about/i });
    expect(link).toHaveClass('bg-white/20', 'text-white');
  });

  it('should not apply active styles when pathname does not match', () => {
    usePathname.mockReturnValue('/');
    render(<NavLink href="/about" label="About" />);
    const link = screen.getByRole('link', { name: /about/i });
    expect(link).not.toHaveClass('bg-white/20');
  });

  it('should apply custom className', () => {
    render(<NavLink href="/test" label="Test" className="custom-class" />);
    const link = screen.getByRole('link', { name: /test/i });
    expect(link).toHaveClass('custom-class');
  });

  it('should have base classes', () => {
    render(<NavLink href="/test" label="Test" />);
    const link = screen.getByRole('link', { name: /test/i });
    expect(link).toHaveClass('px-2', 'py-1', 'rounded-md', 'text-white/80');
  });
});
