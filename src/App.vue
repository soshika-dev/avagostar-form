<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth.js';
import AppHeader from './components/AppHeader.vue';

const auth = useAuthStore();
const route = useRoute();

const showHeader = computed(() => auth.isAuthenticated && route.name !== 'login');
const theme = ref(localStorage.getItem('theme') || 'avagostarLight');

const applyTheme = (value) => {
  document.documentElement.setAttribute('data-theme', value);
  document.documentElement.style.colorScheme = value === 'avagostarDark' ? 'dark' : 'light';
};

const toggleTheme = () => {
  theme.value = theme.value === 'avagostarDark' ? 'avagostarLight' : 'avagostarDark';
};

watch(theme, (value) => {
  localStorage.setItem('theme', value);
  applyTheme(value);
});

onMounted(() => {
  applyTheme(theme.value);
});
</script>

<template>
  <div class="min-h-screen bg-base-200" dir="rtl">
    <AppHeader v-if="showHeader" :theme="theme" @toggle-theme="toggleTheme" />
    <main class="px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <RouterView />
    </main>
  </div>
</template>
