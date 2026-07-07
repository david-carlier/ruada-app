import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiClient, ApiError } from './apiClient';

describe('ApiClient', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockReset();
  });

  describe('get', () => {
    it('sends GET request with credentials: include', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: 'test' }),
      });

      const client = new ApiClient({ baseUrl: 'http://localhost:3000' });
      await client.get('/api/test');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/test', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
    });

    it('returns parsed JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ userId: '123', name: 'Test' }),
      });

      const client = new ApiClient();
      const result = await client.get('/auth/me');

      expect(result).toEqual({ userId: '123', name: 'Test' });
    });

    it('throws ApiError on non-ok response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      const client = new ApiClient();

      await expect(client.get('/auth/me')).rejects.toThrow(ApiError);
      await expect(client.get('/auth/me')).rejects.toThrow('API Error: 401 Unauthorized');
    });
  });

  describe('post', () => {
    it('sends POST request with credentials: include and JSON body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const client = new ApiClient({ baseUrl: 'http://localhost:3000' });
      await client.post('/api/data', { key: 'value' });

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ key: 'value' }),
      });
    });

    it('sends POST request without body when body is undefined', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const client = new ApiClient();
      await client.post('/api/action');

      expect(mockFetch).toHaveBeenCalledWith('/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: undefined,
      });
    });
  });

  describe('request', () => {
    it('sends request with credentials: include and merged headers', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });

      const client = new ApiClient({ baseUrl: 'http://api.test' });
      await client.request('/custom', {
        method: 'PUT',
        headers: { 'X-Custom': 'header' },
      });

      expect(mockFetch).toHaveBeenCalledWith('http://api.test/custom', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Custom': 'header',
        },
      });
    });
  });

  describe('ApiError', () => {
    it('has correct status and statusText properties', () => {
      const error = new ApiError(403, 'Forbidden');

      expect(error.status).toBe(403);
      expect(error.statusText).toBe('Forbidden');
      expect(error.name).toBe('ApiError');
      expect(error.message).toBe('API Error: 403 Forbidden');
    });
  });
});
