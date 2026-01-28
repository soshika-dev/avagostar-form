<script setup>
defineProps({
  rows: {
    type: Number,
    default: 4,
  },
});
</script>

<template>
  <div class="flex flex-col gap-3">
    <div
      v-for="index in rows"
      :key="index"
      class="h-10 w-full animate-pulse rounded-xl bg-base-300/60"
    ></div>
  </div>
</template>
