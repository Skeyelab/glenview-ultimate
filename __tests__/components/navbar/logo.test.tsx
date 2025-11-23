import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { Logo } from '@/components/navbar/logo';

// Mock next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => {
    return <img src={src} alt={alt} {...props} />;
  },
}));

// Mock next/link
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  },
}));

describe('Logo', () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_DIRECTUS_URL;
  });

  it('should render logo text when Directus URL is not configured', () => {
    render(<Logo />);
    expect(screen.getByText('Glenview Ultimate')).toBeInTheDocument();
  });

  it('should render logo image when Directus URL is configured', () => {
    process.env.NEXT_PUBLIC_DIRECTUS_URL = 'https://example.com';
    render(<Logo />);
    
    const logoImage = screen.getByAltText('Glenview Ultimate');
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('src', expect.stringContaining('c3db7679-c7b9-4d7d-add9-761a96e59b86'));
  });

  it('should render link to home page', () => {
    render(<Logo />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('should have correct classes on link', () => {
    render(<Logo />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('flex', 'items-center', 'gap-3');
  });
});
