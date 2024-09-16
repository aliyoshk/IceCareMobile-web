import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../../core/api/apiEndpoints';
import { USE_MOCK_API } from '../../config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor for Adding Token to Headers
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// Response Interceptor for Handling API Responses and Errors
apiClient.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);

// Handling Mock Data or Real API Requests
if (USE_MOCK_API) {
  apiClient.interceptors.request.use(config => {
    return new Promise(resolve => setTimeout(() => resolve(config), 500));
  });

  apiClient.interceptors.request.use(config => {
    const { url, method, data } = config;

    if (url === API_ENDPOINTS.LOGIN && method === 'post') {
      const { email, password } = JSON.parse(data);
      if (email === 'admin@example.com' && password === 'password') {
        return Promise.resolve({
          data: mockUserData,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });
      } else {
        return Promise.reject({
          response: {
            data: { message: 'Invalid email or password' },
            status: 401,
            statusText: 'Unauthorized',
            headers: {},
            config,
          },
        });
      }
    }

    if (url === API_ENDPOINTS.DASHBOARD && method === 'get') {
      return Promise.resolve({
        data: mockDashboardData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      });
    }

    if (url === API_ENDPOINTS.UPDATE_DOLLAR_RATE && method === 'put') {
      const { rate } = JSON.parse(data);
      mockDashboardData.dollarRate = rate;
      return Promise.resolve({
        data: { message: 'Dollar rate updated successfully' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      });
    }

    return config;
  });
} 
else {
  apiClient.interceptors.request.use(config => {
    return config; // Forward the request to the actual API
  });
}

export default apiClient;
