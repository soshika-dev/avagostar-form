<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <div class="app-card">
    <div class="card-body gap-2">
      <p class="text-xs font-semibold text-base-content/60">{{ title }}</p>
      <p class="text-2xl font-bold text-primary">{{ value }}</p>
      <p v-if="subtitle" class="text-xs text-base-content/50">{{ subtitle }}</p>
    </div>
  </div>
</template>
