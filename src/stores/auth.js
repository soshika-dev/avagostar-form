import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

const demoUsers = [
  { username: 'admin', password: 'admin123' },
  { username: 'user1', password: '1111' },
  { username: 'user2', password: '2222' },
];

export const useAuthStore = defineStore('auth', () => {
  const users = ref([...demoUsers]);
  const currentUser = ref(null);

  const login = (username, password) => {
    const match = users.value.find(
      (user) => user.username === username && user.password === password,
    );
    if (!match) {
      return { ok: false, message: 'اطلاعات ورود اشتباه است.' };
    }
    currentUser.value = { username: match.username };
    return { ok: true };
  };

  const logout = () => {
    currentUser.value = null;
  };

  const resetPassword = (username, code, newPassword) => {
    if (code !== '123456') {
      return { ok: false, message: 'کد تایید نادرست است.' };
    }
    const target = users.value.find((user) => user.username === username);
    if (!target) {
      return { ok: false, message: 'کاربر یافت نشد.' };
    }
    target.password = newPassword;
    return { ok: true };
  };

  const hasUser = (username) =>
    users.value.some((user) => user.username === username);

  return {
    users,
    currentUser,
    login,
    logout,
    resetPassword,
    hasUser,
    isAuthenticated: computed(() => Boolean(currentUser.value)),
  };
});
