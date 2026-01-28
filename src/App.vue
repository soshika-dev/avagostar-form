<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth.js';
import AppHeader from './components/AppHeader.vue';

const auth = useAuthStore();
const route = useRoute();

const showHeader = computed(() => auth.isAuthenticated && route.name !== 'login');
</script>

<template>
  <div class="min-h-screen" dir="rtl">
    <AppHeader v-if="showHeader" />
    <main class="px-4 pb-10 pt-6">
      <RouterView />
    </main>
  </div>
</template>
