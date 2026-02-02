import { apiConfig } from './apiConfig.js';

const authStorageKey = 'avagostar-auth';

const buildUrl = (path) => {
  if (!path) return apiConfig.baseUrl;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${apiConfig.baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
};

const parseJson = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await response.text();
    return text ? { message: text } : {};
  }
  return response.json();
};

const getStoredToken = () => {
  const rawToken = localStorage.getItem(authStorageKey) || '';
  return rawToken.replace(/^Bearer\s+/i, '').trim();
};

const getCsrfToken = () =>
  document
    .querySelector('meta[name="csrf-token"], meta[name="csrf"]')
    ?.getAttribute('content');

export const apiClient = {
  async request(path, options = {}) {
    const token = getStoredToken();
    const csrfToken = getCsrfToken();
    const response = await fetch(buildUrl(path), {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
        ...(options.headers || {}),
      },
      credentials: 'include',
      ...options,
    });

    const payload = await parseJson(response);
    if (!response.ok) {
      const message =
        payload?.message ||
        payload?.error ||
        `خطای ارتباط با سرور (${response.status})`;
      throw new Error(message);
    }
    return payload;
  },
};
