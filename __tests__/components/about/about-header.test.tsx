import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { AboutHeader } from '@/components/about/about-header';

// Mock PageHeader
vi.mock('@/components/ui/page-header', () => ({
  PageHeader: ({ title, description, className }: { title?: string; description: string; className?: string }) => (
    <div data-testid="page-header" data-title={title} data-description={description} className={className}>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  ),
}));

describe('AboutHeader', () => {
  it('renders with default title', () => {
    render(<AboutHeader description="Test description" />);
    expect(screen.getByText('About Glenview Ultimate')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<AboutHeader title="Custom Title" description="Test description" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<AboutHeader description="Test description" />);
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('passes className to PageHeader', () => {
    const { container } = render(<AboutHeader description="Test description" className="custom-class" />);
    const header = container.querySelector('[data-testid="page-header"]');
    expect(header).toHaveClass('custom-class');
  });

  it('passes all props to PageHeader', () => {
    const { container } = render(
      <AboutHeader title="Custom Title" description="Test description" className="custom-class" />,
    );
    const header = container.querySelector('[data-testid="page-header"]');
    expect(header).toHaveAttribute('data-title', 'Custom Title');
    expect(header).toHaveAttribute('data-description', 'Test description');
  });
});
