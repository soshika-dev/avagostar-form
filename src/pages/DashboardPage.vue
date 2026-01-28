<script setup>
import { computed, reactive, ref, watch } from 'vue';
import DatePicker from 'vue3-persian-datetime-picker';
import { useTransactionsStore, formatNumber, formatPersianDate } from '../stores/transactions.js';
import KpiCard from '../components/KpiCard.vue';
import MonthlyBarChart from '../components/MonthlyBarChart.vue';
import CurrencyDonut from '../components/CurrencyDonut.vue';
import ReportTable from '../components/ReportTable.vue';
import EmptyState from '../components/EmptyState.vue';

const store = useTransactionsStore();

const filters = reactive({
  search: '',
  dateFrom: '',
  dateTo: '',
  currency: '',
  minAmount: '',
  month: '',
});

const selectedMonth = ref('');
const page = ref(1);
const rowsPerPage = ref(10);
const sort = reactive({ key: 'date', dir: -1 });

watch(
  () => filters.month,
  (value) => {
    selectedMonth.value = value;
  },
);

const clearFilters = () => {
  filters.search = '';
  filters.dateFrom = '';
  filters.dateTo = '';
  filters.currency = '';
  filters.minAmount = '';
  filters.month = '';
  selectedMonth.value = '';
  page.value = 1;
};

const normalizeDigits = (value) => {
  const fa = '۰۱۲۳۴۵۶۷۸۹';
  const ar = '٠١٢٣٤٥٦٧٨٩';
  return String(value || '')
    .split('')
    .map((ch) => {
      const faIndex = fa.indexOf(ch);
      if (faIndex > -1) return String(faIndex);
      const arIndex = ar.indexOf(ch);
      if (arIndex > -1) return String(arIndex);
      return ch;
    })
    .join('');
};

const minAmountValue = computed(() => {
  const normalized = normalizeDigits(filters.minAmount);
  const value = Number(normalized);
  return Number.isFinite(value) ? value : 0;
});

const filteredTransactions = computed(() => {
  const searchTerm = filters.search.trim().toLowerCase();
  return store.transactions.filter((tx) => {
    if (searchTerm) {
      const receiver = tx.receiver.name.toLowerCase();
      const payer = tx.payer.name.toLowerCase();
      if (!receiver.includes(searchTerm) && !payer.includes(searchTerm)) return false;
    }
    if (filters.currency && tx.currency !== filters.currency) return false;
    if (minAmountValue.value && tx.amount < minAmountValue.value) return false;
    const dateValue = tx.datetimeISO.slice(0, 10);
    if (filters.dateFrom && dateValue < filters.dateFrom) return false;
    if (filters.dateTo && dateValue > filters.dateTo) return false;
    if (selectedMonth.value) {
      const month = dateValue.split('-')[1];
      if (month !== selectedMonth.value) return false;
    }
    return true;
  });
});

const totalAmount = computed(() =>
  filteredTransactions.value.reduce((sum, tx) => sum + tx.amount, 0),
);

const averageAmount = computed(() =>
  filteredTransactions.value.length
    ? Math.round(totalAmount.value / filteredTransactions.value.length)
    : 0,
);

const monthNames = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

const monthlySeries = computed(() => {
  const sums = Array(12).fill(0);
  filteredTransactions.value.forEach((tx) => {
    const monthIndex = new Date(tx.datetimeISO).getMonth();
    if (monthIndex >= 0) sums[monthIndex] += tx.amount;
  });
  const max = Math.max(...sums, 1);
  return sums.map((amount, index) => ({
    month: String(index + 1).padStart(2, '0'),
    amount,
    h: Math.round((amount / max) * 120 + 4),
    label: formatNumber(amount),
  }));
});

const toggleMonthFilter = (monthValue) => {
  if (selectedMonth.value === monthValue) {
    selectedMonth.value = '';
    filters.month = '';
  } else {
    selectedMonth.value = monthValue;
    filters.month = monthValue;
  }
  page.value = 1;
};

const colors = ['#005020', '#0E6A3B', '#178A4A', '#22C55E', '#059669', '#34D399'];

const currencySegments = computed(() => {
  const totals = store.currencies.reduce((acc, currency) => {
    acc[currency] = 0;
    return acc;
  }, {});
  filteredTransactions.value.forEach((tx) => {
    totals[tx.currency] += tx.amount;
  });
  const totalSum = Object.values(totals).reduce((sum, value) => sum + value, 0) || 1;
  let offset = 0;
  return Object.entries(totals)
    .map(([currency, amount]) => {
      const percent = Number(((amount / totalSum) * 100).toFixed(2));
      const segment = {
        currency,
        amount,
        percent,
        offset,
        percentRounded: Math.round(percent),
        label: formatNumber(amount),
      };
      offset += percent;
      return segment;
    })
    .filter((segment) => segment.amount > 0);
});

const sortedTransactions = computed(() => {
  const rows = [...filteredTransactions.value];
  rows.sort((a, b) => {
    if (sort.key === 'amount') {
      return (a.amount - b.amount) * sort.dir;
    }
    if (sort.key === 'date') {
      return (a.datetimeISO > b.datetimeISO ? 1 : -1) * sort.dir;
    }
    const valueA =
      sort.key === 'receiver'
        ? a.receiver.name
        : sort.key === 'payer'
          ? a.payer.name
          : a.currency;
    const valueB =
      sort.key === 'receiver'
        ? b.receiver.name
        : sort.key === 'payer'
          ? b.payer.name
          : b.currency;
    return valueA.localeCompare(valueB, 'fa') * sort.dir;
  });
  return rows;
});

