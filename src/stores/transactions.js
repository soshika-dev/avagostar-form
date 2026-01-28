import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

const currencies = ['IRR', 'IRT', 'USD', 'EUR', 'AED', 'TRY'];
const paymentMethods = [
  { value: 'cash', label: 'نقدی' },
  { value: 'account', label: 'حسابی/واریز' },
];

const peoplePool = [
  'علی رضایی',
  'سجاد احمدی',
  'مریم حسینی',
  'رضا کریمی',
  'فرهاد احمدی',
  'شرکت آواگستر',
  'شرکت توس',
  'شرکت شرق',
  'شرکت توسعه تجارت',
  'شرکت تدبیر',
];

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomFrom = (list) => list[randomInt(0, list.length - 1)];

const buildRandomDate = () => {
  const year = 2024 + randomInt(0, 1);
  const month = randomInt(1, 12);
  const day = randomInt(1, 28);
  const hour = randomInt(8, 20);
  const minute = randomInt(0, 59);
  return new Date(year, month - 1, day, hour, minute, 0);
};

const generateFakeTransactions = (count = 220) =>
  Array.from({ length: count }, (_, index) => {
    const date = buildRandomDate();
    const amount = randomInt(50000, 5000000);
    return {
      id: `tx-${index + 1}`,
      receiver: {
        type: Math.random() > 0.4 ? 'individual' : 'legal',
        name: randomFrom(peoplePool),
        id: String(randomInt(1000000000, 9999999999)),
      },
      payer: {
        type: Math.random() > 0.4 ? 'individual' : 'legal',
        name: randomFrom(peoplePool),
        id: String(randomInt(1000000000, 9999999999)),
      },
      paymentMethod: randomFrom(paymentMethods).value,
      currency: randomFrom(currencies),
      amount,
      description: 'پرداخت بابت قرارداد خدماتی',
      datetimeISO: date.toISOString(),
    };
  });

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref(generateFakeTransactions());

  const addTransaction = (payload) => {
    transactions.value.unshift({
      ...payload,
      id: `tx-${Date.now()}`,
    });
  };

  const totalAmount = computed(() =>
    transactions.value.reduce((sum, item) => sum + item.amount, 0),
  );

  return {
    transactions,
    currencies,
    paymentMethods,
    addTransaction,
    totalAmount,
  };
});

export const formatNumber = (value) => {
  try {
    return new Intl.NumberFormat('fa-IR').format(value);
  } catch {
    return String(value);
  }
};

export const formatPersianDate = (isoString, options = {}) => {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '—';
  try {
    return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      ...options,
    }).format(date);
  } catch {
    return date.toLocaleDateString('fa-IR');
  }
};
