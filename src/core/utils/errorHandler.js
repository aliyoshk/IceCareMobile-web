
// export const handleApiError = (error) => {
//   console.error('API Error:', error.response ? error.response.data : error.message);

//   throw new Error(error.response?.data?.message || error.message || 'An unknown error occurred');
// };

export const handleApiError = (error) => {
  console.error('API Error:', error);
  console.error('API Error:', error.response);
  console.error('API Error:', error.response.statusText);
  
  if (error.response) {
    const { data } = error.response;
    console.error('API Error Response Data:', data);
    console.error('API Error Response Message:', data?.Message);
    console.error('API Error Response Errors:', data?.Errors);
  } else {
    console.error('API Error Message:', error.message);
  }

  console.error('API Error statusText:', error.response.statusText);

  throw new Error(error.response?.data?.message || error.message || error.response.statusText ||'An unknown error occurred');
};
