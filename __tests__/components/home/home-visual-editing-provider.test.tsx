import React from 'react';
import { render } from '@testing-library/react';
import { beforeEach, vi } from 'vitest';
import { HomeVisualEditingProvider } from '@/components/home/home-visual-editing-provider';

// Mock next/navigation
const mockPathname = '/';
const mockSearchParams = new URLSearchParams();
const mockUsePathname = vi.fn(() => mockPathname);
const mockUseSearchParams = vi.fn(() => mockSearchParams);

vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useSearchParams: () => mockUseSearchParams(),
}));

// Mock visual-editing
const mockApplyVisualEditing = vi.fn();
const mockIsVisualEditingEnabled = vi.fn();

vi.mock('@/lib/visual-editing', () => ({
  applyVisualEditing: (...args: unknown[]) => mockApplyVisualEditing(...args),
  isVisualEditingEnabled: (...args: unknown[]) => mockIsVisualEditingEnabled(...args),
}));

describe('HomeVisualEditingProvider', () => {
  let mockPathname: string;
  let mockSearchParams: URLSearchParams;
  const mockRemove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockPathname = '/';
    mockSearchParams = new URLSearchParams();
    mockUsePathname.mockReturnValue(mockPathname);
    mockUseSearchParams.mockReturnValue(mockSearchParams);
    mockApplyVisualEditing.mockResolvedValue({ remove: mockRemove });
    mockIsVisualEditingEnabled.mockReturnValue(false);
  });

  it('renders children', () => {
    const { getByText } = render(
      <HomeVisualEditingProvider directusUrl="https://example.com">
        <div>Test Content</div>
      </HomeVisualEditingProvider>,
    );
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('does not apply visual editing when not enabled', () => {
    mockIsVisualEditingEnabled.mockReturnValue(false);
    render(
      <HomeVisualEditingProvider directusUrl="https://example.com">
        <div>Test</div>
      </HomeVisualEditingProvider>,
    );
    expect(mockApplyVisualEditing).not.toHaveBeenCalled();
  });

  it('applies visual editing when enabled via search params', async () => {
    mockIsVisualEditingEnabled.mockReturnValue(true);
    const params = new URLSearchParams();
    params.set('visual-editing', 'true');
    mockSearchParams = params;
    mockUseSearchParams.mockReturnValue(params);

    render(
      <HomeVisualEditingProvider directusUrl="https://example.com">
        <div>Test</div>
      </HomeVisualEditingProvider>,
    );

    // Wait for useEffect to run (including the 100ms delay)
    await new Promise((resolve) => setTimeout(resolve, 150));

    expect(mockIsVisualEditingEnabled).toHaveBeenCalled();
    expect(mockApplyVisualEditing).toHaveBeenCalledWith('https://example.com');
  });

  it('calls cleanup on unmount', async () => {
    mockIsVisualEditingEnabled.mockReturnValue(true);
    const params = new URLSearchParams();
    params.set('visual-editing', 'true');
    mockSearchParams = params;
    mockUseSearchParams.mockReturnValue(params);

    const { unmount } = render(
      <HomeVisualEditingProvider directusUrl="https://example.com">
        <div>Test</div>
      </HomeVisualEditingProvider>,
    );

    // Wait for useEffect to run (including the 100ms delay)
    await new Promise((resolve) => setTimeout(resolve, 150));

    unmount();

    expect(mockRemove).toHaveBeenCalled();
  });

  it('reapplies visual editing when pathname changes', async () => {
    mockIsVisualEditingEnabled.mockReturnValue(true);
    const params = new URLSearchParams();
    params.set('visual-editing', 'true');
    mockSearchParams = params;
    mockUseSearchParams.mockReturnValue(params);

    const { rerender } = render(
      <HomeVisualEditingProvider directusUrl="https://example.com">
        <div>Test</div>
      </HomeVisualEditingProvider>,
    );

    await new Promise((resolve) => setTimeout(resolve, 150));

    // Change pathname
    mockPathname = '/about';
    mockUsePathname.mockReturnValue(mockPathname);

    rerender(
      <HomeVisualEditingProvider directusUrl="https://example.com">
        <div>Test</div>
      </HomeVisualEditingProvider>,
    );

    await new Promise((resolve) => setTimeout(resolve, 150));

    // Should be called again due to pathname change
    expect(mockApplyVisualEditing).toHaveBeenCalledTimes(2);
  });

  it('reapplies visual editing when search params change', async () => {
    mockIsVisualEditingEnabled.mockReturnValue(true);
    const params = new URLSearchParams();
    params.set('visual-editing', 'true');
    mockSearchParams = params;
    mockUseSearchParams.mockReturnValue(params);

    const { rerender } = render(
      <HomeVisualEditingProvider directusUrl="https://example.com">
        <div>Test</div>
      </HomeVisualEditingProvider>,
    );

    await new Promise((resolve) => setTimeout(resolve, 150));

    // Change search params
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('visual-editing', 'true');
    newSearchParams.set('other', 'param');
    mockSearchParams = newSearchParams;
    mockUseSearchParams.mockReturnValue(mockSearchParams);

    rerender(
      <HomeVisualEditingProvider directusUrl="https://example.com">
        <div>Test</div>
      </HomeVisualEditingProvider>,
    );

    await new Promise((resolve) => setTimeout(resolve, 150));

    // Should be called again due to search params change
    expect(mockApplyVisualEditing).toHaveBeenCalledTimes(2);
  });

  it('handles applyVisualEditing returning null', async () => {
    mockIsVisualEditingEnabled.mockReturnValue(true);
    const params = new URLSearchParams();
    params.set('visual-editing', 'true');
    mockSearchParams = params;
    mockUseSearchParams.mockReturnValue(params);
    mockApplyVisualEditing.mockResolvedValue(null);

    render(
      <HomeVisualEditingProvider directusUrl="https://example.com">
        <div>Test</div>
      </HomeVisualEditingProvider>,
    );

    // Wait for useEffect to run (including the 100ms delay)
    await new Promise((resolve) => setTimeout(resolve, 150));

    expect(mockApplyVisualEditing).toHaveBeenCalled();
  });
});
