import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../pages/LoginPage.vue';
import PaymentFormPage from '../pages/PaymentFormPage.vue';
import DashboardPage from '../pages/DashboardPage.vue';
import { useAuthStore } from '../stores/auth.js';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/form', name: 'form', component: PaymentFormPage },
  { path: '/dashboard', name: 'dashboard', component: DashboardPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.name !== 'login' && !auth.isAuthenticated) {
    return { name: 'login' };
  }
  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'form' };
  }
  return true;
});

export default router;
