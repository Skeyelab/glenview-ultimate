import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { NewsHeader } from '@/components/news/news-header';

// Mock PageHeader
vi.mock('@/components/ui/page-header', () => ({
  PageHeader: ({ title, className }: { title?: string; className?: string }) => (
    <div data-testid="page-header" data-title={title} className={className}>
      <h1>{title}</h1>
    </div>
  ),
}));

describe('NewsHeader', () => {
  it('renders with default title', () => {
    render(<NewsHeader />);
    expect(screen.getByText('News')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<NewsHeader title="Latest Updates" />);
    expect(screen.getByText('Latest Updates')).toBeInTheDocument();
  });

  it('passes className to PageHeader', () => {
    const { container } = render(<NewsHeader className="custom-class" />);
    const header = container.querySelector('[data-testid="page-header"]');
    expect(header).toHaveClass('custom-class');
  });
});
