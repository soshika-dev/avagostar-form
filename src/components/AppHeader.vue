<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const activeRoute = computed(() => route.name);

const logout = () => {
  auth.logout();
  router.push({ name: 'login' });
};
</script>

<template>
  <header class="navbar bg-base-100 shadow-sm border-b border-base-300 px-4">
    <div class="flex flex-1 flex-col gap-1">
      <h1 class="text-lg font-bold text-primary">سامانه ثبت پرداخت هوشمند</h1>
      <p class="text-sm text-base-content/60">آواگستر اندیشان شرق</p>
    </div>
    <div class="flex items-center gap-2">
      <RouterLink
        to="/form"
        class="btn btn-ghost"
        :class="{ 'btn-active': activeRoute === 'form' }"
      >
        فرم پرداخت
      </RouterLink>
      <RouterLink
        to="/dashboard"
        class="btn btn-ghost"
        :class="{ 'btn-active': activeRoute === 'dashboard' }"
      >
        داشبورد
      </RouterLink>
      <button class="btn btn-outline btn-error" type="button" @click="logout">
        خروج
      </button>
    </div>
  </header>
</template>
