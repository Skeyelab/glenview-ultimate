import { beforeEach, afterAll, vi, type Mock } from 'vitest';

// Mock Next.js server modules
vi.mock('next/server', () => {
  class MockNextRequest {
    public url: string;
    public method: string;
    public headers: Map<string, string>;
    public nextUrl: {
      searchParams: URLSearchParams;
    };

    constructor(url: string, init?: { method?: string; headers?: Record<string, string> }) {
      this.url = url;
      this.method = init?.method || 'GET';
      this.headers = new Map();
      const urlObj = new URL(url);
      this.nextUrl = {
        searchParams: urlObj.searchParams,
      };
    }
  }

  class MockNextResponse {
    public status: number;
    public headers: Headers;
    private _body: ArrayBuffer | string | null = null;

    constructor(body?: ArrayBuffer | string, init?: { status?: number; headers?: HeadersInit }) {
      this.status = init?.status || 200;
      this.headers = new Headers(init?.headers);
      this._body = body || null;
    }

    static json(body: unknown, init?: { status?: number }): MockNextResponse {
      const response = new MockNextResponse(JSON.stringify(body), init);
      response.headers.set('Content-Type', 'application/json');
      return response;
    }

    async json(): Promise<unknown> {
      if (this._body instanceof ArrayBuffer) {
        return JSON.parse(new TextDecoder().decode(this._body));
      }
      if (typeof this._body === 'string') {
        return JSON.parse(this._body);
      }
      return {};
    }
  }

  return {
    NextRequest: MockNextRequest,
    NextResponse: MockNextResponse,
  };
});

// Mock global fetch
global.fetch = vi.fn() as Mock;

// eslint-disable-next-line import/first -- Mocks must be before imports
import { GET } from '@/app/api/assets/[...path]/route';
// eslint-disable-next-line import/first
import { NextRequest } from 'next/server';

describe('/api/assets/[...path]', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = {
      ...originalEnv,
      DIRECTUS_URL: 'https://directus.example.com',
      DIRECTUS_STATIC_TOKEN: 'test-token-123',
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  const createRequest = (path: string[], searchParams?: Record<string, string>) => {
    const url = new URL('http://localhost/api/assets/' + path.join('/'));
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }
    return new NextRequest(url.toString());
  };

  describe('successful asset proxying', () => {
    it('should proxy asset with access token', async () => {
      const mockImageBuffer = new ArrayBuffer(8);
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'image/jpeg' }),
        arrayBuffer: async () => mockImageBuffer,
      };

      (global.fetch as Mock).mockResolvedValueOnce(mockResponse);

      const req = createRequest(['file-id-123']);
      const response = await GET(req, { params: Promise.resolve({ path: ['file-id-123'] }) });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://directus.example.com/assets/file-id-123?access_token=test-token-123',
        {
          headers: {
            Accept: 'image/*',
          },
        },
      );

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('image/jpeg');
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable');
    });

    it('should forward query parameters from request', async () => {
      const mockImageBuffer = new ArrayBuffer(8);
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'image/png' }),
        arrayBuffer: async () => mockImageBuffer,
      };

      (global.fetch as Mock).mockResolvedValueOnce(mockResponse);

      const req = createRequest(['file-id-123'], { width: '800', height: '600' });
      await GET(req, { params: Promise.resolve({ path: ['file-id-123'] }) });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('width=800'),
        expect.any(Object),
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('height=600'),
        expect.any(Object),
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('access_token=test-token-123'),
        expect.any(Object),
      );
    });

    it('should default to image/jpeg when content-type is missing', async () => {
      const mockImageBuffer = new ArrayBuffer(8);
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers(),
        arrayBuffer: async () => mockImageBuffer,
      };

      (global.fetch as Mock).mockResolvedValueOnce(mockResponse);

      const req = createRequest(['file-id-123']);
      const response = await GET(req, { params: Promise.resolve({ path: ['file-id-123'] }) });

      expect(response.headers.get('Content-Type')).toBe('image/jpeg');
    });
  });

  describe('error handling', () => {
    it('should return 400 when file ID is missing', async () => {
      const req = createRequest([]);
      const response = await GET(req, { params: Promise.resolve({ path: [] }) });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('File ID is required');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should return 500 when DIRECTUS_URL is missing', async () => {
      delete process.env.DIRECTUS_URL;

      const req = createRequest(['file-id-123']);
      const response = await GET(req, { params: Promise.resolve({ path: ['file-id-123'] }) });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Directus not configured');
    });

    it('should return 500 when DIRECTUS_STATIC_TOKEN is missing', async () => {
      delete process.env.DIRECTUS_STATIC_TOKEN;

      const req = createRequest(['file-id-123']);
      const response = await GET(req, { params: Promise.resolve({ path: ['file-id-123'] }) });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Directus token not configured');
    });

    it('should return error status when Directus fetch fails', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
      };

      (global.fetch as Mock).mockResolvedValueOnce(mockResponse);

      const req = createRequest(['file-id-123']);
      const response = await GET(req, { params: Promise.resolve({ path: ['file-id-123'] }) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Failed to fetch asset from Directus');
    });

    it('should handle fetch errors gracefully', async () => {
      (global.fetch as Mock).mockRejectedValueOnce(new Error('Network error'));

      const req = createRequest(['file-id-123']);
      const response = await GET(req, { params: Promise.resolve({ path: ['file-id-123'] }) });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Unexpected error while fetching asset');
    });
  });
});

