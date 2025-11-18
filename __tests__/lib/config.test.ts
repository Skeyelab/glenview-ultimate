import { LOGO_ID, DEFAULT_REVALIDATE_SECONDS } from '@/lib/config';

describe('config', () => {
  it('should export LOGO_ID constant', () => {
    expect(LOGO_ID).toBe('c3db7679-c7b9-4d7d-add9-761a96e59b86');
  });

  it('should export DEFAULT_REVALIDATE_SECONDS constant', () => {
    expect(DEFAULT_REVALIDATE_SECONDS).toBe(300);
  });
});
