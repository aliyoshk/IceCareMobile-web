import apiClient from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

export const authService = {
  
  async login(email, password) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, { email, password });
      return response;
    } 
    catch (error) {
      console.error('Error in authService login:', error);
      throw error;
    }
  },

  async getDashboardData() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DASHBOARD);
      return response;
    } 
    catch (error) {
      console.error('Error in authService getDashboardData:', error);
      throw error;
    }
  },
  
  async updateDollarRate(newDollarRate) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.UPDATE_DOLLAR_RATE, {newDollarRate});
      return response;
    } 
    catch (error) {
      console.error('Error in authService updateDollarRate:', error);
      throw error;
    }
  },

  async getSuppliers() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_SUPPLIERS);
      return response;
    } 
    catch (error) {
      console.error('Error in authService getSuppliers:', error);
      throw error;
    }
  },

  async addSupplier(supplierRequest) {
    try {
      console.log('Sending supplierRequest:', supplierRequest);
      const response = await apiClient.post(API_ENDPOINTS.ADD_SUPPLIER, supplierRequest);
      return response;
    } 
    catch (error) {
      console.error('Error in authService addSupplier:', error);
      throw error;
    }
  },
  
  async getCustomers() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_CUSTOMERS);
      return response;
    } 
    catch (error) {
      console.error('Error in authService getCustomers:', error);
      throw error;
    }
  },

  async addCustomer(customerRequest) {
    try {
      console.log('Sending customerRequest:', customerRequest);
      const response = await apiClient.post(API_ENDPOINTS.ADD_CUSTOMER, customerRequest);
      return response;
    } 
    catch (error) {
      console.error('Error in authService addCustomer:', error);
      throw error;
    }
  },

  async getBanks() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_BANKS);
      return response;
    } 
    catch (error) {
      console.error('Error in authService getBanks:', error);
      throw error;
    }
  },

  async addBank(bankRequest) {
    try {
      console.log('Sending bankRequest:', bankRequest);
      const response = await apiClient.post(API_ENDPOINTS.ADD_BANK, bankRequest);
      return response;
    } 
    catch (error) {
      console.error('Error in authService bankRequest:', error);
      throw error;
    }
  },

  async getPayments() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_PAYMENTS);
      return response;
    } 
    catch (error) {
      console.error('Error in authService getPayments:', error);
      throw error;
    }
  },

  async addPayment(paymentRequest) {
    try {
      console.log('Sending paymentRequest:', paymentRequest);
      const response = await apiClient.post(API_ENDPOINTS.ADD_PAYMENT, paymentRequest);
      return response;
    } 
    catch (error) {
      console.error('Error in authService addPayment:', error);
      throw error;
    }
  },

  async getBankByName(bankName) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_BANK_BY_NAME(bankName));
      return response;
    } 
    catch (error) {
      console.error('Error in authService getBankByName:', error);
      throw error;
    }
  },

  async getPendingRegistration() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_PENDING_REGISTRATION);
      return response;
    } 
    catch (error) {
      console.error('Error in authService getPendingRegistration:', error);
      throw error;
    }
  },

  async attestRegistration(attestRegistrationRequest) {
    try {
      console.log('Sending attestRegistration:', attestRegistrationRequest);
      const response = await apiClient.post(API_ENDPOINTS.REGISTRATION_ACTION, attestRegistrationRequest);
      return response;
    } 
    catch (error) {
      console.error('Error in authService attestRegistration:', error);
      throw error;
    }
  },

  async deleteUser(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.DELETE_USER(id));
      return response;
    } 
    catch (error) {
      console.error('Error in authService deleteUser:', error);
      throw error;
    }
  },

  async getApprovedUsers() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_APPROVE_CUSTOMERS);
      return response;
    } 
    catch (error) {
      console.error('Error in authService getApprovedUsers:', error);
      throw error;
    }
  },

  async getRejectedUsers() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_REJECTED_CUSTOMERS);
      return response;
    } 
    catch (error) {
      console.error('Error in authService getRejectedUsers:', error);
      throw error;
    }
  },

  async getPendingTransfer() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_PENDING_TRANSFER);
      return response;
    } 
    catch (error) {
      console.error('Error in authService getPendingTransfer:', error);
      throw error;
    }
  },

  async getApprovedTransfer() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_APPROVED_TRANSFER);
      return response;
    } 
    catch (error) {
      console.error('Error in authService getApprovedTransfer:', error);
      throw error;
    }
  },

  async approveTransfer(approveTransferRequest) {
    try {
      console.log('Sending approveTransfer:', approveTransferRequest);
      const response = await apiClient.post(API_ENDPOINTS.APPROVE_TRANSFER, approveTransferRequest);
      return response;
    } 
    catch (error) {
      console.error('Error in authService approveTransfer:', error);
      throw error;
    }
  },

  async approveThirdPartyTransfer(id) {
    try {
      console.log('approveThirdPartyTransfer approveTransfer:', id);
      const response = await apiClient.post(API_ENDPOINTS.APPROVE_THIRD_PARTY_TRANSFER, id);
      return response;
    } 
    catch (error) {
      console.error('Error in authService approveThirdPartyTransfer:', error);
      throw error;
    }
  },

  async addAdmin(adminRequest) {
    try {
      console.log('Sending adminRequest:', adminRequest);
      const response = await apiClient.post(API_ENDPOINTS.ADD_ADMIN, adminRequest);
      return response;
    } 
    catch (error) {
      console.error('Error in authService adminRequest:', error);
      throw error;
    }
  },

  async getAdmins() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_ADMINS);
      return response;
    } 
    catch (error) {
      console.error('Error in authService getAdmins:', error);
      throw error;
    }
  },

  async deleteAdmin(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.DELETE_ADMIN(id));
      return response;
    } 
    catch (error) {
      console.error('Error in authService deleteAdmin:', error);
      throw error;
    }
  },

  async deleteSupplier(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.DELETE_SUPPLIER(id));
      return response;
    } 
    catch (error) {
      console.error('Error in authService deleteSupplier:', error);
      throw error;
    }
  },

  async deleteCustomer(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.DELETE_CUSTOMER(id));
      return response;
    } 
    catch (error) {
      console.error('Error in authService deleteCustomer:', error);
      throw error;
    }
  },


  async deletePayment(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.DELETE_PAYMENT(id));
      return response;
    } 
    catch (error) {
      console.error('Error in authService deletePayment:', error);
      throw error;
    }
  },

  async deleteBank(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.DELETE_BANK(id));
      return response;
    } 
    catch (error) {
      console.error('Error in authService deleteBank:', error);
      throw error;
    }
  },

  async addCompanyAccount(accountRequest) {
    try {
      console.log('Sending addCompanyAccount:', accountRequest);
      const response = await apiClient.post(API_ENDPOINTS.ADD_COMPANY_ACCOUNTS, accountRequest);
      return response;
    } 
    catch (error) {
      console.error('Error in authService addCompanyAccount:', error);
      throw error;
    }
  },

  async addCompanyPhoneNumber(phoneNumbeRequest) {
    try {
      console.log('Sending adminRequest:', phoneNumbeRequest);
      const response = await apiClient.post(API_ENDPOINTS.ADD_COMPANY_NUMBERS, phoneNumbeRequest);
      return response;
    } 
    catch (error) {
      console.error('Error in authService addCompanyPhoneNumber:', error);
      throw error;
    }
  },

  async completeCustomerPayment(customerPaymentRequest) {
    try {
      console.log('Sending customerPaymentRequest:', customerPaymentRequest);
      const response = await apiClient.post(API_ENDPOINTS.COMPLETE_CUSTOMER_PAYMENT, customerPaymentRequest);
      return response;
    } 
    catch (error) {
      console.error('Error in authService completeCustomerPayment:', error);
      throw error;
    }
  },

  async deleteCompanyAccount(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.DELETE_COMPANY_ACCOUNT(id));
      return response;
    } 
    catch (error) {
      console.error('Error in authService deleteCompanyAccount:', error);
      throw error;
    }
  },

};