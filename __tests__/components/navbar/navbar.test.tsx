import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { beforeEach, vi } from 'vitest';
import { Navbar } from '@/components/navbar/navbar';
import { NAV_LINKS } from '@/components/navbar/nav-links';
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

// Mock next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => {
    return <img src={src} alt={alt} {...props} />;
  },
}));

describe('Navbar', () => {
  const usePathname = vi.mocked(nextNavigation.usePathname);

  beforeEach(() => {
    vi.clearAllMocks();
    usePathname.mockReturnValue('/');
    delete process.env.NEXT_PUBLIC_DIRECTUS_URL;
  });

  it('should render logo', () => {
    render(<Navbar links={NAV_LINKS} />);
    expect(screen.getByText('Glenview Ultimate')).toBeInTheDocument();
  });

  it('should render desktop navigation', () => {
    render(<Navbar links={NAV_LINKS} />);
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
  });

  it('should render register button', () => {
    render(<Navbar links={NAV_LINKS} />);
    const registerButton = screen.getByRole('link', { name: /register/i });
    expect(registerButton).toBeInTheDocument();
    expect(registerButton).toHaveAttribute('href', '/register');
  });

  it('should toggle mobile menu when button is clicked', async () => {
    const user = userEvent.setup();
    render(<Navbar links={NAV_LINKS} />);

    const menuButton = screen.getByRole('button', { name: /toggle navigation/i });
    await user.click(menuButton);

    // Mobile menu should be visible (check by id since there are multiple nav elements)
    const mobileNav = document.getElementById('mobile-nav');
    expect(mobileNav).toBeInTheDocument();
  });

  it('should close mobile menu when pathname changes', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Navbar links={NAV_LINKS} />);

    // Open menu first by clicking button
    const menuButton = screen.getByRole('button', { name: /toggle navigation/i });
    await user.click(menuButton);

    // Verify menu is open
    expect(document.getElementById('mobile-nav')).toBeInTheDocument();

    // Change pathname by updating the mock
    usePathname.mockReturnValue('/about');
    rerender(<Navbar links={NAV_LINKS} />);

    // Menu should be closed (not visible)
    const mobileNav = document.getElementById('mobile-nav');
    expect(mobileNav).not.toBeInTheDocument();
  });
});
