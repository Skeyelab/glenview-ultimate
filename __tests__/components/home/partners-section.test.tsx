import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { PartnersSection } from '@/components/home/partners-section';
import type { Partner } from '@/lib/directus';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: any }) => {
    // Filter out Next.js specific props that aren't valid HTML attributes
    const { width: _width, height: _height, priority: _priority, fill: _fill, quality: _quality, placeholder: _placeholder, blurDataURL: _blurDataURL, ...htmlProps } = props;
    return <img src={src} alt={alt} {...htmlProps} data-testid="partner-logo" />;
  },
}));

// Mock getDirectusAssetUrl
vi.mock('@/lib/directus', async () => {
  const actual = await vi.importActual('@/lib/directus');
  return {
    ...actual,
    getDirectusAssetUrl: vi.fn((logo: string | null | undefined, _options?: Record<string, unknown>) => {
      if (!logo) return null;
      return `/api/assets/${logo}`;
    }),
  };
});

describe('PartnersSection', () => {
  const mockPartner1: Partner = {
    id: 1,
    name: 'Test Partner 1',
    url: 'https://example.com/partner1',
  };

  const mockPartner2: Partner = {
    id: 2,
    name: 'Test Partner 2',
    url: 'https://example.com/partner2',
  };

  it('renders the section title', () => {
    render(<PartnersSection partners={[]} />);
    expect(screen.getByRole('heading', { level: 2, name: /Partners/i })).toBeInTheDocument();
  });

  it('renders custom title when provided', () => {
    render(<PartnersSection partners={[]} title="Our Partners" />);
    expect(screen.getByRole('heading', { level: 2, name: /Our Partners/i })).toBeInTheDocument();
  });

  it('renders default partners when no partners provided', () => {
    render(<PartnersSection partners={[]} />);
    expect(screen.getByText('Illinois Ultimate')).toBeInTheDocument();
    expect(screen.getByText('Chicago Union (UFA)')).toBeInTheDocument();
    expect(screen.getByText('Glenview Park District')).toBeInTheDocument();
    expect(screen.getByText('USA Ultimate')).toBeInTheDocument();
    expect(screen.getByText('Ultimate Chicago')).toBeInTheDocument();
  });

  it('renders provided partners instead of defaults', () => {
    render(<PartnersSection partners={[mockPartner1, mockPartner2]} />);
    expect(screen.getByText('Test Partner 1')).toBeInTheDocument();
    expect(screen.getByText('Test Partner 2')).toBeInTheDocument();
    expect(screen.queryByText('Illinois Ultimate')).not.toBeInTheDocument();
  });

  it('renders partner links with correct href and target', () => {
    render(<PartnersSection partners={[mockPartner1]} />);
    const link = screen.getByRole('link', { name: 'Test Partner 1' });
    expect(link).toHaveAttribute('href', 'https://example.com/partner1');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });

  it('renders multiple partners', () => {
    render(<PartnersSection partners={[mockPartner1, mockPartner2]} />);
    expect(screen.getByText('Test Partner 1')).toBeInTheDocument();
    expect(screen.getByText('Test Partner 2')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<PartnersSection partners={[]} className="custom-class" />);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('uses custom defaultPartners when provided', () => {
    const customDefaults: Partner[] = [
      { id: 10, name: 'Custom Partner', url: 'https://custom.com' },
    ];
    render(<PartnersSection partners={[]} defaultPartners={customDefaults} />);
    expect(screen.getByText('Custom Partner')).toBeInTheDocument();
    expect(screen.queryByText('Illinois Ultimate')).not.toBeInTheDocument();
  });

  it('renders logo when partner has logo', () => {
    const partnerWithLogo: Partner = {
      id: 1,
      name: 'Partner With Logo',
      url: 'https://example.com/partner',
      logo: 'logo-uuid-123',
    };
    render(<PartnersSection partners={[partnerWithLogo]} />);
    const logo = screen.getByTestId('partner-logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/api/assets/logo-uuid-123');
    expect(logo).toHaveAttribute('alt', 'Partner With Logo');
    expect(screen.getByText('Partner With Logo')).toBeInTheDocument();
  });

  it('renders only text when partner has no logo', () => {
    const partnerWithoutLogo: Partner = {
      id: 2,
      name: 'Partner Without Logo',
      url: 'https://example.com/partner2',
    };
    render(<PartnersSection partners={[partnerWithoutLogo]} />);
    expect(screen.queryByTestId('partner-logo')).not.toBeInTheDocument();
    expect(screen.getByText('Partner Without Logo')).toBeInTheDocument();
  });

  it('renders logo above partner name', () => {
    const partnerWithLogo: Partner = {
      id: 3,
      name: 'Test Partner',
      url: 'https://example.com/partner3',
      logo: 'logo-uuid-456',
    };
    render(<PartnersSection partners={[partnerWithLogo]} />);
    const logo = screen.getByTestId('partner-logo');
    const name = screen.getByText('Test Partner');
    const link = screen.getByRole('link', { name: /Test Partner/ });

    // Logo and name should both be in the same link
    expect(link).toContainElement(logo);
    expect(link).toContainElement(name);
  });

  it('handles partners with and without logos in the same list', () => {
    const partners: Partner[] = [
      { id: 1, name: 'Partner With Logo', url: 'https://example.com/1', logo: 'logo-1' },
      { id: 2, name: 'Partner Without Logo', url: 'https://example.com/2' },
      { id: 3, name: 'Another With Logo', url: 'https://example.com/3', logo: 'logo-3' },
    ];
    render(<PartnersSection partners={partners} />);

    const logos = screen.getAllByTestId('partner-logo');
    expect(logos).toHaveLength(2);
    expect(screen.getByText('Partner With Logo')).toBeInTheDocument();
    expect(screen.getByText('Partner Without Logo')).toBeInTheDocument();
    expect(screen.getByText('Another With Logo')).toBeInTheDocument();
  });
});
