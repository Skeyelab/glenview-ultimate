import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HeroSection } from '@/components/home/hero-section';
import type { SeasonSchedule, Website } from '@/lib/directus';
import {
  HERO_CTA_LABEL,
  HERO_CTA_URL,
  HERO_MESSAGE_1,
  HERO_MESSAGE_2,
  HERO_PRE_REGISTRATION_TEXT,
  HERO_SUBTITLE,
  HERO_TAGLINE,
  HERO_TITLE,
} from '@/lib/constants';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, priority: _priority, ...props }: { src: string; alt: string; priority?: boolean; [key: string]: any }) => {
    // Filter out Next.js specific props that aren't valid HTML attributes
    const { width: _width, height: _height, fill: _fill, quality: _quality, placeholder: _placeholder, blurDataURL: _blurDataURL, ...htmlProps } = props;
    return <img src={src} alt={alt} {...htmlProps} />;
  },
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

  const mockWebsite: Website = {
    id: 1,
    site_name: 'Glenview Ultimate',
    hero_title: HERO_TITLE,
    hero_subtitle: HERO_SUBTITLE,
    hero_tagline: HERO_TAGLINE,
    hero_message_primary: HERO_MESSAGE_1,
    hero_message_secondary: HERO_MESSAGE_2,
    hero_cta_label: HERO_CTA_LABEL,
    hero_cta_url: HERO_CTA_URL,
    hero_pre_registration_text: HERO_PRE_REGISTRATION_TEXT,
  };

  const renderComponent = (props: Partial<React.ComponentProps<typeof HeroSection>> = {}) =>
    render(<HeroSection season={null} logoUrl={null} website={mockWebsite} {...props} />);

  it('renders the hero title', () => {
    renderComponent();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/The Fun Starts/i);
  });

  it('renders hero paragraphs', () => {
    renderComponent();
    expect(screen.getByText(/Introducing Glenview's very first Youth Ultimate Frisbee Club/i)).toBeInTheDocument();
    expect(screen.getByText(/5th-8th Grade. Boys & Girls./i)).toBeInTheDocument();
    expect(screen.getByText(/Everyone is Welcome. Everyone Plays./i)).toBeInTheDocument();
    expect(screen.getByText(/Come play with us. Join our team./i)).toBeInTheDocument();
  });

  it('renders the CTA link', () => {
    renderComponent();
    const ctaLink = screen.getByRole('link', { name: HERO_CTA_LABEL });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute('href', HERO_CTA_URL);
  });

  it('renders pre-registration text', () => {
    renderComponent();
    expect(screen.getByText(HERO_PRE_REGISTRATION_TEXT)).toBeInTheDocument();
  });

  it('renders logo when provided', () => {
    renderComponent({ logoUrl: '/logo.png' });
    const logo = screen.getByAltText('Glenview Ultimate');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo.png');
  });

  it('does not render logo when not provided', () => {
    renderComponent();
    expect(screen.queryByAltText('Glenview Ultimate')).not.toBeInTheDocument();
  });

  it('renders season information when provided', () => {
    renderComponent({ season: mockSeason });
    expect(screen.getByText(/Spring 2026 \(Mar–May\)/i)).toBeInTheDocument();
  });

  it('renders season with default months when start/end_month not provided', () => {
    const seasonWithoutMonths: SeasonSchedule = {
      ...mockSeason,
      start_month: null,
      end_month: null,
    };
    renderComponent({ season: seasonWithoutMonths });
    expect(screen.getByText(/Spring 2026 \(Mar–May\)/i)).toBeInTheDocument();
  });

  it('renders section with landmark role', () => {
    const { container } = renderComponent();
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = renderComponent({ className: 'custom-class' });
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-class');
  });
});
