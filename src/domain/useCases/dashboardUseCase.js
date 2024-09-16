import { dashboardRepository } from '../../data/repositories/dashboardRepository';
import { supplierRequest } from '@/data/model/supplierRequest';

export const fetchDashboardDataUseCase = async () => {
  try {
    return await dashboardRepository.getDashboardData();
  } 
  catch (error) {
    console.log('Error in dashboardUseCase: fetchDashboardDataUseCase', error);
    throw new Error(error.message || 'An error occurred while fetching data');
  }
};

export const updateDollarRateUseCase = async (newDollarRate) => {
  try {
    return await dashboardRepository.updateDollarRate(newDollarRate);
  } 
  catch (error) {
    console.log('Error in dashboardUseCase: updateDollarRateUseCase', error);
    throw new Error(error.message || 'An error occurred while updating dollar');
  }
};

export const getSuppliersUseCase = async() => {
  try {
    return await dashboardRepository.getSuppliers();
  } 
  catch (error) {
    console.log('Error in dashboardUseCase: getSuppliers', error);
    throw new Error(error.message || 'An error occurred while fetching data');
  }
};

export const addSupplierUseCase = async (supplierRequest) => {
  try {
    console.log('dashboardUseCase', supplierRequest);
    const response = await dashboardRepository.addSupplier(supplierRequest);
    console.log('Response from API:', response);
    return response;
  } 
  catch (error) {
    console.log('Error in dashboardUseCase: addSupplierUseCase', error);
    throw new Error(error.message || 'An error occurred adding supplier');
  }
};

export const getCustomersUseCase = async() => {
  try {
    return await dashboardRepository.getCustomers();
  } 
  catch (error) {
    console.log('Error in dashboardUseCase: getCustomers', error);
    throw new Error(error.message || 'An error occurred while fetching data');
  }
};

export const addCustomerUseCase = async (customerRequest) => {
  try {
    console.log('dashboardUseCase', customerRequest);
    const response = await dashboardRepository.addCustomer(customerRequest);
    console.log('Response from API:', response);
    return response;
  } 
  catch (error) {
    console.log('Error in dashboardUseCase: addCustomerUseCase', error);
    throw new Error(error.message || 'An error occurred adding customer');
  }
};

export const getBanksUseCase = async() => {
  try {
    return await dashboardRepository.getBanks();
  } 
  catch (error) {
    console.log('Error in dashboardUseCase: getBanks', error);
    throw new Error(error.message || 'An error occurred while fetching data');
  }
};

export const addBankUseCase = async (bankRequest) => {
  try {
    console.log('dashboardUseCase', bankRequest);
    const response = await dashboardRepository.addBank(bankRequest);
    console.log('Response from API:', response);
    return response;
  } 
  catch (error) {
    console.log('Error in dashboardUseCase: addBankUseCase', error);
    throw new Error(error.message || 'An error occurred adding bank record');
  }
};

export const getPaymentsUseCase = async() => {
  try {
    return await dashboardRepository.getPayments();
  } 
  catch (error) {
    console.error('Error in dashboardUseCase: getPayments', error);
    throw new Error(error);
  }
};


export const addPaymentUseCase = async (paymentRequest) => {
  try {
    console.log('dashboardUseCase', paymentRequest);
    const response = await dashboardRepository.addPayment(paymentRequest);
    console.log('Response from API:', response);
    return response;
  } 
  catch (error) {
    console.log('Error in dashboardUseCase: addPaymentUseCase', error);
    throw new Error(error.message || 'An error occurred adding payment record');
  }
};
