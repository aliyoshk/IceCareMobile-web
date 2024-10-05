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
    throw new Error(error.message);
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

export const getBankByNameUseCase = async (bankName) => {
  try {
    return await dashboardRepository.getBankByName(bankName);
  } 
  catch (error) {
    console.error('Error in dashboardUseCase: getBankByNameUseCase', error.message);
    throw new Error(error.message || 'An error occurred while fetching the bank by name');
  }
};

export const getPendingRegistration = async() => {
  try {
    return await dashboardRepository.getPendingRegistration();
  } 
  catch (error) {
    console.error('Error in dashboardUseCase: getPendingRegistration', error);
    throw new Error(error.message);
  }
};

export const attestRegistration = async (attestRegistrationRequest) => {
  try {
    console.log('dashboardUseCase', attestRegistrationRequest);
    const response = await dashboardRepository.attestRegistration(attestRegistrationRequest);
    console.log('Response from API:', response);
    return response;
  } 
  catch (error) {
    console.log('Error in dashboardUseCase: attestRegistration', error);
    throw new Error(error.message || 'An error occurred adding attestRegistration record');
  }
};

export const getApprovedUsers = async() => {
  try {
    return await dashboardRepository.getApprovedUsers();
  } 
  catch (error) {
    console.error('Error in dashboardUseCase: getApprovedUsers', error);
    throw new Error(error.message);
  }
};

export const getRejectedUsers = async() => {
  try {
    return await dashboardRepository.getRejectedUsers();
  } 
  catch (error) {
    console.error('Error in dashboardUseCase: getRejectedUsers', error);
    throw new Error(error.message);
  }
};

export const getPendingTransfer = async() => {
  try {
    return await dashboardRepository.getPendingTransfer();
  } 
  catch (error) {
    console.error('Error in dashboardUseCase: getPendingTransfer', error);
    throw new Error(error.message);
  }
};

export const getApprovedTransfer = async() => {
  try {
    return await dashboardRepository.getApprovedTransfer();
  } 
  catch (error) {
    console.error('Error in dashboardUseCase: getApprovedTransfer', error);
    throw new Error(error.message);
  }
};

export const approveTransfer = async (approveTransferRequest) => {
  try {
    console.log('dashboardUseCase', approveTransferRequest);
    const response = await dashboardRepository.approveTransfer(approveTransferRequest);
    console.log('Response from API:', response);
    return response;
  } 
  catch (error) {
    console.log('Error in dashboardUseCase: approveTransfer', error);
    throw new Error(error.message || 'An error occurred adding approveTransfer record');
  }
};

export const addAdminUseCase = async (adminRequest) => {
  try {
    console.log('dashboardUseCase', adminRequest);
    const response = await dashboardRepository.addAdmin(adminRequest);
    console.log('Response from API:', response);
    return response;
  } 
  catch (error) {
    console.log('Error in dashboardUseCase: addAdminUseCase', error);
    throw new Error(error.message || 'An error occurred adding admin record');
  }
};

export const getAdminsUseCase = async() => {
  try {
    return await dashboardRepository.getAdmins();
  } 
  catch (error) {
    console.error('Error in dashboardUseCase: getAdminsUseCase', error);
    throw new Error(error.message);
  }
};

export const deleteAdminUseCase = async (id) => {
  try {
    return await dashboardRepository.deleteAdmin(id);
  } 
  catch (error) {
    console.error('Error in dashboardUseCase: deleteAdmin', error.message);
    throw new Error(error.message || 'An error occurred on delete admin');
  }
};

export const deleteSupplierUseCase = async (id) => {
  try {
    return await dashboardRepository.deleteSupplier(id);
  } 
  catch (error) {
    console.error('Error in dashboardUseCase: deleteSupplierUseCase', error.message);
    throw new Error(error.message || 'An error occurred on delete supplier');
  }
};

export const deleteCustomerUseCase = async (id) => {
  try {
    return await dashboardRepository.deleteCustomer(id);
  } 
  catch (error) {
    console.error('Error in dashboardUseCase: deleteCustomer', error.message);
    throw new Error(error.message || 'An error occurred on delete customer');
  }
};

export const deletePaymentUseCase = async (id) => {
  try {
    return await dashboardRepository.deletePayment(id);
  } 
  catch (error) {
    console.error('Error in dashboardUseCase: deletePayment', error.message);
    throw new Error(error.message || 'An error occurred on delete payment');
  }
};

export const deleteBankUseCase = async (id) => {
  try {
    return await dashboardRepository.deleteBank(id);
  } 
  catch (error) {
    console.error('Error in dashboardUseCase: deleteBank', error.message);
    throw new Error(error.message || 'An error occurred on delete bank');
  }
};

export const addCompanyAccountUseCase = async (accountRequest) => {
  try {
    console.log('dashboardUseCase', accountRequest);
    const response = await dashboardRepository.addCompanyAccount(accountRequest);
    console.log('Response from API:', response);
    return response;
  } 
  catch (error) {
    console.log('Error in dashboardUseCase: addCompanyAccountUseCase', error);
    throw new Error(error.message || 'An error occurred adding account');
  }
};

export const addCompanyPhoneUseCase = async (phoneNumber) => {
  try {
    console.log('dashboardUseCase', phoneNumber);
    const response = await dashboardRepository.addCompanyPhoneNumber(phoneNumber);
    console.log('Response from API:', response);
    return response;
  } 
  catch (error) {
    console.log('Error in dashboardUseCase: addCompanyPhoneUseCase', error);
    throw new Error(error.message || 'An error occurred adding phone');
  }
};

export const completeCustomerPaymentUseCase = async (customerPaymentRequest) => {
  try {
    console.log('dashboardUseCase', customerPaymentRequest);
    const response = await dashboardRepository.completeCustomerPayment(customerPaymentRequest);
    console.log('Response from API:', response);
    return response;
  } 
  catch (error) {
    console.log('Error in dashboardUseCase: completeCustomerPaymentUseCase', error);
    throw new Error(error.message || 'An error occurred adding customer payment');
  }
};

export const deleteCompanyAccountUseCase = async (id) => {
  try {
    return await dashboardRepository.deleteCompanyAccount(id);
  } 
  catch (error) {
    console.error('Error in dashboardUseCase: deleteCompanyAccount', error.message);
    throw new Error(error.message || 'An error occurred on deleteCompanyAccount');
  }
};