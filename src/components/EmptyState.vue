<script setup>
defineProps({
  title: {
    type: String,
    default: 'داده‌ای برای نمایش وجود ندارد.',
  },
  description: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <div class="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-base-300 bg-base-200/60 p-6 text-center">
    <p class="text-sm font-semibold text-base-content">{{ title }}</p>
    <p v-if="description" class="text-xs text-base-content/60">{{ description }}</p>
  </div>
</template>
