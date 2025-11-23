import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { DesktopNav } from '@/components/navbar/desktop-nav';
import { NAV_LINKS } from '@/components/navbar/nav-links';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Mock next/link
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  },
}));

describe('DesktopNav', () => {
  it('should render navigation element', () => {
    render(<DesktopNav links={NAV_LINKS} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render all navigation links', () => {
    render(<DesktopNav links={NAV_LINKS} />);
    
    NAV_LINKS.forEach((link) => {
      expect(screen.getByRole('link', { name: link.label })).toBeInTheDocument();
    });
  });

  it('should have correct classes', () => {
    render(<DesktopNav links={NAV_LINKS} />);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('hidden', 'md:flex', 'gap-4', 'text-sm');
  });

  it('should render links with correct hrefs', () => {
    render(<DesktopNav links={NAV_LINKS} />);
    
    NAV_LINKS.forEach((link) => {
      const navLink = screen.getByRole('link', { name: link.label });
      expect(navLink).toHaveAttribute('href', link.href);
    });
  });
});
