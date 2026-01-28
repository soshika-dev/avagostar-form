<script setup>
import { computed } from 'vue';

const props = defineProps({
  rows: {
    type: Array,
    required: true,
  },
  sortKey: {
    type: String,
    required: true,
  },
  sortDir: {
    type: Number,
    required: true,
  },
  rowsPerPage: {
    type: Number,
    required: true,
  },
  page: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['sort', 'update:rowsPerPage', 'next', 'prev']);

const totalPages = computed(() => Math.max(1, Math.ceil(props.rows.length / props.rowsPerPage)));

const pagedRows = computed(() => {
  const start = (props.page - 1) * props.rowsPerPage;
  return props.rows.slice(start, start + props.rowsPerPage);
});

const sortIndicator = (key) => {
  if (props.sortKey !== key) return '';
  return props.sortDir === 1 ? '▲' : '▼';
};
</script>

<template>
  <div class="card bg-base-100 shadow-sm">
    <div class="card-body gap-4">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <h3 class="font-semibold">گزارش تراکنش‌ها</h3>
        <label class="form-control">
          <span class="label-text">تعداد ردیف‌ها</span>
          <select
            class="select select-bordered select-sm"
            :value="rowsPerPage"
            @change="emit('update:rowsPerPage', Number($event.target.value))"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </label>
      </div>

      <div class="overflow-x-auto">
        <table class="table table-zebra">
          <thead>
            <tr>
              <th @click="emit('sort', 'receiver')">دریافت‌کننده {{ sortIndicator('receiver') }}</th>
              <th @click="emit('sort', 'payer')">پرداخت‌کننده {{ sortIndicator('payer') }}</th>
              <th @click="emit('sort', 'amount')">مبلغ {{ sortIndicator('amount') }}</th>
              <th @click="emit('sort', 'currency')">ارز {{ sortIndicator('currency') }}</th>
              <th @click="emit('sort', 'date')">تاریخ {{ sortIndicator('date') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in pagedRows" :key="row.id">
              <td>{{ row.receiver }}</td>
              <td>{{ row.payer }}</td>
              <td>{{ row.amount }}</td>
              <td>{{ row.currency }}</td>
              <td>{{ row.date }}</td>
            </tr>
            <tr v-if="pagedRows.length === 0">
              <td colspan="5" class="text-center text-base-content/60">هیچ رکوردی یافت نشد.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-center gap-4">
        <button class="btn btn-outline btn-sm" :disabled="page <= 1" @click="emit('prev')">«</button>
        <span class="text-sm text-base-content/70">صفحه {{ page }} از {{ totalPages }}</span>
        <button class="btn btn-outline btn-sm" :disabled="page >= totalPages" @click="emit('next')">»</button>
      </div>
    </div>
  </div>
</template>
