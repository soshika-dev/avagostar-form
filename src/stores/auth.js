import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { apiClient } from '../services/apiClient.js';
import { apiConfig } from '../services/apiConfig.js';

const storageKey = 'avagostar-auth';

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(null);
  const token = ref(localStorage.getItem(storageKey) || '');

  const setSession = (payload = {}) => {
    const data = payload.data || {};
    currentUser.value =
      payload.user ||
      payload.currentUser ||
      data.user ||
      data.currentUser ||
      null;
    token.value =
      payload.token ||
      payload.accessToken ||
      payload.access_token ||
      data.token ||
      data.accessToken ||
      data.access_token ||
      token.value ||
      '';
    if (token.value) {
      localStorage.setItem(storageKey, token.value);
    } else {
      localStorage.removeItem(storageKey);
    }
  };

  const login = async (username, password) => {
    try {
      const payload = await apiClient.request(apiConfig.auth.login, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      setSession(payload);
      return { ok: true, payload };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  };

  const logout = () => {
    currentUser.value = null;
    token.value = '';
    localStorage.removeItem(storageKey);
  };

  const requestResetCode = async (username) => {
    try {
      await apiClient.request(apiConfig.auth.requestReset, {
        method: 'POST',
        body: JSON.stringify({ username }),
      });
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  };

  const resetPassword = async (username, code, newPassword) => {
    try {
      await apiClient.request(apiConfig.auth.resetPassword, {
        method: 'POST',
        body: JSON.stringify({
          username,
          code,
          password: newPassword,
        }),
      });
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  };

  const fetchCurrentUser = async () => {
    if (!token.value) return null;
    try {
      const payload = await apiClient.request(apiConfig.auth.me, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      setSession({ ...payload, token: token.value });
      return currentUser.value;
    } catch (error) {
      logout();
      return null;
    }
  };

  return {
    currentUser,
    token,
    login,
    logout,
    requestResetCode,
    resetPassword,
    fetchCurrentUser,
    isAuthenticated: computed(() => Boolean(token.value || currentUser.value)),
  };
});
