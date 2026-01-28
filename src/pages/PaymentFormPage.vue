<script setup>
import { computed, reactive, ref, watch } from 'vue';
import DatePicker from 'vue3-persian-datetime-picker';
import { useTransactionsStore, formatNumber } from '../stores/transactions.js';

const transactionsStore = useTransactionsStore();

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '—';

const form = reactive({
  receiver: { type: 'individual', name: '', id: '' },
  payer: { type: 'individual', name: '', id: '' },
  paymentMethod: 'cash',
  currency: 'IRR',
  amount: 0,
  description: '',
  datetimeInput: '',
  datetimeISO: '',
});

const errors = ref([]);
const amountInput = ref('');
const toasts = ref([]);

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

const onAmountInput = (event) => {
  const raw = normalizeDigits(event.target.value);
  const cleaned = raw.replace(/[^\d.]/g, '');
  amountInput.value = cleaned;
  const num = Number(cleaned);
  form.amount = Number.isFinite(num) ? num : 0;
};

const formattedAmount = computed(() => formatNumber(form.amount || 0));

const updateISO = (value) => {
  if (!value) {
    form.datetimeISO = '';
    return;
  }
  const [datePart, timePart = '00:00'] = String(value).split(' ');
  const isoCandidate = `${datePart}T${timePart}:00`;
  const date = new Date(isoCandidate);
  form.datetimeISO = Number.isNaN(date.getTime()) ? '' : date.toISOString();
};

watch(
  () => form.datetimeInput,
  (value) => updateISO(value),
);

const validate = () => {
  const issues = [];
  if (!form.receiver.name) issues.push('نام/عنوان دریافت‌کننده الزامی است.');
  if (!form.payer.name) issues.push('نام/عنوان پرداخت‌کننده الزامی است.');
  if (!form.paymentMethod) issues.push('نوع پرداخت را انتخاب کنید.');
  if (!form.currency) issues.push('ارز را انتخاب کنید.');
  if (!form.amount || form.amount <= 0) issues.push('مبلغ باید بزرگ‌تر از صفر باشد.');
  if (!form.datetimeISO) issues.push('تاریخ و زمان را وارد کنید.');
  errors.value = issues;
  return issues.length === 0;
};

const pushToast = (message, type = 'success') => {
  const id = Date.now();
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  }, 3000);
};

const submit = () => {
  if (!validate()) {
    pushToast('لطفاً خطاهای فرم را برطرف کنید.', 'error');
    return;
  }
  transactionsStore.addTransaction({
    receiver: { ...form.receiver },
    payer: { ...form.payer },
    paymentMethod: form.paymentMethod,
    currency: form.currency,
    amount: form.amount,
    description: form.description,
    datetimeISO: form.datetimeISO,
  });
  pushToast('پرداخت با موفقیت ثبت شد.', 'success');
  reset(false);
};

const reset = (showToast = true) => {
  form.receiver.type = 'individual';
  form.receiver.name = '';
  form.receiver.id = '';
  form.payer.type = 'individual';
  form.payer.name = '';
  form.payer.id = '';
  form.paymentMethod = 'cash';
  form.currency = 'IRR';
  form.amount = 0;
  form.description = '';
  form.datetimeInput = '';
  form.datetimeISO = '';
  amountInput.value = '';
  errors.value = [];
  if (showToast) pushToast('فرم پاک شد.', 'info');
};
</script>

