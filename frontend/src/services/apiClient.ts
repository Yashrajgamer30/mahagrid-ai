/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – API Client
   Fetch wrapper with error normalization, CSRF, credentials.
   Never holds secrets. Configured via VITE_API_BASE_URL.
   ────────────────────────────────────────────────────────────────── */

import type { ApiErrorResponse, ApiListResponse } from '@/types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

/** Normalized API error */
export class ApiError extends Error {
  code: string;
  status: number;
  details?: Record<string, unknown>;
  requestId?: string;

  constructor(
    message: string,
    code: string,
    status: number,
    details?: Record<string, unknown>,
    requestId?: string,
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
    this.requestId = requestId;
  }
}

/** Build query string from params, omitting undefined/null values */
function buildQuery(params?: Record<string, unknown>): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

/** Core request function */
async function request<T>(
  method: string,
  path: string,
  options: {
    body?: unknown;
    params?: Record<string, unknown>;
    signal?: AbortSignal;
    timeout?: number;
  } = {},
): Promise<T> {
  const { body, params, signal, timeout = 30000 } = options;
  const url = `${BASE_URL}${path}${buildQuery(params)}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  const combinedSignal = signal
    ? AbortSignal.any([signal, controller.signal])
    : controller.signal;

  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    // CSRF header (backend should check this)
    headers['X-Requested-With'] = 'XMLHttpRequest';

    const response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: 'include',
      signal: combinedSignal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorBody: ApiErrorResponse | null = null;
      try {
        errorBody = await response.json();
      } catch {
        // Response body isn't JSON
      }

      throw new ApiError(
        errorBody?.error?.message || `Request failed: ${response.status} ${response.statusText}`,
        errorBody?.error?.code || `HTTP_${response.status}`,
        response.status,
        errorBody?.error?.details,
        errorBody?.error?.requestId,
      );
    }

    // 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('Request timed out', 'TIMEOUT', 408);
    }
    if (err instanceof TypeError) {
      throw new ApiError(
        'Network error — unable to reach the server',
        'NETWORK_ERROR',
        0,
      );
    }
    throw err;
  }
}

/* ── Convenience Methods ────────────────────────────────── */

export const api = {
  get<T>(path: string, params?: Record<string, unknown>, signal?: AbortSignal) {
    return request<T>('GET', path, { params, signal });
  },

  getList<T>(path: string, params?: Record<string, unknown>, signal?: AbortSignal) {
    return request<ApiListResponse<T>>('GET', path, { params, signal });
  },

  post<T>(path: string, body?: unknown, params?: Record<string, unknown>) {
    return request<T>('POST', path, { body, params });
  },

  put<T>(path: string, body?: unknown) {
    return request<T>('PUT', path, { body });
  },

  patch<T>(path: string, body?: unknown) {
    return request<T>('PATCH', path, { body });
  },

  delete<T = void>(path: string) {
    return request<T>('DELETE', path);
  },
};

export default api;
