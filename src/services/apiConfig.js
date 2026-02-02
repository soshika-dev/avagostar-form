export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
  auth: {
    login: import.meta.env.VITE_API_LOGIN_PATH || '/api/v1/auth/login',
    requestReset: import.meta.env.VITE_API_RESET_REQUEST_PATH || '/auth/forgot-password',
    resetPassword: import.meta.env.VITE_API_RESET_PASSWORD_PATH || '/auth/reset-password',
    me: import.meta.env.VITE_API_ME_PATH || '/auth/me',
  },
  transactions: {
    list: import.meta.env.VITE_API_TRANSACTIONS_PATH || '/api/v1/transactions',
    create: import.meta.env.VITE_API_TRANSACTIONS_CREATE_PATH || '/api/v1/transactions',
  },
};
