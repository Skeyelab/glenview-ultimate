import { describe, it, expect, vi, beforeEach } from 'vitest';

import { parseMarkdown } from '@/lib/markdown-utils';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

// Mock marked
vi.mock('marked', () => ({
  marked: {
    setOptions: vi.fn(),
    parse: vi.fn(),
  },
}));

// Mock sanitize-html
vi.mock('sanitize-html', () => ({
  default: vi.fn((html: string) => html),
}));

const mockParse = vi.mocked(marked.parse);
const mockSanitizeHtml = vi.mocked(sanitizeHtml);

describe('parseMarkdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('parses markdown and sanitizes HTML', async () => {
    const markdown = '# Hello World\n\nThis is **bold** text.';
    const parsedHtml = '<h1>Hello World</h1><p>This is <strong>bold</strong> text.</p>';
    
    mockParse.mockResolvedValue(parsedHtml);
    mockSanitizeHtml.mockReturnValue(parsedHtml);

    const result = await parseMarkdown(markdown);

    expect(mockParse).toHaveBeenCalledWith(markdown, { async: true });
    expect(mockSanitizeHtml).toHaveBeenCalledWith(parsedHtml);
    expect(result).toBe(parsedHtml);
  });

  it('handles parsing errors', async () => {
    const markdown = '# Test';
    const error = new Error('Parse error');
    
    mockParse.mockRejectedValue(error);

    await expect(parseMarkdown(markdown)).rejects.toThrow('Failed to parse markdown: Parse error');
  });

  it('handles different markdown formats', async () => {
    const markdown = '- List item 1\n- List item 2';
    const parsedHtml = '<ul><li>List item 1</li><li>List item 2</li></ul>';
    
    mockParse.mockResolvedValue(parsedHtml);
    mockSanitizeHtml.mockReturnValue(parsedHtml);

    const result = await parseMarkdown(markdown);

    expect(result).toBe(parsedHtml);
  });
});
