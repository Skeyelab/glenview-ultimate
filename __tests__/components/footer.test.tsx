import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Footer } from '@/components/footer';

describe('Footer', () => {
  it('should render copyright text with current year', () => {
    const currentYear = new Date().getFullYear();
    render(<Footer />);

    expect(screen.getByText(`© ${currentYear} Glenview Ultimate`)).toBeInTheDocument();
  });

  it('should have footer element with correct classes', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');

    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('border-t', 'border-white/20', 'mt-4');
  });

  it('should have container div with correct classes', () => {
    const { container } = render(<Footer />);
    const containerDiv = container.querySelector('.container');

    expect(containerDiv).toBeInTheDocument();
    expect(containerDiv).toHaveClass('py-8', 'text-sm', 'text-white/70');
  });
});
