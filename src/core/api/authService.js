import apiClient from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';
import { supplierRequest } from '@/data/model/supplierRequest';

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

  // Add more auth-related services as needed
};
