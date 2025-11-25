import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SectionCard } from '@/components/ui/section-card';

describe('SectionCard', () => {
  it('renders title', () => {
    render(<SectionCard title="Test Title">Content</SectionCard>);
    expect(screen.getByRole('heading', { level: 2, name: 'Test Title' })).toBeInTheDocument();
  });

  it('renders title as React node', () => {
    render(<SectionCard title={<span data-testid="custom-title">Custom Title</span>}>Content</SectionCard>);
    expect(screen.getByTestId('custom-title')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<SectionCard title="Test Title" subtitle="Test subtitle">Content</SectionCard>);
    expect(screen.getByText('Test subtitle')).toBeInTheDocument();
  });

  it('renders subtitle as React node', () => {
    render(
      <SectionCard
        title="Test Title"
        subtitle={<span data-testid="custom-subtitle">Custom Subtitle</span>}
      >
        Content
      </SectionCard>,
    );
    expect(screen.getByTestId('custom-subtitle')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    render(<SectionCard title="Test Title">Content</SectionCard>);
    expect(screen.queryByText('Test subtitle')).not.toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    render(
      <SectionCard title="Test Title" actions={<button data-testid="action-btn">Action</button>}>
        Content
      </SectionCard>,
    );
    expect(screen.getByTestId('action-btn')).toBeInTheDocument();
  });

  it('does not render actions when not provided', () => {
    render(<SectionCard title="Test Title">Content</SectionCard>);
    expect(screen.queryByTestId('action-btn')).not.toBeInTheDocument();
  });

  it('renders children', () => {
    render(<SectionCard title="Test Title">Child Content</SectionCard>);
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('uses custom title element when provided', () => {
    render(<SectionCard title="Test Title" titleAs="h3">Content</SectionCard>);
    const title = screen.getByRole('heading', { level: 3, name: 'Test Title' });
    expect(title).toBeInTheDocument();
  });

  it('defaults to h2 for title', () => {
    render(<SectionCard title="Test Title">Content</SectionCard>);
    const title = screen.getByRole('heading', { level: 2, name: 'Test Title' });
    expect(title).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<SectionCard title="Test Title" className="custom-class">Content</SectionCard>);
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-class');
  });

  it('applies custom titleClassName when provided', () => {
    render(<SectionCard title="Test Title" titleClassName="custom-title">Content</SectionCard>);
    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toHaveClass('custom-title');
  });

});

