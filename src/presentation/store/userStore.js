import { defineStore } from 'pinia';
import { loginUseCase } from '../../domain/useCases/loginUseCase';
import { localStorageSource } from '@/data/sources/localStorage';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    error: null,
  }),
  actions: {
    async login(email, password) {
      try {
        const userData = await loginUseCase(email, password);

        localStorageSource.saveUserData(userData.data);
        const token = userData.data.token;
        this.user = userData.data;

        console.log('User logged in:', userData);
        console.log('Lets verify the this. user:', this.user)
      
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData.data));
        this.error = null;
      } 
      catch (error) {
        this.error = error?.message || 'An unknown error occurred';
        console.error('Login failed:', error.message);
      } 
    },
    logout() {
      this.user = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorageSource.clearUserData();
      localStorageSource.clearDashboardData();
      localStorageSource.clearComapanyAccountData();
    },
    clearError() {
      this.error = null;
    },
  },
});


export const storesManager = defineStore('admin', {
  state: () => ({
    name: '',
  }),
  actions: {
    setName(name) {
      this.name = name;
      console.log('stored admin name:', name);
    },
  },
});
