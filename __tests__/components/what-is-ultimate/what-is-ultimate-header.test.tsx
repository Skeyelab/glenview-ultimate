import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WhatIsUltimateHeader } from '@/components/what-is-ultimate/what-is-ultimate-header';

describe('WhatIsUltimateHeader', () => {
  it('renders with default title', () => {
    render(<WhatIsUltimateHeader />);
    expect(screen.getByRole('heading', { level: 1, name: 'What is Ultimate?' })).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<WhatIsUltimateHeader title="Learn About Ultimate" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Learn About Ultimate' })).toBeInTheDocument();
  });
});
