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

};
