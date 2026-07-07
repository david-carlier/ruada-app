/**
 * API Client utility — a thin wrapper around fetch that always sends
 * credentials (session cookie) with every request.
 *
 * This ensures the secure HTTP-only session cookie is included in all
 * cross-origin requests to the backend API Gateway.
 */

const DEFAULT_HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
};

export interface ApiClientOptions {
  baseUrl?: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? '';
  }

  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: DEFAULT_HEADERS,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    return response.json() as Promise<T>;
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    return response.json() as Promise<T>;
  }

  async request(path: string, options: RequestInit = {}): Promise<Response> {
    return fetch(`${this.baseUrl}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        ...DEFAULT_HEADERS,
        ...options.headers,
      },
    });
  }
}

export class ApiError extends Error {
  readonly status: number;
  readonly statusText: string;

  constructor(status: number, statusText: string) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
  }
}

export const apiClient = new ApiClient();
