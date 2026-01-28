<script setup>
const props = defineProps({
  segments: {
    type: Array,
    required: true,
  },
  colors: {
    type: Array,
    required: true,
  },
});

const circumference = 2 * Math.PI * 15.91549430918954;
</script>

<template>
  <div class="card bg-base-100 shadow-sm">
    <div class="card-body">
      <div class="flex items-start justify-between">
        <div>
          <h3 class="font-semibold">توزیع ارز</h3>
          <p class="text-xs text-base-content/60">نسبت و مقدار هر ارز</p>
        </div>
      </div>
      <div class="mt-4 flex flex-wrap items-center gap-6">
        <svg width="160" height="160" viewBox="0 0 42 42" class="shrink-0" role="img" aria-label="Currency distribution">
          <circle cx="21" cy="21" r="15.9154943" fill="transparent" stroke="#e5e7eb" stroke-width="8"></circle>
          <g v-for="(seg, idx) in segments" :key="seg.currency">
            <circle
              cx="21"
              cy="21"
              r="15.9154943"
              fill="transparent"
              :stroke="colors[idx % colors.length]"
              stroke-width="8"
              :stroke-dasharray="`${(seg.percent / 100) * circumference} ${circumference - (seg.percent / 100) * circumference}`"
              :stroke-dashoffset="`-${(seg.offset / 100) * circumference}`"
              transform="rotate(-90 21 21)"
            />
          </g>
        </svg>
        <div class="flex flex-col gap-3">
          <div v-for="(seg, idx) in segments" :key="seg.currency" class="flex items-start gap-3">
            <span class="mt-1 h-3 w-3 rounded" :style="{ background: colors[idx % colors.length] }"></span>
            <div>
              <p class="text-sm font-semibold">{{ seg.currency }} — {{ seg.percentRounded }}٪</p>
              <p class="text-xs text-base-content/60">{{ seg.label }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
