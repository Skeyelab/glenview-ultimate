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

  it('renders brand and primary nav links', () => {
    render(<Navbar links={NAV_LINKS} />);
    expect(screen.getByText('Glenview Ultimate')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register/i })).toHaveAttribute('href', '/register');
  });

  it('applies active styles to the current route', () => {
    usePathname.mockReturnValue('/about');
    render(<Navbar links={NAV_LINKS} />);
    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toHaveClass('bg-white/20', 'text-white');
  });

  it('toggles mobile menu and closes on route change', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Navbar links={NAV_LINKS} />);

    const menuButton = screen.getByRole('button', { name: /toggle navigation/i });
    await user.click(menuButton);
    expect(document.getElementById('mobile-nav')).toBeInTheDocument();

    usePathname.mockReturnValue('/about');
    rerender(<Navbar links={NAV_LINKS} />);
    expect(document.getElementById('mobile-nav')).not.toBeInTheDocument();
  });
});
