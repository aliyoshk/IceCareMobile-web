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
  DELETE_SUPPLIER: (id) => `Supplier/DeleteSupplier/${id}`,
  GET_CUSTOMERS: 'Customer/GetCustomersRecord',
  ADD_CUSTOMER: 'Customer/AddCustomer',
  DELETE_CUSTOMER: (id) => `Customer/DeleteCustomer/${id}`,
  COMPLETE_CUSTOMER_PAYMENT: 'Customer/CompleteCustomerPayment',
  GET_BANKS: 'Bank/GetBanksRecord',
  ADD_BANK: 'Bank/AddBankRecord',
  DELETE_BANK: (id) => `Bank/DeleteBank/${id}`,
  GET_PAYMENTS: 'Payment/GetPaymentsRecord',
  ADD_PAYMENT: 'Payment/AddPaymentRecord',
  DELETE_PAYMENT: (id) => `Payment/DeletePayment/${id}`,
  GET_BANK_BY_NAME: (bankName) => `Bank/GetBanksRecordByName?bankName=${bankName}`,
  GET_PENDING_REGISTRATION: 'Admin/PendingRegistrations',
  REGISTRATION_ACTION: 'Admin/ChangeUserStatus',
  DELETE_USER: (id) => `Admin/DeleteUser/${id}`,
  GET_APPROVE_CUSTOMERS: 'Admin/ApprovedUsers',
  GET_REJECTED_CUSTOMERS: 'Admin/RejectedUsers',
  GET_PENDING_TRANSFER: 'Admin/GetPendingTransfer',
  GET_APPROVED_TRANSFER: 'Admin/GetApprovedTransfer',
  APPROVE_TRANSFER: 'Admin/ConfirmTransfer',
  DELETE_TRANSFER_RECORD: (id) => `Admin/DeleteTransferRecord/${id}`,
  GET_ACCOUNT_PAYMENTS: (statusValue) => `Admin/GetAccountPayments?status=${statusValue}`,
  APPROVE_ACCOUNT_PAYMENT: (id) => `Admin/ConfirmAccountPayment?id=${id}`,
  DELETE_ACCOUNT_PAYMENT_RECORD: (id) => `Admin/DeleteAccountPaymentRecord/${id}`,
  GET_THIRD_PARTY_TRANSFER: (statusValue) => `Admin/GetThirdPartyTransfers?status=${statusValue}`,
  APPROVE_THIRD_PARTY_TRANSFER: (id) => `Admin/ComfirmThirdPartyTransfer?id=${id}`,
  DELETE_THIRD_PARTY_RECORD: (id) => `Admin/DeleteThirdPartyTransferRecord/${id}`,
  GET_ACCOUNT_TOPUPS: (statusValue) =>  `Admin/GetAccountTopUps?status=${statusValue}`,
  APPROVE_ACCOUNT_TOPUP: 'Admin/ConfirmAccountTopUp',
  DELETE_ACCOUNT_TOPUP_RECORD: (id) => `Admin/DeleteAccountTopUpRecord/${id}`,
  ADD_COMPANY_ACCOUNTS: 'Dashboard/AddCompanyAccount',
  ADD_COMPANY_NUMBERS: 'Dashboard/AddCompanyPhoneNumbers',
  DELETE_COMPANY_ACCOUNT: (id) => `Dashboard/DeleteAccount/${id}`,
};