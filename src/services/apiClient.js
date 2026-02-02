import { apiConfig } from './apiConfig.js';

const authStorageKey = 'avagostar-auth';

const buildUrl = (path) => {
  if (!path) return apiConfig.baseUrl;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${apiConfig.baseUrl.replace(/\\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
};

const parseJson = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await response.text();
    return text ? { message: text } : {};
  }
  return response.json();
};

export const apiClient = {
  async request(path, options = {}) {
    const token = localStorage.getItem(authStorageKey);
    const response = await fetch(buildUrl(path), {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
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
