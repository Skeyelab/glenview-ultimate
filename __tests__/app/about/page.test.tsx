/** @jest-environment jsdom */

import React from 'react';
import { render } from '@testing-library/react';
import AboutPage from '@/app/about/page';

// Mock directus functions
jest.mock('@/lib/directus', () => ({
  getAbout: jest.fn(),
  getTeam: jest.fn(),
}));

// Mock components
jest.mock('@/components/about/about-header', () => ({
  AboutHeader: ({ description }: any) => <div data-testid="about-header">{description}</div>,
}));

jest.mock('@/components/about/what-kids-learn-section', () => ({
  WhatKidsLearnSection: ({ items }: any) => <div data-testid="what-kids-learn">{JSON.stringify(items)}</div>,
}));

jest.mock('@/components/about/team-leadership-section', () => ({
  TeamLeadershipSection: ({ members }: any) => <div data-testid="team-leadership">{members?.length || 0} members</div>,
}));

describe('AboutPage', () => {
  const { getAbout, getTeam } = require('@/lib/directus');

  beforeEach(() => {
    jest.clearAllMocks();
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
      club_description: 'Test club description',
      what_kids_learn: ['Skill 1', 'Skill 2'],
    };
    const mockTeam = [{ id: '1', name: 'John Doe' }];

    getAbout.mockResolvedValue(mockAbout);
    getTeam.mockResolvedValue(mockTeam);

    const page = await AboutPage();
    const { getByTestId } = render(page);

    expect(getByTestId('about-header')).toHaveTextContent('Test club description');
    expect(getByTestId('team-leadership')).toHaveTextContent('1 members');
  });

  it('should fetch about and team data', async () => {
    getAbout.mockResolvedValue(null);
    getTeam.mockResolvedValue([]);

    await AboutPage();

    expect(getAbout).toHaveBeenCalledTimes(1);
    expect(getTeam).toHaveBeenCalledTimes(1);
  });
});
