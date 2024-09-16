// mockApi.js
export const mockLoginUseCase = async (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { email, password } = credentials;
      
      // Simulate successful login for specific credentials
      if (email === 'a@gmail.com' && password === '123') {
        resolve({
          token: 'mockedToken123',
          user: {
            id: 1,
            email: 'a@gmail.com',
            name: 'Test User',
          },
        });
      } else {
        reject(new Error('Invalid email or password.'));
      }
    }, 1000); // Simulate network delay
  });
};
