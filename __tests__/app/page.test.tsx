/** @jest-environment jsdom */

import React from 'react';
import { render } from '@testing-library/react';
import HomePage from '@/app/page';

// Mock directus functions
jest.mock('@/lib/directus', () => ({
  getPartners: jest.fn(),
  getTeam: jest.fn(),
  getSchedule: jest.fn(),
  getWebsite: jest.fn(),
  getDirectusAssetUrl: jest.fn((id) => `https://example.com/assets/${id}`),
}));

// Mock components
jest.mock('@/components/home/hero-section', () => ({
  HeroSection: ({ season, logoUrl, website }: any) => (
    <div data-testid="hero-section">
      {season ? 'Has season' : 'No season'} - {logoUrl ? 'Has logo' : 'No logo'} - {website ? 'Has website' : 'No website'}
    </div>
  ),
}));

jest.mock('@/components/home/season-highlights-card', () => ({
  SeasonHighlightsCard: ({ highlights }: any) => (
    <div data-testid="season-highlights">{highlights?.length || 0} highlights</div>
  ),
}));

jest.mock('@/components/home/leadership-section', () => ({
  LeadershipSection: ({ people }: any) => <div data-testid="leadership">{people?.length || 0} people</div>,
}));

jest.mock('@/components/home/partners-section', () => ({
  PartnersSection: ({ partners }: any) => <div data-testid="partners">{partners?.length || 0} partners</div>,
}));

jest.mock('@/components/home/home-visual-editing-provider', () => ({
  HomeVisualEditingProvider: ({ children }: any) => <div data-testid="visual-editing">{children}</div>,
}));

describe('HomePage', () => {
  const { getPartners, getTeam, getSchedule, getWebsite, getDirectusAssetUrl } = require('@/lib/directus');

  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.DIRECTUS_URL;
  });

  it('should render with empty data', async () => {
    getPartners.mockResolvedValue([]);
    getTeam.mockResolvedValue([]);
    getSchedule.mockResolvedValue(null);
    getWebsite.mockResolvedValue(null);

    const page = await HomePage();
    const { getByTestId } = render(page);

    expect(getByTestId('hero-section')).toBeInTheDocument();
    expect(getByTestId('season-highlights')).toHaveTextContent('0 highlights');
    expect(getByTestId('leadership')).toHaveTextContent('0 people');
    expect(getByTestId('partners')).toHaveTextContent('0 partners');
  });

  it('should render with fetched data', async () => {
    const mockPartners = [{ id: '1', name: 'Partner 1' }];
    const mockTeam = [{ id: '1', name: 'Person 1' }];
    const mockSchedule = {
      highlights: [{ id: '1', title: 'Highlight 1' }],
    };
    const mockWebsite = { id: 1, hero_title: 'Test Title' };

    getPartners.mockResolvedValue(mockPartners);
    getTeam.mockResolvedValue(mockTeam);
    getSchedule.mockResolvedValue(mockSchedule);
    getWebsite.mockResolvedValue(mockWebsite);

    const page = await HomePage();
    const { getByTestId } = render(page);

    expect(getByTestId('partners')).toHaveTextContent('1 partners');
    expect(getByTestId('leadership')).toHaveTextContent('1 people');
    expect(getByTestId('season-highlights')).toHaveTextContent('1 highlights');
  });

  it('should fetch all required data', async () => {
    getPartners.mockResolvedValue([]);
    getTeam.mockResolvedValue([]);
    getSchedule.mockResolvedValue(null);
    getWebsite.mockResolvedValue(null);

    await HomePage();

    expect(getPartners).toHaveBeenCalledTimes(1);
    expect(getTeam).toHaveBeenCalledTimes(1);
    expect(getSchedule).toHaveBeenCalledTimes(1);
    expect(getWebsite).toHaveBeenCalledTimes(1);
  });

  it('should get logo URL', async () => {
    getPartners.mockResolvedValue([]);
    getTeam.mockResolvedValue([]);
    getSchedule.mockResolvedValue(null);
    getWebsite.mockResolvedValue(null);

    await HomePage();

    expect(getDirectusAssetUrl).toHaveBeenCalled();
  });
});
