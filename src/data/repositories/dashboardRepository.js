import { apiSource } from '../sources/apiSource';
import { supplierRequest } from '@/data/model/supplierRequest';

export const dashboardRepository = {

  async getDashboardData() {
    try {
      const response = await apiSource.getDashboardData();
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository.dashboardRepository:', error);
      throw new Error(error.message || 'Failed to fetch data');
    }
  },


  async updateDollarRate(newDollarRate) {
    try {
      const response = await apiSource.updateDollarRate(newDollarRate)
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository.updateDollarRate:', error);
      handleApiError(error);
    }
  },

  async getSuppliers() {
    try {
      const response = await apiSource.getSuppliers();
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository.getSuppliers:', error);
      throw new Error(error.message || 'Failed to fetch data');
    }
  },

  async addSupplier(supplierRequest) {
    try {
      console.log('dashboardRepository', supplierRequest);
      const response = await apiSource.addSupplier(supplierRequest)
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository.addSupplier:', supplierRequest, ":::::", error);
      throw new Error(error.message || 'Failed to add data');
    }
  },

  async getCustomers() {
    try {
      const response = await apiSource.getCustomers();
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository.getCustomers:', error);
      throw new Error(error.message || 'Failed to fetch data');
    }
  },

  async addCustomer(customerRequest) {
    try {
      console.log('dashboardRepository', customerRequest);
      const response = await apiSource.addCustomer(customerRequest)
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository.addCustomer:', customerRequest, ":::::", error);
      throw new Error(error.message || 'Failed to add data');
    }
  },

  async getBanks() {
    try {
      const response = await apiSource.getBanks();
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository.getBanks:', error);
      throw new Error(error.message || 'Failed to fetch data');
    }
  },

  async addBank(bankRequest) {
    try {
      console.log('dashboardRepository', bankRequest);
      const response = await apiSource.addBank(bankRequest)
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository.addBank:', bankRequest, ":::::", error);
      throw new Error(error.message || 'Failed to add data');
    }
  },

  async getPayments() {
    try {
      const response = await apiSource.getPayments();
      console.log('dashboardRepository: getpayment', response);
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository.getPayments:', error);
      throw new Error(error.message || 'Failed to fetch data');
    }
  },

  async addPayment(paymentRequest) {
    try {
      console.log('dashboardRepository', paymentRequest);
      const response = await apiSource.addPayment(paymentRequest)
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository.addPayment:', paymentRequest, ":::::", error);
      throw new Error(error.message || 'Failed to add data');
    }
  },

  async getBankByName(bankName) {
    try {
      const response = await apiSource.getBankByName(bankName);
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository getBankByName:', error.message);
      throw new Error(error.message || 'Failed to fetch bank by name');
    }
  },

  async getPendingRegistration() {
    try {
      const response = await apiSource.getPendingRegistration();
      console.log('dashboardRepository: getPendingRegistration', response);
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository.getPendingRegistration:', error);
      throw new Error(error.message || 'Failed to fetch data');
    }
  },

  async attestRegistration(attestRegistrationRequest) {
    try {
      console.log('dashboardRepository', attestRegistrationRequest);
      const response = await apiSource.attestRegistration(attestRegistrationRequest)
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository.attestRegistration:', attestRegistrationRequest, ":::::", error);
      throw new Error(error.message || 'Failed to add data');
    }
  },

  async getApprovedUsers() {
    try {
      const response = await apiSource.getApprovedUsers();
      console.log('dashboardRepository: getApprovedUsers', response);
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository.getApprovedUsers:', error);
      throw new Error(error.message || 'Failed to fetch data');
    }
  },

  async getRejectedUsers() {
    try {
      const response = await apiSource.getRejectedUsers();
      console.log('dashboardRepository: getRejectedUsers', response);
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository.getRejectedUsers:', error);
      throw new Error(error.message || 'Failed to fetch data');
    }
  },

  async deleteUser(id) {
    try {
      const response = await apiSource.deleteUser(id);
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository deleteUser:', error.message);
      throw new Error(error.message || 'Failed to delete deleteUser by id');
    }
  },

  async getPendingTransfer() {
    try {
      const response = await apiSource.getPendingTransfer();
      console.log('dashboardRepository: getPendingTransfer', response);
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository.getPendingTransfer:', error);
      throw new Error(error.message || 'Failed to fetch data');
    }
  },


  async getApprovedTransfer() {
    try {
      const response = await apiSource.getApprovedTransfer();
      console.log('dashboardRepository: getApprovedTransfer', response);
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository.getApprovedTransfer:', error);
      throw new Error(error.message || 'Failed to fetch data');
    }
  },

  async approveTransfer(approveTransferRequest) {
    try {
      console.log('dashboardRepository', approveTransferRequest);
      const response = await apiSource.approveTransfer(approveTransferRequest)
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository.approveTransfer:', approveTransferRequest, ":::::", error);
      throw new Error(error.message || 'Failed to add data');
    }
  },

  async approveThirdPartyTransfer(id) {
    try {
      console.log('dashboardRepository', id);
      const response = await apiSource.approveThirdPartyTransfer(id)
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository.approveThirdPartyTransfer:', id, ":::::", error);
      throw new Error(error.message || 'Failed to add data');
    }
  },

  async addAdmin(adminRequest) {
    try {
      console.log('dashboardRepository', adminRequest);
      const response = await apiSource.addAdmin(adminRequest)
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository.addAdmin:', adminRequest, ":::::", error);
      throw new Error(error.message || 'Failed to add admin');
    }
  },

  async getAdmins() {
    try {
      const response = await apiSource.getAdmins();
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository.getAdmins:', error);
      throw new Error(error.message || 'Failed to fetch data');
    }
  },

  async deleteAdmin(id) {
    try {
      const response = await apiSource.deleteAdmin(id);
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository deleteAdmin:', error.message);
      throw new Error(error.message || 'Failed to delete deleteAdmin by id');
    }
  },

  async deleteSupplier(id) {
    try {
      const response = await apiSource.deleteSupplier(id);
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository deleteSupplier:', error.message);
      throw new Error(error.message || 'Failed to delete deleteSupplier by id');
    }
  },

  async deleteCustomer(id) {
    try {
      const response = await apiSource.deleteCustomer(id);
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository deleteCustomer:', error.message);
      throw new Error(error.message || 'Failed to delete deleteCustomer by id');
    }
  },

  async deletePayment(id) {
    try {
      const response = await apiSource.deletePayment(id);
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository deletePayment:', error.message);
      throw new Error(error.message || 'Failed to delete deletePayment by id');
    }
  },

  async deleteBank(id) {
    try {
      const response = await apiSource.deleteBank(id);
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository deleteBank:', error.message);
      throw new Error(error.message || 'Failed to delete deleteBank by id');
    }
  },

  async addCompanyAccount(accountRequest) {
    try {
      console.log('dashboardRepository', accountRequest);
      const response = await apiSource.addCompanyAccount(accountRequest)
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository.addCompanyAccount:', accountRequest, ":::::", error);
      throw new Error(error.message || 'Failed to add account');
    }
  },

  async addCompanyPhoneNumber(phoneNumbeRequest) {
    try {
      console.log('dashboardRepository', phoneNumbeRequest);
      const response = await apiSource.addCompanyPhoneNumber(phoneNumbeRequest)
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository.addCompanyPhoneNumber:', phoneNumbeRequest, ":::::", error);
      throw new Error(error.message || 'Failed to add phone');
    }
  },

  async completeCustomerPayment(customerPaymentRequest) {
    try {
      console.log('dashboardRepository', customerPaymentRequest);
      const response = await apiSource.completeCustomerPayment(customerPaymentRequest)
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository.completeCustomerPayment:', customerPaymentRequest, ":::::", error);
      throw new Error(error.message || 'Failed to add customer payment');
    }
  },

  async deleteCompanyAccount(id) {
    try {
      const response = await apiSource.deleteCompanyAccount(id);
      return response;
    } 
    catch (error) {
      console.error('Error in dashboardRepository deleteCompanyAccount:', error.message);
      throw new Error(error.message || 'Failed to delete deleteCompanyAccount by id');
    }
  },

};

