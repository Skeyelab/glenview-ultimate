import { beforeEach, vi } from 'vitest'
import { isVisualEditingEnabled, applyVisualEditing, setAttr } from '@/lib/visual-editing';
import * as visualEditingModule from '@directus/visual-editing';

// Mock @directus/visual-editing
vi.mock('@directus/visual-editing', () => ({
  apply: vi.fn(),
  setAttr: vi.fn(),
}));

describe('visual-editing', () => {
  describe('isVisualEditingEnabled', () => {
    it('should return true when visual-editing param is "true"', () => {
      const searchParams = new URLSearchParams('visual-editing=true');
      expect(isVisualEditingEnabled(searchParams)).toBe(true);
    });

    it('should return false when visual-editing param is not "true"', () => {
      const searchParams = new URLSearchParams('visual-editing=false');
      expect(isVisualEditingEnabled(searchParams)).toBe(false);
    });

    it('should return false when visual-editing param is missing', () => {
      const searchParams = new URLSearchParams();
      expect(isVisualEditingEnabled(searchParams)).toBe(false);
    });

    it('should return false when visual-editing param has different value', () => {
      const searchParams = new URLSearchParams('visual-editing=yes');
      expect(isVisualEditingEnabled(searchParams)).toBe(false);
    });
  });

  describe('applyVisualEditing', () => {
    const apply = vi.mocked(visualEditingModule.apply);

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should call apply with directusUrl and options', async () => {
      const mockReturn = { remove: vi.fn(), disable: vi.fn(), enable: vi.fn() };
      apply.mockResolvedValue(mockReturn);

      const directusUrl = 'https://example.com';
      const opts = { elements: document.body, onSaved: vi.fn() };

      const result = await applyVisualEditing(directusUrl, opts);

      expect(apply).toHaveBeenCalledWith({ directusUrl, ...opts });
      expect(result).toBe(mockReturn);
    });

    it('should return empty functions when directusUrl is empty', async () => {
      const result = await applyVisualEditing('');

      expect(apply).not.toHaveBeenCalled();
      expect(result).toEqual({
        remove: expect.any(Function),
        disable: expect.any(Function),
        enable: expect.any(Function),
      });
    });

    it('should handle undefined options', async () => {
      const mockReturn = { remove: vi.fn(), disable: vi.fn(), enable: vi.fn() };
      apply.mockResolvedValue(mockReturn);

      const directusUrl = 'https://example.com';
      const result = await applyVisualEditing(directusUrl);

      expect(apply).toHaveBeenCalledWith({ directusUrl });
      expect(result).toBe(mockReturn);
    });
  });

  describe('setAttr', () => {
    it('should export setAttr from @directus/visual-editing', () => {
      const mockSetAttr = vi.mocked(visualEditingModule.setAttr);
      // setAttr is re-exported from the module, so it should be the same function
      expect(setAttr).toBe(mockSetAttr);
    });
  });
});
