<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';

defineProps({
  theme: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['toggle-theme']);

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
  <header class="navbar sticky top-0 z-40 border-b border-base-300/70 bg-base-100/90 px-4 py-3">
    <div class="flex flex-1 flex-col gap-1">
      <h1 class="text-lg font-bold text-primary">سامانه ثبت پرداخت هوشمند</h1>
      <p class="text-sm text-base-content/60">آواگستر اندیشان شرق</p>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <button
        class="btn btn-ghost btn-sm gap-2"
        type="button"
        :aria-pressed="theme === 'avagostarDark'"
        @click="emit('toggle-theme')"
      >
        <span class="text-xs text-base-content/70">
          {{ theme === 'avagostarDark' ? 'حالت روشن' : 'حالت تاریک' }}
        </span>
      </button>
      <RouterLink
        to="/form"
        class="btn btn-ghost btn-sm"
        :class="{ 'btn-active': activeRoute === 'form' }"
      >
        فرم پرداخت
      </RouterLink>
      <RouterLink
        to="/dashboard"
        class="btn btn-ghost btn-sm"
        :class="{ 'btn-active': activeRoute === 'dashboard' }"
      >
        داشبورد
      </RouterLink>
      <button class="btn btn-outline btn-error btn-sm" type="button" @click="logout">
        خروج
      </button>
    </div>
  </header>
</template>
