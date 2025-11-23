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
});
