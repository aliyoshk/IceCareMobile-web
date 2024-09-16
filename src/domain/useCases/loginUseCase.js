import { USE_MOCK_API } from '../../config';
import { mockUserData } from '../../data/mockData/mockUserData';
import { userRepository } from '../../data/repositories/userRepository';

export const loginUseCase = async (email, password) => {
  if (USE_MOCK_API) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === mockUserData.email && password === '123') {
          resolve({
            success: true,
            token: mockUserData.token,
            user: mockUserData,
          });
        } else {
          reject({ message: 'Invalid email or password' });
        }
      }, 500);
    });
  } 
  else {
    try {
      return await userRepository.loginUser(email, password);
    } 
    catch (error) {
      console.error('Error in loginUseCase:', error);
      throw new Error(error.message || 'An error occurred while logging in');
    }
  }
};
