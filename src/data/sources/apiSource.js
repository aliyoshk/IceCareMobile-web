import { authService } from '../../core/api/authService';
import { handleApiError } from '../../core/utils/errorHandler';
import { supplierRequest } from '@/data/model/supplierRequest';

export const apiSource = {

  async login(email, password) {
    try {
      const response = await authService.login(email, password);
      return response.data;
    } 
    catch (error) {
      console.error('Error in apiSource login:', error);
      handleApiError(error);
    }
  },

  async getDashboardData() {
    try {
      const response = await authService.getDashboardData();
      return response.data;
    } 
    catch (error) {
      console.error('Error in apiSource getDashboardData:', error);
      handleApiError(error);
    }
  },

  async updateDollarRate(newDollarRate){
    try{
      const response = await authService.updateDollarRate(newDollarRate);
      return response.data;
    }
    catch (error) {
      console.error('Error in apiSource updateDollarRate:', error);
      handleApiError(error);
    }
  },

  async getSuppliers(){
    try{
      const response = await authService.getSuppliers();
      return response;
    }
    catch (error) {
      console.error('Error in apiSource getSuppliers:', error);
      handleApiError(error);
    }
  },

  async addSupplier(supplierRequest) {
    try {
      console.log('apiSource', supplierRequest);
      const response = await authService.addSupplier(supplierRequest);
      return response;
    } 
    catch (error) {
      console.error('Error in apiSource addSupplier:', error);
      handleApiError(error);
    }
  },

  async getCustomers(){
    try{
      const response = await authService.getCustomers();
      return response;
    }
    catch (error) {
      console.error('Error in apiSource getCustomers:', error);
      handleApiError(error);
    }
  },

  async addCustomer(customerRequest) {
    try {
      console.log('apiSource', customerRequest);
      const response = await authService.addCustomer(customerRequest);
      return response;
    } 
    catch (error) {
      console.error('Error in apiSource addCustomer:', error);
      handleApiError(error);
    }
  },

  async getBanks(){
    try{
      const response = await authService.getBanks();
      return response;
    }
    catch (error) {
      console.error('Error in apiSource getBanks:', error);
      handleApiError(error);
    }
  },

  async addBank(bankRequest) {
    try {
      console.log('apiSource', bankRequest);
      const response = await authService.addBank(bankRequest);
      return response;
    } 
    catch (error) {
      console.error('Error in apiSource addBank:', error);
      handleApiError(error);
    }
  },

  async getPayments(){
    try{
      const response = await authService.getPayments();
      console.log('apiSource: getpayment', response);
      return response.data;
    }
    catch (error) {
      console.error('Error in apiSource getPayments:', error);
      handleApiError(error);
    }
  },

  async addPayment(paymentRequest) {
    try {
      console.log('apiSource', paymentRequest);
      const response = await authService.addPayment(paymentRequest);
      return response;
    } 
    catch (error) {
      console.error('Error in apiSource addPayment:', error);
      handleApiError(error);
    }
  },

  async getBankByName(bankName) {
    try {
      const response = await authService.getBankByName(bankName);
      return response.data;
    } 
    catch (error) {
      console.error('Error in apiSource getBankByName:', error);
      handleApiError(error);
    }
  },


  async getPendingRegistration() {
    try{
      const response = await authService.getPendingRegistration();
      console.log('apiSource: getPendingRegistration', response);
      return response.data;
    }
    catch (error) {
      console.error('Error in apiSource getPendingRegistration:', error);
      handleApiError(error);
    }
  },

  async attestRegistration(attestRegistrationRequest) {
    try {
      console.log('apiSource', attestRegistrationRequest);
      const response = await authService.attestRegistration(attestRegistrationRequest);
      return response;
    } 
    catch (error) {
      console.error('Error in apiSource attestRegistrationRequest:', error);
      handleApiError(error);
    }
  },

  async deleteUser(id) {
    try {
      const response = await authService.deleteUser(id);
      return response.data;
    } 
    catch (error) {
      console.error('Error in apiSource deleteUser:', error);
      handleApiError(error);
    }
  },

  async getApprovedUsers() {
    try{
      const response = await authService.getApprovedUsers();
      console.log('apiSource: getApprovedUsers', response);
      return response.data;
    }
    catch (error) {
      console.error('Error in apiSource getApprovedUsers:', error);
      handleApiError(error);
    }
  },

  async getRejectedUsers() {
    try{
      const response = await authService.getRejectedUsers();
      console.log('apiSource: getRejectedUsers', response);
      return response.data;
    }
    catch (error) {
      console.error('Error in apiSource getRejectedUsers:', error);
      handleApiError(error);
    }
  },

  async getPendingTransfer() {
    try{
      const response = await authService.getPendingTransfer();
      console.log('apiSource: getPendingTransfer', response);
      return response.data;
    }
    catch (error) {
      console.error('Error in apiSource getPendingTransfer:', error);
      handleApiError(error);
    }
  },

  async getApprovedTransfer() {
    try{
      const response = await authService.getApprovedTransfer();
      console.log('apiSource: getApprovedTransfer', response);
      return response.data;
    }
    catch (error) {
      console.error('Error in apiSource getApprovedTransfer:', error);
      handleApiError(error);
    }
  },

  async approveTransfer(approveTransferRequest) {
    try {
      console.log('apiSource', approveTransferRequest);
      const response = await authService.approveTransfer(approveTransferRequest);
      return response;
    } 
    catch (error) {
      console.error('Error in apiSource approveTransfer:', error);
      handleApiError(error);
    }
  },

  async approveThirdPartyTransfer(id) {
    try {
      console.log('apiSource', id);
      const response = await authService.approveThirdPartyTransfer(id);
      return response;
    } 
    catch (error) {
      console.error('Error in apiSource approveThirdPartyTransfer:', error);
      handleApiError(error);
    }
  },

  async addAdmin(adminRequest) {
    try {
      console.log('apiSource', adminRequest);
      const response = await authService.addAdmin(adminRequest);
      return response;
    } 
    catch (error) {
      console.error('Error in apiSource addAdmin:', error);
      handleApiError(error);
    }
  },

  async getAdmins() {
    try {
      const response = await authService.getAdmins();
      return response.data;
    } 
    catch (error) {
      console.error('Error in apiSource getAdmins:', error);
      handleApiError(error);
    }
  },

  async deleteAdmin(id) {
    try {
      const response = await authService.deleteAdmin(id);
      return response.data;
    } 
    catch (error) {
      console.error('Error in apiSource deleteAdmin:', error);
      handleApiError(error);
    }
  },

  async deleteSupplier(id) {
    try {
      const response = await authService.deleteSupplier(id);
      return response.data;
    } 
    catch (error) {
      console.error('Error in apiSource deleteSupplier:', error);
      handleApiError(error);
    }
  },

  async deleteCustomer(id) {
    try {
      const response = await authService.deleteCustomer(id);
      return response.data;
    } 
    catch (error) {
      console.error('Error in apiSource deleteCustomer:', error);
      handleApiError(error);
    }
  },

  async deletePayment(id) {
    try {
      const response = await authService.deletePayment(id);
      return response.data;
    } 
    catch (error) {
      console.error('Error in apiSource deletePayment:', error);
      handleApiError(error);
    }
  },

  async deleteBank(id) {
    try {
      const response = await authService.deleteBank(id);
      return response.data;
    } 
    catch (error) {
      console.error('Error in apiSource deleteBank:', error);
      handleApiError(error);
    }
  },

  async addCompanyAccount(accountRequest) {
    try {
      console.log('apiSource', accountRequest);
      const response = await authService.addCompanyAccount(accountRequest);
      return response;
    } 
    catch (error) {
      console.error('Error in apiSource addCompanyAccount:', error);
      handleApiError(error);
    }
  },

  async addCompanyPhoneNumber(phoneNumbeRequest) {
    try {
      console.log('apiSource', phoneNumbeRequest);
      const response = await authService.addCompanyPhoneNumber(phoneNumbeRequest);
      return response;
    } 
    catch (error) {
      console.error('Error in apiSource addCompanyPhoneNumber:', error);
      handleApiError(error);
    }
  },

  async completeCustomerPayment(customerPaymentRequest) {
    try {
      console.log('apiSource', customerPaymentRequest);
      const response = await authService.completeCustomerPayment(customerPaymentRequest);
      return response;
    } 
    catch (error) {
      console.error('Error in apiSource completeCustomerPayment:', error);
      handleApiError(error);
    }
  },

  async deleteCompanyAccount(id) {
    try {
      const response = await authService.deleteCompanyAccount(id);
      return response.data;
    } 
    catch (error) {
      console.error('Error in apiSource deleteCompanyAccount:', error);
      handleApiError(error);
    }
  },
  
};

