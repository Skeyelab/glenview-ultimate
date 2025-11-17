import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Label } from '@/components/ui/label';

describe('Label', () => {
  it('should render label with default classes', () => {
    render(<Label>Test Label</Label>);
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveClass('block', 'text-sm', 'text-slate-800', 'mb-1');
  });

  it('should pass through HTML label attributes', () => {
    render(<Label htmlFor="test-input">Label</Label>);
    const label = screen.getByText('Label');
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('should apply custom className when provided', () => {
    render(<Label className="custom-label">Label</Label>);
    const label = screen.getByText('Label');
    expect(label).toHaveClass('custom-label');
  });

  it('should support all standard label props', () => {
    render(<Label data-testid="test-label" aria-label="Test">Label</Label>);
    const label = screen.getByTestId('test-label');
    expect(label).toHaveAttribute('aria-label', 'Test');
  });
});
