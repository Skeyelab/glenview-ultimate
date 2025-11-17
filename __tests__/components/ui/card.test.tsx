import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

describe('Card components', () => {
  describe('Card', () => {
    it('should render card with default classes', () => {
      const { container } = render(<Card>Card content</Card>);
      const card = container.querySelector('.card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveTextContent('Card content');
    });

    it('should apply custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>);
      const card = container.querySelector('.card');
      expect(card).toHaveClass('custom-class');
    });

    it('should pass through HTML attributes', () => {
      const { container } = render(<Card data-testid="test-card">Content</Card>);
      const card = container.querySelector('[data-testid="test-card"]');
      expect(card).toBeInTheDocument();
    });
  });

  describe('CardHeader', () => {
    it('should render with default classes', () => {
      const { container } = render(<CardHeader>Header content</CardHeader>);
      const header = container.querySelector('.mb-2');
      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent('Header content');
    });

    it('should apply custom className', () => {
      const { container } = render(<CardHeader className="custom-header">Header</CardHeader>);
      const header = container.querySelector('.mb-2');
      expect(header).toHaveClass('custom-header');
    });
  });

  describe('CardTitle', () => {
    it('should render as h3 with default classes', () => {
      render(<CardTitle>Title</CardTitle>);
      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Title');
      expect(title).toHaveClass('text-lg', 'font-semibold');
    });

    it('should apply custom className', () => {
      render(<CardTitle className="custom-title">Title</CardTitle>);
      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveClass('custom-title');
    });
  });

  describe('CardContent', () => {
    it('should render with default classes', () => {
      const { container } = render(<CardContent>Content</CardContent>);
      const content = container.querySelector('.space-y-3');
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('Content');
    });

    it('should apply custom className', () => {
      const { container } = render(<CardContent className="custom-content">Content</CardContent>);
      const content = container.querySelector('.space-y-3');
      expect(content).toHaveClass('custom-content');
    });
  });
});
