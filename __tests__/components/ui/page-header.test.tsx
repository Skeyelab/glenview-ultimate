import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PageHeader } from '@/components/ui/page-header';

describe('PageHeader', () => {
  it('renders title', () => {
    render(<PageHeader title="Test Title" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Test Title' })).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<PageHeader title="Test Title" description="Test description" />);
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<PageHeader title="Test Title" />);
    expect(screen.queryByText('Test description')).not.toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<PageHeader title="Test Title" className="custom-class" />);
    const div = container.querySelector('div');
    expect(div).toHaveClass('custom-class');
  });

  it('applies custom titleClassName when provided', () => {
    render(<PageHeader title="Test Title" titleClassName="custom-title" />);
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveClass('custom-title');
  });

  it('applies custom descriptionClassName when provided', () => {
    render(
      <PageHeader title="Test Title" description="Test description" descriptionClassName="custom-desc" />,
    );
    const desc = screen.getByText('Test description');
    expect(desc).toHaveClass('custom-desc');
  });

});
