import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HeroSection } from '@/components/home/hero-section';
import type { SeasonSchedule } from '@/lib/directus';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('HeroSection', () => {
  const mockSeason: SeasonSchedule = {
    season_year: 2026,
    year: 2026,
    title: 'Spring 2026',
    start_month: 'Mar',
    end_month: 'May',
    highlights: [],
    events: [],
  };

  it('renders the hero title', () => {
    render(<HeroSection season={null} logoUrl={null} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/The Fun Starts/i);
  });

  it('renders hero paragraphs', () => {
    render(<HeroSection season={null} logoUrl={null} />);
    expect(screen.getByText(/Introducing Glenview's very first Youth Ultimate Frisbee Club/i)).toBeInTheDocument();
    expect(screen.getByText(/5th-8th Grade. Boys & Girls./i)).toBeInTheDocument();
    expect(screen.getByText(/Everyone is Welcome. Everyone Plays./i)).toBeInTheDocument();
    expect(screen.getByText(/Come play with us. Join our team./i)).toBeInTheDocument();
  });

  it('renders the CTA link', () => {
    render(<HeroSection season={null} logoUrl={null} />);
    const ctaLink = screen.getByRole('link', { name: /Register/i });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute('href', '/register');
  });

  it('renders pre-registration text', () => {
    render(<HeroSection season={null} logoUrl={null} />);
    expect(screen.getByText(/Pre-Registration is now open/i)).toBeInTheDocument();
  });

  it('renders logo when provided', () => {
    render(<HeroSection season={null} logoUrl="/logo.png" />);
    const logo = screen.getByAltText('Glenview Ultimate');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo.png');
  });

  it('does not render logo when not provided', () => {
    render(<HeroSection season={null} logoUrl={null} />);
    expect(screen.queryByAltText('Glenview Ultimate')).not.toBeInTheDocument();
  });

  it('renders season information when provided', () => {
    render(<HeroSection season={mockSeason} logoUrl={null} />);
    expect(screen.getByText(/Spring 2026 \(Mar–May\)/i)).toBeInTheDocument();
  });

  it('renders season with default months when start/end_month not provided', () => {
    const seasonWithoutMonths: SeasonSchedule = {
      ...mockSeason,
      start_month: null,
      end_month: null,
    };
    render(<HeroSection season={seasonWithoutMonths} logoUrl={null} />);
    expect(screen.getByText(/Spring 2026 \(Mar–May\)/i)).toBeInTheDocument();
  });

  it('renders section with landmark role', () => {
    const { container } = render(<HeroSection season={null} logoUrl={null} />);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<HeroSection season={null} logoUrl={null} className="custom-class" />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-class');
  });
});
