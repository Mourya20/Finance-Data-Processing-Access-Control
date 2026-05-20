const DEV_PROXY_BASE = '/api';
const PROD_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const BASE_URL = import.meta.env.DEV ? DEV_PROXY_BASE : PROD_BASE;

function buildUrl(path) {
  // Ensure path starts with '/'
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${p}`;
}

function getAuthHeaders() {
  const token = localStorage.getItem('finance_frontend_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(buildUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers
    },
    ...options
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.error || payload?.message || 'Request failed';
    throw new Error(message);
  }

  return payload;
}

export function buildQuery(params) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value);
    }
  });
  return searchParams.toString() ? `?${searchParams}` : '';
}
