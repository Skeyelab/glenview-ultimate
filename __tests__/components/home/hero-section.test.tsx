import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { HeroSection } from '@/components/home/hero-section';
import type { Website } from '@/lib/directus';
import { HERO_CTA_LABEL, HERO_CTA_URL, HERO_PRE_REGISTRATION_TEXT } from '@/lib/constants';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}));

// Mock sanitize-html
vi.mock('sanitize-html', () => ({
  default: vi.fn((html: string) => html),
}));

// Mock next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, priority: _priority, ...props }: { src: string; alt: string; priority?: boolean; [key: string]: any }) => {
    // Filter out Next.js specific props that aren't valid HTML attributes
    const { width: _width, height: _height, fill: _fill, quality: _quality, placeholder: _placeholder, blurDataURL: _blurDataURL, ...htmlProps } = props;
    return <img src={src} alt={alt} {...htmlProps} />;
  },
}));

// Mock next/link
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('HeroSection', () => {
  it('renders the hero title', () => {
    render(<HeroSection logoUrl={null} website={null} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/The Fun Starts/i);
  });

  it('renders hero block HTML content when provided', () => {
    const mockWebsite: Website = {
      id: 1,
      site_name: 'Glenview Ultimate',
      hero_title: 'The Fun Starts - Spring 2026',
      hero_block: '<p>Introducing Glenview\'s very first Youth Ultimate Frisbee Club</p><p>5th-8th Grade. Boys &amp; Girls.</p><p>Everyone is Welcome. Everyone Plays.</p><p>Come play with us. Join our team.</p>',
    };
    render(<HeroSection logoUrl={null} website={mockWebsite} />);
    expect(screen.getByText(/Introducing Glenview's very first Youth Ultimate Frisbee Club/i)).toBeInTheDocument();
    expect(screen.getByText(/5th-8th Grade. Boys & Girls./i)).toBeInTheDocument();
    expect(screen.getByText(/Everyone is Welcome. Everyone Plays./i)).toBeInTheDocument();
    expect(screen.getByText(/Come play with us. Join our team./i)).toBeInTheDocument();
  });

  it('renders fallback hero block when website hero_block is null', () => {
    const mockWebsite: Website = {
      id: 1,
      site_name: 'Glenview Ultimate',
      hero_title: 'The Fun Starts - Spring 2026',
      hero_block: null,
    };
    const { container } = render(<HeroSection logoUrl={null} website={mockWebsite} />);
    const heroBlockDiv = container.querySelector('.prose');
    expect(heroBlockDiv).toBeInTheDocument();
    expect(screen.getByText(/Introducing Glenview's very first Youth Ultimate Frisbee Club/i)).toBeInTheDocument();
  });

  it('renders fallback hero block when website is null', () => {
    render(<HeroSection logoUrl={null} website={null} />);
    expect(screen.getByText(/Introducing Glenview's very first Youth Ultimate Frisbee Club/i)).toBeInTheDocument();
  });

  it('sanitizes hero block HTML content', async () => {
    const sanitizeHtml = (await import('sanitize-html')).default;
    const mockWebsite: Website = {
      id: 1,
      site_name: 'Glenview Ultimate',
      hero_title: 'The Fun Starts - Spring 2026',
      hero_block: '<p>Content</p><script>alert("xss")</script>',
    };
    render(<HeroSection logoUrl={null} website={mockWebsite} />);
    expect(sanitizeHtml).toHaveBeenCalledWith(mockWebsite.hero_block);
  });

  it('renders the CTA link', () => {
    render(<HeroSection logoUrl={null} website={null} />);
    const ctaLink = screen.getByRole('link', { name: HERO_CTA_LABEL });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute('href', HERO_CTA_URL);
  });

  it('does not render pre-registration text when commented out', () => {
    render(<HeroSection logoUrl={null} website={null} />);
    expect(screen.queryByText(HERO_PRE_REGISTRATION_TEXT)).not.toBeInTheDocument();
  });

  it('renders logo when provided', () => {
    render(<HeroSection logoUrl="/logo.png" website={null} />);
    const logo = screen.getByAltText('Glenview Ultimate');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo.png');
  });

  it('does not render logo when not provided', () => {
    render(<HeroSection logoUrl={null} website={null} />);
    expect(screen.queryByAltText('Glenview Ultimate')).not.toBeInTheDocument();
  });

  it('renders season summary when provided', () => {
    const mockWebsite: Website = {
      id: 1,
      site_name: 'Glenview Ultimate',
      hero_title: 'The Fun Starts - Spring 2026',
      season_summary: 'Spring 2026 (Mar–May)',
    };
    render(<HeroSection logoUrl={null} website={mockWebsite} />);
    expect(screen.getByText('Spring 2026 (Mar–May)')).toBeInTheDocument();
  });

  it('does not render season summary when not provided', () => {
    render(<HeroSection logoUrl={null} website={null} />);
    expect(screen.queryByText(/Mar–May/)).not.toBeInTheDocument();
  });

  it('renders section with landmark role', () => {
    const { container } = render(<HeroSection logoUrl={null} website={null} />);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<HeroSection logoUrl={null} website={null} className="custom-class" />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-class');
  });
});
