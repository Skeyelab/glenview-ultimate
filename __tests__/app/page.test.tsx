import React from 'react';
import { render } from '@testing-library/react';
import { beforeEach, vi } from 'vitest';
import HomePage from '@/app/page';

// Mock directus functions
vi.mock('@/lib/directus', () => ({
  getPartners: vi.fn(),
  getSchedule: vi.fn(),
  getWebsite: vi.fn(),
  getDirectusAssetUrl: vi.fn((id, options) => {
    const query = options ? '?opts=true' : '';
    return `https://example.com/assets/${id}${query}`;
  }),
}));

// Mock components
vi.mock('@/components/home/hero-section', () => ({
  HeroSection: ({ season, logoUrl, website }: any) => (
    <div data-testid="hero-section">
      {season ? 'Has season' : 'No season'} - {logoUrl ? 'Has logo' : 'No logo'} - {website ? 'Has website' : 'No website'}
    </div>
  ),
}));

vi.mock('@/components/home/season-highlights-card', () => ({
  SeasonHighlightsCard: ({ highlights }: any) => (
    <div data-testid="season-highlights">{highlights?.length || 0} highlights</div>
  ),
}));

vi.mock('@/components/home/partners-section', () => ({
  PartnersSection: ({ partners }: any) => <div data-testid="partners">{partners?.length || 0} partners</div>,
}));

vi.mock('@/components/home/home-visual-editing-provider', () => ({
  HomeVisualEditingProvider: ({ children }: any) => <div data-testid="visual-editing">{children}</div>,
}));

describe('HomePage', () => {
  let getPartners: any, getSchedule: any, getWebsite: any, getDirectusAssetUrl: any;

  beforeEach(async () => {
    const directus = await import('@/lib/directus');
    getPartners = directus.getPartners;
    getSchedule = directus.getSchedule;
    getWebsite = directus.getWebsite;
    getDirectusAssetUrl = directus.getDirectusAssetUrl;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.DIRECTUS_URL;
  });

  it('should render with empty data', async () => {
    getPartners.mockResolvedValue([]);
    getSchedule.mockResolvedValue(null);
    getWebsite.mockResolvedValue(null);

    const page = await HomePage();
    const { getByTestId } = render(page);

    expect(getByTestId('hero-section')).toBeInTheDocument();
    expect(getByTestId('season-highlights')).toHaveTextContent('0 highlights');
    expect(getByTestId('partners')).toHaveTextContent('0 partners');
  });

  it('should render with fetched data', async () => {
    const mockPartners = [{ id: '1', name: 'Partner 1' }];
    const mockSchedule = {
      highlights: [{ id: '1', title: 'Highlight 1' }],
    };
    const mockWebsite = { id: 1, hero_title: 'Test Title' };

    getPartners.mockResolvedValue(mockPartners);
    getSchedule.mockResolvedValue(mockSchedule);
    getWebsite.mockResolvedValue(mockWebsite);

    const page = await HomePage();
    const { getByTestId } = render(page);

    expect(getByTestId('partners')).toHaveTextContent('1 partners');
    expect(getByTestId('season-highlights')).toHaveTextContent('1 highlights');
  });

  it('should fetch all required data', async () => {
    getPartners.mockResolvedValue([]);
    getSchedule.mockResolvedValue(null);
    getWebsite.mockResolvedValue(null);

    await HomePage();

    expect(getPartners).toHaveBeenCalledTimes(1);
    expect(getSchedule).toHaveBeenCalledTimes(1);
    expect(getWebsite).toHaveBeenCalledTimes(1);
  });

  it('should get logo URL', async () => {
    getPartners.mockResolvedValue([]);
    getSchedule.mockResolvedValue(null);
    getWebsite.mockResolvedValue(null);

    await HomePage();

    expect(getDirectusAssetUrl).toHaveBeenCalled();
  });
});
