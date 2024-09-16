import { USE_MOCK_API, API_URL } from '../../config';

export const API_BASE_URL = API_URL;

export const API_ENDPOINTS = {
  LOGIN: 'Admin/AdminLogin',
  DASHBOARD: 'Dashboard/GetDashboardData',
  UPDATE_DOLLAR_RATE: 'Dashboard/UpdateDollarRate',
  GET_SUPPLIERS: 'Supplier/GetSuppliersRecord',
  ADD_SUPPLIER: 'Supplier/AddSupplier',
  GET_CUSTOMERS: 'Customer/GetCustomersRecord',
  ADD_CUSTOMER: 'Customer/AddCustomer',
  GET_BANKS: 'Bank/GetBanksRecord',
  ADD_BANK: 'Bank/AddBankRecord',
  GET_PAYMENTS: 'Payment/GetPaymentsRecord',
  ADD_PAYMENT: 'Payment/AddPaymentRecord',
};