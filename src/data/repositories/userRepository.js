import { apiSource } from '../sources/apiSource';
import { localStorageSource } from '@/data/sources/localStorage';

export const userRepository = {
  async loginUser(email, password) {
    try {
      const userData = await apiSource.login(email, password);
      
      localStorageSource.saveUserData(userData);
      return userData;
    } 
    catch (error) {
      console.error('Error in userRepository.loginUser:', error);
      throw new Error(error.message || 'Failed to login user');
    }
  },
};
