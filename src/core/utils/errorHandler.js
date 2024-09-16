
export const handleApiError = (error) => {
  console.error('API Error:', error.response ? error.response.data : error.message);
  throw new Error(error.response?.data?.message || error.message || 'An unknown error occurred');
};
