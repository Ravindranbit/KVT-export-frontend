const DEFAULT_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export type ApiAuthMode = 'none' | 'any' | 'user' | 'admin';

export type ApiQueryValue = string | number | boolean | null | undefined;

export type ApiRequestOptions = Omit<RequestInit, 'body' | 'headers' | 'method'> & {
  method?: string;
  body?: unknown;
  headers?: HeadersInit;
  query?: Record<string, ApiQueryValue>;
  auth?: ApiAuthMode;
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const isBrowser = () => typeof window !== 'undefined';

const appendQuery = (url: URL, query?: Record<string, ApiQueryValue>) => {
  if (!query) {
    return url;
  }

  Object.entries(query).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      return;
    }

    url.searchParams.set(key, String(value));
  });

  return url;
};

export const buildApiUrl = (path: string, query?: Record<string, ApiQueryValue>) => {
  const url = new URL(path, DEFAULT_API_BASE_URL);
  return appendQuery(url, query).toString();
};

export const getStoredToken = (auth: ApiAuthMode = 'any') => {
  if (!isBrowser()) {
    return null;
  }

  if (auth === 'none') {
    return null;
  }

  if (auth === 'user') {
    return localStorage.getItem('userToken') || localStorage.getItem('adminToken');
  }

  if (auth === 'admin') {
    return localStorage.getItem('adminToken');
  }

  return localStorage.getItem('adminToken') || localStorage.getItem('userToken');
};

const parseResponseBody = async (response: Response) => {
  const contentType = response.headers.get('content-type') || '';

  if (response.status === 204) {
    return null;
  }

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
};

export async function apiRequest<T = unknown>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { auth = 'any', query, headers, body, method = 'GET', ...rest } = options;
  const url = buildApiUrl(path, query);
  const token = getStoredToken(auth);

  const requestHeaders = new Headers(headers);

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  let requestBody: BodyInit | undefined;

  if (body !== undefined) {
    if (body instanceof FormData || body instanceof Blob || body instanceof ArrayBuffer) {
      requestBody = body;
    } else {
      requestHeaders.set('Content-Type', 'application/json');
      requestBody = JSON.stringify(body);
    }
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: requestBody,
    ...rest,
  });

  const responseData = await parseResponseBody(response);

  if (!response.ok) {
    const message =
      responseData && typeof responseData === 'object' && 'message' in responseData
        ? String((responseData as { message?: unknown }).message || 'Request failed')
        : 'Request failed';

    throw new ApiError(message, response.status, responseData);
  }

  return responseData as T;
}

export const apiGet = <T = unknown>(path: string, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}) =>
  apiRequest<T>(path, { ...options, method: 'GET' });

export const apiPost = <T = unknown>(path: string, body?: unknown, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}) =>
  apiRequest<T>(path, { ...options, method: 'POST', body });

export const apiPatch = <T = unknown>(path: string, body?: unknown, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}) =>
  apiRequest<T>(path, { ...options, method: 'PATCH', body });

export const apiPut = <T = unknown>(path: string, body?: unknown, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}) =>
  apiRequest<T>(path, { ...options, method: 'PUT', body });

export const apiDelete = <T = unknown>(path: string, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}) =>
  apiRequest<T>(path, { ...options, method: 'DELETE' });

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
