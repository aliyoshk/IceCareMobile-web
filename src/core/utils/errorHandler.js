
// export const handleApiError = (error) => {
//   console.error('API Error:', error.response ? error.response.data : error.message);

//   throw new Error(error.response?.data?.message || error.message || 'An unknown error occurred');
// };

export const handleApiError = (error) => {

  console.error('API Error: error', error);
  console.error('API Error: error.response', error.response);
  console.error('API Error: error.response.data', error.response.data);
  console.error('API Error: error.response?.data?.message', error.response?.data?.message);
  console.error('API Error: error.response.statusText', error.response.statusText);
  console.error('API Error: error.message', error.message);
  console.error('API Error: error.response?.data?.message', error.response?.data?.message);
  
  const errorMessages = [];
  if (error.response?.data?.message && error.response?.data?.errors) {
    errorMessages.push(error.response?.data?.message);
    errorMessages.push(error.response?.data?.errors);
    throw new Error(errorMessages.join('; ',));
  }
  if (error.response?.data?.message && error.response.statusText) {
    errorMessages.push(error.response?.data?.message);
    errorMessages.push(error.response.statusText);
    throw new Error(errorMessages.join('; ',));
  }  
  else if (error.response?.data?.message) {
    errorMessages.push(error.response?.data?.message)
    throw new Error(errorMessages.join('; ',));
  } 
  else if (error.message) {
    errorMessages.push(error.message);
    errorMessages.push(error.response.statusText);
    throw new Error(errorMessages.join('; ',));
  }
  else if (error.response?.data?.errors) {
    errorMessages.push(error.response?.data?.errors);
    throw new Error(errorMessages.join('; ',));
  }
  else {
    errorMessages.push('An unknown error occurred');
    throw new Error(errorMessages.join('; ',));
  }
};
