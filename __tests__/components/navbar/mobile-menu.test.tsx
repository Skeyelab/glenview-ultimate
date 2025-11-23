import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { MobileMenu } from '@/components/navbar/mobile-menu';
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

describe('MobileMenu', () => {
  it('should not render when isOpen is false', () => {
    const { container } = render(<MobileMenu links={NAV_LINKS} isOpen={false} />);
    expect(container.querySelector('#mobile-nav')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(<MobileMenu links={NAV_LINKS} isOpen={true} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render all navigation links', () => {
    render(<MobileMenu links={NAV_LINKS} isOpen={true} />);
    
    NAV_LINKS.forEach((link) => {
      expect(screen.getByRole('link', { name: link.label })).toBeInTheDocument();
    });
  });

  it('should render register button', () => {
    render(<MobileMenu links={NAV_LINKS} isOpen={true} />);
    const registerButton = screen.getByRole('link', { name: /register/i });
    expect(registerButton).toBeInTheDocument();
    expect(registerButton).toHaveAttribute('href', '/register');
  });

  it('should have correct container id', () => {
    render(<MobileMenu links={NAV_LINKS} isOpen={true} />);
    const container = screen.getByRole('navigation').closest('#mobile-nav');
    expect(container).toBeInTheDocument();
  });
});
