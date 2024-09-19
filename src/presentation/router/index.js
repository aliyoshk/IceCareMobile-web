import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/presentation/views/Login.vue';
import Dashboard from '@/presentation/views/Dashboard.vue';
import Supplier from '@/presentation/views/Supplier.vue';
import Customer from '@/presentation/views/Customer.vue';
import { useUserStore } from '@/presentation/store/userStore';
import Payment from '@/presentation/views/Payment.vue';
import Bank from '@/presentation/views/Bank.vue';
import BackOffice from '../views/BackOffice.vue';
import Registration from '../views/Registration.vue';
import Transfer from '../views/Transfer.vue';
import AdminPanel from '../views/AdminPanel.vue';
import TransferDetails from '../views/TransferDetails.vue';

const routes = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/supplier', name: 'Supplier', component: Supplier, meta: { requiresAuth: true } },
  { path: '/customer', name: 'Customer', component: Customer, meta: { requiresAuth: true } },
  { path: '/payment', name: 'Payment', component: Payment, meta: { requiresAuth: true } },
  { path: '/bank', name: 'Bank', component: Bank, meta: { requiresAuth: true } },
  { path: '/back-office', name: 'BackOffice', component: BackOffice, meta: { requiresAuth: true } },
  { path: '/registration', name: 'Registration', component: Registration, meta: { requiresAuth: true } },
  { path: '/transfer', name: 'Transfer', component: Transfer, meta: { requiresAuth: true } },
  { path: '/admin-panel', name: 'AdminPanel', component: AdminPanel, meta: { requiresAuth: true } },
  { path: '/transfer-details', name: 'TransferDetails', component: TransferDetails, meta: { requiresAuth: true } },
  { path: '/', redirect: '/login' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticated = !!userStore.user || !!localStorage.getItem('user');

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
