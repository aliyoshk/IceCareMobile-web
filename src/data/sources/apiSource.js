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
  
};
