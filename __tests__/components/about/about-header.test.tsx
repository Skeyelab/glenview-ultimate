import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AboutHeader } from '@/components/about/about-header';

describe('AboutHeader', () => {
  it('renders with default title and description', () => {
    render(<AboutHeader description="Test description" />);
    expect(screen.getByRole('heading', { level: 1, name: 'About Glenview Ultimate' })).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<AboutHeader title="Custom Title" description="Test description" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Custom Title' })).toBeInTheDocument();
  });
});
