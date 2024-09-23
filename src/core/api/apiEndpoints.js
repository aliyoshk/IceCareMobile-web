import { USE_MOCK_API, API_URL } from '../../config';

export const API_BASE_URL = API_URL;

export const API_ENDPOINTS = {
  LOGIN: 'Admin/AdminLogin',
  ADD_ADMIN: 'Admin/AddAdmin',
  GET_ADMINS: 'Admin/GetAllAdmins',
  DELETE_ADMIN: (id) => `Admin/DeleteAdmin/${id}`,
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
  GET_BANK_BY_NAME: (bankName) => `Bank/GetBanksRecordByName?bankName=${bankName}`,
  GET_PENDING_REGISTRATION: 'Admin/PendingRegistrations',
  REGISTRATION_ACTION: 'Admin/ChangeUserStatus',
  GET_APPROVE_CUSTOMERS: 'Admin/ApprovedUsers',
  GET_REJECTED_CUSTOMERS: 'Admin/RejectedUsers',
  GET_PENDING_TRANSFER: 'Admin/GetPendingTransfer',
  GET_APPROVED_TRANSFER: 'Admin/GetApprovedTransfer',
  APPROVE_TRANSFER: 'api/Admin/ConfirmTransfer',
};