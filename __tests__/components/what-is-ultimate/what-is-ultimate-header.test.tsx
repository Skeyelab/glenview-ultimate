import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { WhatIsUltimateHeader } from '@/components/what-is-ultimate/what-is-ultimate-header';

// Mock PageHeader
vi.mock('@/components/ui/page-header', () => ({
  PageHeader: ({ title, className }: { title?: string; className?: string }) => (
    <div data-testid="page-header" data-title={title} className={className}>
      <h1>{title}</h1>
    </div>
  ),
}));

describe('WhatIsUltimateHeader', () => {
  it('renders with default title', () => {
    render(<WhatIsUltimateHeader />);
    expect(screen.getByText('What is Ultimate?')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<WhatIsUltimateHeader title="Learn About Ultimate" />);
    expect(screen.getByText('Learn About Ultimate')).toBeInTheDocument();
  });

  it('passes className to PageHeader', () => {
    const { container } = render(<WhatIsUltimateHeader className="custom-class" />);
    const header = container.querySelector('[data-testid="page-header"]');
    expect(header).toHaveClass('custom-class');
  });
});
