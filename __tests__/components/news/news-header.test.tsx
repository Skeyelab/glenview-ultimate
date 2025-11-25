import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NewsHeader } from '@/components/news/news-header';

describe('NewsHeader', () => {
  it('renders with default title', () => {
    render(<NewsHeader />);
    expect(screen.getByRole('heading', { level: 1, name: 'News' })).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<NewsHeader title="Latest Updates" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Latest Updates' })).toBeInTheDocument();
  });
});
