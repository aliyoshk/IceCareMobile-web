import { defineStore } from 'pinia';

export const useTransferStore = defineStore('customer', {
  state: () => ({
    selectedCustomer: null,
  }),
  actions: {
    setSelectedCustomer(customer) {
      this.selectedCustomer = customer;
    },
    clearSelectedCustomer() {
      this.selectedCustomer = null;
    }
  }
});
