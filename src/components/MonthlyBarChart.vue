<script setup>
import { computed } from 'vue';

const props = defineProps({
  series: {
    type: Array,
    required: true,
  },
  selectedMonth: {
    type: String,
    default: '',
  },
  monthNames: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['toggle']);

const barWidth = 28;
const barGap = 10;
const height = 160;
const width = computed(() => Math.max(props.series.length * (barWidth + barGap) + 40, 320));
</script>

<template>
  <div class="app-card">
    <div class="card-body">
      <div class="flex items-start justify-between">
        <div>
          <h3 class="font-semibold">نمودار ماهانه</h3>
          <p class="text-xs text-base-content/60">کلیک روی ستون، ماه را فیلتر می‌کند.</p>
        </div>
      </div>
      <div class="mt-4 overflow-x-auto">
        <svg :width="width" :height="height" viewBox="0 0 1000 160" preserveAspectRatio="xMinYMid meet">
          <g
            v-for="(item, index) in series"
            :key="item.month"
            :transform="`translate(${20 + index * (barWidth + barGap)}, 0)`"
          >
            <rect
              :x="0"
              :y="height - 28 - item.h"
              :width="barWidth"
              :height="item.h"
              :fill="
                selectedMonth === item.month ? 'var(--chart-accent)' : 'var(--chart-primary)'
              "
              rx="6"
              class="cursor-pointer"
              @click="emit('toggle', item.month)"
            />
            <text
              :x="barWidth / 2"
              :y="height - 8"
              text-anchor="middle"
              font-size="11"
              fill="currentColor"
              class="text-base-content/70"
            >
              {{ Number(item.month) }}
            </text>
            <title>{{ monthNames[Number(item.month) - 1] }}: {{ item.label }}</title>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>
