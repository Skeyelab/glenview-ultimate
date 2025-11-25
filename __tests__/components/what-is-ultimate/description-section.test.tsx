import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { DescriptionSection } from '@/components/what-is-ultimate/description-section';

// Mock sanitize-html
vi.mock('sanitize-html', () => ({
  default: vi.fn((html: string) => html.replace('<script>', '')),
}));

describe('DescriptionSection', () => {
  it('renders HTML content when provided', () => {
    const htmlContent = '<p>This is HTML content</p>';
    const { container } = render(<DescriptionSection htmlContent={htmlContent} />);
    const paragraph = container.querySelector('p');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph?.textContent).toBe('This is HTML content');
  });

  it('sanitizes HTML content', async () => {
    const sanitizeHtml = (await import('sanitize-html')).default;
    const htmlContent = '<p>Content</p><script>alert("xss")</script>';
    render(<DescriptionSection htmlContent={htmlContent} />);
    expect(sanitizeHtml).toHaveBeenCalledWith(htmlContent);
  });

  it('renders paragraphs array when htmlContent is not provided', () => {
    const paragraphs = ['Paragraph 1', 'Paragraph 2'];
    render(<DescriptionSection paragraphs={paragraphs} />);
    expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
    expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
  });

  it('prioritizes htmlContent over paragraphs', () => {
    const htmlContent = '<p>HTML Content</p>';
    const paragraphs = ['Paragraph 1', 'Paragraph 2'];
    const { container } = render(<DescriptionSection htmlContent={htmlContent} paragraphs={paragraphs} />);
    expect(container.querySelector('p')?.textContent).toBe('HTML Content');
    expect(screen.queryByText('Paragraph 1')).not.toBeInTheDocument();
  });

  it('returns empty fragment when neither htmlContent nor paragraphs are provided', () => {
    const { container } = render(<DescriptionSection />);
    expect(container.firstChild).toBeNull();
  });

  it('returns empty fragment when paragraphs array is empty', () => {
    const { container } = render(<DescriptionSection paragraphs={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<DescriptionSection htmlContent="<p>Content</p>" className="custom-class" />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-class');
  });

});
