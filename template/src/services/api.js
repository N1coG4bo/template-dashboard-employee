const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';
const AUTH_TOKEN_KEY = 'bakery_auth_token';

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

function buildUrl(path, query) {
  const target = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  if (!query || Object.keys(query).length === 0) {
    return target;
  }

  const url = new URL(target, window.location.origin);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return path.startsWith('http') ? url.toString() : `${url.pathname}${url.search}`;
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  return text || null;
}

export async function request(path, options = {}) {
  const { method = 'GET', query, body, headers = {}, signal } = options;

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const token = typeof window !== 'undefined' ? window.localStorage.getItem(AUTH_TOKEN_KEY) : null;
  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  };

  if (token && !requestHeaders.Authorization) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const payload = body && !isFormData && typeof body !== 'string' ? JSON.stringify(body) : body;
  if (!isFormData && body && !requestHeaders['Content-Type']) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers: requestHeaders,
    body: payload,
    signal,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status, data);
  }

  return data;
}

export function get(path, options = {}) {
  return request(path, { ...options, method: 'GET' });
}

export function post(path, body, options = {}) {
  return request(path, { ...options, method: 'POST', body });
}

export function put(path, body, options = {}) {
  return request(path, { ...options, method: 'PUT', body });
}

export function patch(path, body, options = {}) {
  return request(path, { ...options, method: 'PATCH', body });
}

export function del(path, options = {}) {
  return request(path, { ...options, method: 'DELETE' });
}