const tableRows = computed(() =>
  sortedTransactions.value.map((tx) => ({
    id: tx.id,
    receiver: tx.receiver.name,
    payer: tx.payer.name,
    amount: formatNumber(tx.amount),
    currency: tx.currency,
    date: formatPersianDate(tx.datetimeISO, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
  })),
);

const sortBy = (key) => {
  if (sort.key === key) {
    sort.dir = sort.dir * -1;
  } else {
    sort.key = key;
    sort.dir = -1;
  }
};

const exportCSV = () => {
  const header = ['receiver', 'payer', 'amount', 'currency', 'date'];
  const rows = sortedTransactions.value.map((tx) => [
    tx.receiver.name,
    tx.payer.name,
    tx.amount,
    tx.currency,
    tx.datetimeISO,
  ]);
  const csv = [
    header.join(','),
    ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'transactions.csv';
  link.click();
  URL.revokeObjectURL(url);
};

const nextPage = () => {
  if (page.value < totalPages.value) page.value += 1;
};

const prevPage = () => {
  if (page.value > 1) page.value -= 1;
};

const totalPages = computed(() =>
  Math.max(1, Math.ceil(sortedTransactions.value.length / rowsPerPage.value)),
);

const updateRowsPerPage = (value) => {
  rowsPerPage.value = value;
};

watch([rowsPerPage, () => sortedTransactions.value.length], () => {
  if (page.value > totalPages.value) page.value = 1;
});
</script>

<template>
  <div class="page-container flex flex-col gap-6">
    <header class="page-header">
      <div>
        <h2 class="page-title">داشبورد پرداخت‌ها</h2>
        <p class="page-subtitle">مرور سریع وضعیت پرداخت‌ها و گزارش‌های مالی.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button class="btn btn-outline btn-sm" type="button" @click="clearFilters">پاک کردن فیلترها</button>
        <button class="btn btn-primary btn-sm" type="button" @click="exportCSV">خروجی CSV</button>
      </div>
    </header>

    <div class="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside class="app-card">
        <div class="card-body gap-4">
          <h3 class="text-base font-semibold">فیلترها</h3>
          <label class="form-control">
            <span class="label-text">جستجو (دریافت/پرداخت)</span>
            <input v-model="filters.search" class="input input-bordered" placeholder="نام یا عنوان" />
          </label>
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <label class="form-control">
              <span class="label-text">از تاریخ</span>
              <DatePicker
                v-model="filters.dateFrom"
                type="date"
                format="YYYY-MM-DD"
                display-format="jYYYY/jMM/jDD"
                input-class="datepicker-input"
                wrapper-class="datepicker-wrapper"
                placeholder="انتخاب تاریخ"
              />
            </label>
            <label class="form-control">
              <span class="label-text">تا تاریخ</span>
              <DatePicker
                v-model="filters.dateTo"
                type="date"
                format="YYYY-MM-DD"
                display-format="jYYYY/jMM/jDD"
                input-class="datepicker-input"
                wrapper-class="datepicker-wrapper"
                placeholder="انتخاب تاریخ"
              />
            </label>
          </div>
          <label class="form-control">
            <span class="label-text">ارز</span>
            <select v-model="filters.currency" class="select select-bordered">
              <option value="">همه ارزها</option>
              <option v-for="currency in store.currencies" :key="currency" :value="currency">
                {{ currency }}
              </option>
            </select>
          </label>
          <label class="form-control">
            <span class="label-text">حداقل مقدار</span>
            <input
              v-model="filters.minAmount"
              class="input input-bordered"
              inputmode="numeric"
              placeholder="مثلاً 500000"
            />
          </label>
          <label class="form-control">
            <span class="label-text">ماه</span>
            <select v-model="filters.month" class="select select-bordered">
              <option value="">همه ماه‌ها</option>
              <option v-for="(name, index) in monthNames" :key="name" :value="String(index + 1).padStart(2, '0')">
                {{ name }}
              </option>
            </select>
          </label>
        </div>
      </aside>

      <section class="grid gap-4 md:grid-cols-3">
        <KpiCard
          title="مجموع"
          :value="formatNumber(totalAmount)"
          subtitle="براساس فیلترها"
        />
        <KpiCard
          title="میانگین"
          :value="formatNumber(averageAmount)"
          subtitle="مقدار میانگین"
        />
        <KpiCard
          title="تعداد تراکنش"
          :value="formatNumber(filteredTransactions.length)"
          subtitle="نمایش‌شده"
        />
      </section>
    </div>

    <div class="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <MonthlyBarChart
        :series="monthlySeries"
        :selected-month="selectedMonth"
        :month-names="monthNames"
        @toggle="toggleMonthFilter"
      />
      <div class="grid gap-6">
        <CurrencyDonut :segments="currencySegments" :colors="colors" />
        <div class="app-card">
          <div class="card-body gap-3">
            <h3 class="font-semibold">توزیع سریع</h3>
            <div v-if="currencySegments.length" class="space-y-3">
              <div v-for="(seg, idx) in currencySegments" :key="seg.currency" class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="font-semibold">{{ seg.currency }}</span>
                  <span class="text-base-content/60">{{ seg.label }}</span>
                </div>
                <progress class="progress progress-primary" :value="seg.percent" max="100"></progress>
              </div>
            </div>
            <EmptyState v-else title="داده‌ای برای نمایش وجود ندارد." description="با ثبت تراکنش جدید، نمودارها کامل می‌شوند." />
          </div>
        </div>
      </div>
    </div>

    <ReportTable
      :rows="tableRows"
      :sort-key="sort.key"
      :sort-dir="sort.dir"
      :rows-per-page="rowsPerPage"
      :page="page"
      @sort="sortBy"
      @update:rows-per-page="updateRowsPerPage"
      @next="nextPage"
      @prev="prevPage"
    />
  </div>
</template>
