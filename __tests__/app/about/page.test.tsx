import React from 'react';
import { render } from '@testing-library/react';
import { beforeEach, vi } from 'vitest';
import AboutPage from '@/app/about/page';
import * as directusModule from '@/lib/directus';

// Mock directus functions
vi.mock('@/lib/directus', () => ({
  getAbout: vi.fn(),
  getTeam: vi.fn(),
}));

// Mock components
vi.mock('@/components/about/about-header', () => ({
  AboutHeader: ({ description }: any) => <div data-testid="about-header">{description}</div>,
}));

vi.mock('@/components/about/what-kids-learn-section', () => ({
  WhatKidsLearnSection: ({ items }: any) => <div data-testid="what-kids-learn">{JSON.stringify(items)}</div>,
}));

vi.mock('@/components/about/team-leadership-section', () => ({
  TeamLeadershipSection: ({ members }: any) => <div data-testid="team-leadership">{members?.length || 0} members</div>,
}));

describe('AboutPage', () => {
  const getAbout = vi.mocked(directusModule.getAbout);
  const getTeam = vi.mocked(directusModule.getTeam);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with default values when data is null', async () => {
    getAbout.mockResolvedValue(null);
    getTeam.mockResolvedValue([]);

    const page = await AboutPage();
    const { getByTestId } = render(page);

    expect(getByTestId('about-header')).toBeInTheDocument();
    expect(getByTestId('what-kids-learn')).toBeInTheDocument();
    expect(getByTestId('team-leadership')).toBeInTheDocument();
  });

  it('should render with fetched data', async () => {
    const mockAbout = {
      id: 1,
      club_description: 'Test club description',
      what_kids_learn: ['Skill 1', 'Skill 2'],
    };
    const mockTeam = [
      { id: 1, name: 'John Doe', role: 'coach', email: null, bio: null, photo: null, squad: null },
    ];

    getAbout.mockResolvedValue(mockAbout);
    getTeam.mockResolvedValue(mockTeam);

    const page = await AboutPage();
    const { getByTestId } = render(page);

    expect(getByTestId('about-header')).toHaveTextContent('Test club description');
    expect(getByTestId('what-kids-learn')).toHaveTextContent('["Skill 1","Skill 2"]');
    expect(getByTestId('team-leadership')).toHaveTextContent('1 members');
  });

  it('should use Directus data when available instead of defaults', async () => {
    const mockAbout = {
      id: 1,
      club_description: 'Directus club description from CMS',
      what_kids_learn: ['Directus skill 1', 'Directus skill 2', 'Directus skill 3'],
    };
    getAbout.mockResolvedValue(mockAbout);
    getTeam.mockResolvedValue([]);

    const page = await AboutPage();
    const { getByTestId } = render(page);

    // Should show Directus data, not defaults
    expect(getByTestId('about-header')).toHaveTextContent('Directus club description from CMS');
    expect(getByTestId('what-kids-learn')).toHaveTextContent('Directus skill 1');
    expect(getByTestId('what-kids-learn')).toHaveTextContent('Directus skill 2');
    expect(getByTestId('what-kids-learn')).toHaveTextContent('Directus skill 3');
  });

  it('should fall back to defaults when Directus returns null', async () => {
    getAbout.mockResolvedValue(null);
    getTeam.mockResolvedValue([]);

    const page = await AboutPage();
    const { getByTestId } = render(page);

    // Should show default values
    const header = getByTestId('about-header');
    expect(header).toBeInTheDocument();
    // Default description should be present (from constants)
    expect(header.textContent).toBeTruthy();
  });

  it('should fetch about and team data', async () => {
    getAbout.mockResolvedValue(null);
    getTeam.mockResolvedValue([]);

    await AboutPage();

    expect(getAbout).toHaveBeenCalledTimes(1);
    expect(getTeam).toHaveBeenCalledTimes(1);
  });
});
