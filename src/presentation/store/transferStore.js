import { defineStore } from 'pinia';

export const useTransferStore = defineStore('customer', {
  state: () => ({
    selectedCustomer: null,
    bankDetails: null,
    receipt: null
  }),
  actions: {
    setSelectedCustomer(customer) {
      this.selectedCustomer = customer;
      this.bankDetails = customer.bankDetails || null;
      this.receipt = customer.receipt || null;
    },
    clearSelectedCustomer() {
      this.selectedCustomer = null;
      this.bankDetails = null;
      this.receipt = null;
    }
  }
});
