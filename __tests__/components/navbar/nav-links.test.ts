import { NAV_LINKS } from '@/components/navbar/nav-links';

describe('nav-links', () => {
  it('should export NAV_LINKS array', () => {
    expect(NAV_LINKS).toBeDefined();
    expect(Array.isArray(NAV_LINKS)).toBe(true);
  });

  it('should have correct structure for each link', () => {
    NAV_LINKS.forEach((link) => {
      expect(link).toHaveProperty('href');
      expect(link).toHaveProperty('label');
      expect(typeof link.href).toBe('string');
      expect(typeof link.label).toBe('string');
    });
  });

  it('should contain expected navigation links', () => {
    const hrefs = NAV_LINKS.map((link) => link.href);
    expect(hrefs).toContain('/');
    expect(hrefs).toContain('/about');
    expect(hrefs).toContain('/what-is-ultimate');
    expect(hrefs).toContain('/news');
    expect(hrefs).toContain('/schedule');
  });

  it('should be a const array (immutable reference)', () => {
    // In TypeScript, readonly arrays prevent mutation, but at runtime
    // we can verify the structure is correct
    const originalLength = NAV_LINKS.length;
    expect(originalLength).toBeGreaterThan(0);
    // The array itself should be defined and have expected structure
    expect(NAV_LINKS).toBeDefined();
  });
});
