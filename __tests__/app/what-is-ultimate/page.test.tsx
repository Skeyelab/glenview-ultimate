import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WhatIsUltimatePage from '@/app/what-is-ultimate/page';

describe('WhatIsUltimatePage', () => {
  it('renders the page title', async () => {
    render(await WhatIsUltimatePage());
    expect(screen.getByRole('heading', { level: 1, name: /what is ultimate\?/i })).toBeInTheDocument();
  });

  it('renders introductory text about Ultimate', async () => {
    render(await WhatIsUltimatePage());
    expect(screen.getByText(/Ultimate, also known as Ultimate Frisbee/i)).toBeInTheDocument();
    expect(screen.getByText(/emphasizing sportsmanship and fair play/i)).toBeInTheDocument();
  });

  it('renders the Learn More section heading', async () => {
    render(await WhatIsUltimatePage());
    expect(screen.getByRole('heading', { level: 2, name: /learn more through videos/i })).toBeInTheDocument();
  });

  it('renders all four video placeholders', async () => {
    render(await WhatIsUltimatePage());
    expect(screen.getByRole('heading', { level: 3, name: /introduction to ultimate/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /rules of the game/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /basic throwing techniques/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /spirit of the game/i })).toBeInTheDocument();
  });

  it('renders placeholder indicators for YouTube videos', async () => {
    render(await WhatIsUltimatePage());
    const placeholders = screen.getAllByText(/YouTube Video Embed/i);
    expect(placeholders).toHaveLength(4);
  });

  it('renders a note about videos coming soon', async () => {
    render(await WhatIsUltimatePage());
    expect(screen.getByText(/video content will be added soon/i)).toBeInTheDocument();
  });
});
