import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { apiClient } from '../services/apiClient.js';
import { apiConfig } from '../services/apiConfig.js';

const currencies = ['IRR', 'IRT', 'USD', 'EUR', 'AED', 'TRY'];
const paymentMethods = [
  { value: 'cash', label: 'نقدی' },
  { value: 'account', label: 'حسابی/واریز' },
];

const normalizeTransaction = (item) => ({
  id: item.id || item._id || `tx-${Date.now()}`,
  receiver: item.receiver || {
    type: item.receiverType || 'individual',
    name: item.receiverName || item.receiver_title || '',
    id: item.receiverId || item.receiver_identifier || '',
  },
  payer: item.payer || {
    type: item.payerType || 'individual',
    name: item.payerName || item.payer_title || '',
    id: item.payerId || item.payer_identifier || '',
  },
  paymentMethod: item.paymentMethod || item.payment_method || 'cash',
  currency: item.currency || 'IRR',
  amount: Number(item.amount || 0),
  description: item.description || '',
  datetimeISO: item.datetimeISO || item.date || item.datetime || '',
});

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref([]);
  const loading = ref(false);
  const error = ref('');

  const fetchTransactions = async () => {
    loading.value = true;
    error.value = '';
    try {
      const payload = await apiClient.request(apiConfig.transactions.list);
      const items = payload.data || payload.transactions || payload || [];
      transactions.value = Array.isArray(items) ? items.map(normalizeTransaction) : [];
    } catch (err) {
      error.value = err.message;
      transactions.value = [];
    } finally {
      loading.value = false;
    }
  };

  const addTransaction = async (payload) => {
    loading.value = true;
    error.value = '';
    try {
      const result = await apiClient.request(apiConfig.transactions.create, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const normalized = normalizeTransaction(result.data || result.transaction || result);
      transactions.value.unshift(normalized);
      return { ok: true, transaction: normalized };
    } catch (err) {
      error.value = err.message;
      return { ok: false, message: err.message };
    } finally {
      loading.value = false;
    }
  };

  const totalAmount = computed(() =>
    transactions.value.reduce((sum, item) => sum + item.amount, 0),
  );

  return {
    transactions,
    loading,
    error,
    currencies,
    paymentMethods,
    fetchTransactions,
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