<template>
  <div class="page-container flex max-w-5xl flex-col gap-6">
    <header class="page-header">
      <div>
        <h2 class="page-title">فرم ثبت پرداخت</h2>
        <p class="page-subtitle">
          اطلاعات پرداخت را با دقت وارد کنید. تاریخ و زمان به صورت شمسی ثبت می‌شود.
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button class="btn btn-outline btn-sm" type="button" @click="reset">
          پاک کردن فرم
        </button>
        <button class="btn btn-primary btn-sm" type="button" @click="submit">
          ثبت پرداخت
        </button>
      </div>
    </header>

    <div class="app-card-strong">
      <div class="card-body">
        <section class="app-section">
          <h3 class="mb-4 text-sm font-semibold text-base-content/70">۱) شخص دریافت‌کننده</h3>
          <div class="flex flex-col gap-4">
            <div class="flex flex-wrap items-center gap-4">
              <span class="text-sm text-base-content/70">نوع شخص دریافت‌کننده</span>
              <label class="flex items-center gap-2 text-sm">
                <input
                  v-model="form.receiver.type"
                  class="radio radio-primary"
                  type="radio"
                  value="individual"
                />
                حقیقی
              </label>
              <label class="flex items-center gap-2 text-sm">
                <input
                  v-model="form.receiver.type"
                  class="radio radio-primary"
                  type="radio"
                  value="legal"
                />
                حقوقی
              </label>
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <label class="form-control">
                <span class="label-text">نام / عنوان</span>
                <input
                  v-model.trim="form.receiver.name"
                  class="input input-bordered"
                  placeholder="مثلاً: علی رضایی / شرکت آواگستر"
                />
              </label>
              <label class="form-control">
                <span class="label-text">شناسه (اختیاری)</span>
                <input
                  v-model.trim="form.receiver.id"
                  class="input input-bordered"
                  placeholder="کد ملی / شناسه ملی / شماره ثبت"
                />
              </label>
            </div>
          </div>
        </section>

        <section class="app-section">
          <h3 class="mb-4 text-sm font-semibold text-base-content/70">۲) شخص پرداخت‌کننده</h3>
          <div class="flex flex-col gap-4">
            <div class="flex flex-wrap items-center gap-4">
              <span class="text-sm text-base-content/70">نوع شخص پرداخت‌کننده</span>
              <label class="flex items-center gap-2 text-sm">
                <input
                  v-model="form.payer.type"
                  class="radio radio-primary"
                  type="radio"
                  value="individual"
                />
                حقیقی
              </label>
              <label class="flex items-center gap-2 text-sm">
                <input
                  v-model="form.payer.type"
                  class="radio radio-primary"
                  type="radio"
                  value="legal"
                />
                حقوقی
              </label>
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <label class="form-control">
                <span class="label-text">نام / عنوان</span>
                <input
                  v-model.trim="form.payer.name"
                  class="input input-bordered"
                  placeholder="مثلاً: سجاد احمدی / شرکت ..."
                />
              </label>
              <label class="form-control">
                <span class="label-text">شناسه (اختیاری)</span>
                <input
                  v-model.trim="form.payer.id"
                  class="input input-bordered"
                  placeholder="کد ملی / شناسه ملی / شماره ثبت"
                />
              </label>
            </div>
          </div>
        </section>

        <section class="app-section">
          <h3 class="mb-4 text-sm font-semibold text-base-content/70">۳) نوع پرداخت / ۴) نوع پول</h3>
          <div class="grid gap-4 md:grid-cols-2">
            <label class="form-control">
              <span class="label-text">نوع پرداخت</span>
              <select v-model="form.paymentMethod" class="select select-bordered">
                <option
                  v-for="method in transactionsStore.paymentMethods"
                  :key="method.value"
                  :value="method.value"
                >
                  {{ method.label }}
                </option>
              </select>
            </label>
            <label class="form-control">
              <span class="label-text">ارز</span>
              <select v-model="form.currency" class="select select-bordered">
                <option v-for="currency in transactionsStore.currencies" :key="currency" :value="currency">
                  {{ currency }}
                </option>
              </select>
            </label>
          </div>
        </section>

        <section class="app-section">
          <h3 class="mb-4 text-sm font-semibold text-base-content/70">۵) مقدار</h3>
          <div class="grid gap-4 md:grid-cols-2">
            <label class="form-control">
              <span class="label-text">مبلغ</span>
              <input
                :value="amountInput"
                class="input input-bordered"
                inputmode="decimal"
                placeholder="مثلاً: 1,500,000"
                @input="onAmountInput"
              />
              <span class="label-text-alt text-base-content/60">
                فرمت نمایشی: {{ formattedAmount }}
              </span>
            </label>
            <label class="form-control">
              <span class="label-text">واحد</span>
              <input class="input input-bordered" :value="form.currency" disabled />
            </label>
          </div>
        </section>

        <section class="app-section">
          <h3 class="mb-4 text-sm font-semibold text-base-content/70">۶) توضیحات</h3>
          <label class="form-control">
            <span class="label-text">شرح پرداخت</span>
            <textarea
              v-model.trim="form.description"
              class="textarea textarea-bordered"
              rows="3"
              placeholder="شرح پرداخت..."
            ></textarea>
          </label>
        </section>

        <section class="app-section">
          <h3 class="mb-4 text-sm font-semibold text-base-content/70">۷) تاریخ و زمان</h3>
          <div class="grid gap-4 md:grid-cols-2">
            <label class="form-control">
              <span class="label-text">تاریخ و زمان</span>
              <DatePicker
                v-model="form.datetimeInput"
                type="datetime"
                format="YYYY-MM-DD HH:mm"
                display-format="jYYYY/jMM/jDD HH:mm"
                input-class="datepicker-input"
                wrapper-class="datepicker-wrapper"
                placeholder="انتخاب تاریخ و زمان"
              />
              <span class="label-text-alt text-base-content/60">
                خروجی ISO: {{ form.datetimeISO || '—' }}
              </span>
            </label>
            <label class="form-control">
              <span class="label-text">منطقه زمانی</span>
              <input class="input input-bordered" :value="timezone" disabled />
            </label>
          </div>
        </section>

        <div v-if="errors.length" class="mt-4 rounded-lg border border-error/30 bg-error/10 p-4">
          <p class="font-semibold text-error">خطاها:</p>
          <ul class="mt-2 list-disc pr-5 text-sm text-error">
            <li v-for="(issue, index) in errors" :key="index">{{ issue }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="toast toast-top toast-end">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="alert"
        :class="{
          'alert-success': toast.type === 'success',
          'alert-error': toast.type === 'error',
          'alert-info': toast.type === 'info',
        }"
      >
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>
