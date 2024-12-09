
// export const handleApiError = (error) => {
//   console.error('API Error:', error.response ? error.response.data : error.message);

//   throw new Error(error.response?.data?.message || error.message || 'An unknown error occurred');
// };

export const handleApiError = (error) => {  
  const errorMessages = [];
  if (!error.response) {
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      errorMessages.push('No internet connection. Please check your network and try again.');
      throw new Error(errorMessages.join('; ',));
    } else if (error.code === 'ECONNABORTED') {
      errorMessages.push('The request took too long to process. Please try again later.');
      throw new Error(errorMessages.join('; ',));
    } else {
      errorMessages.push('An unknown error occurred. Please try again.');
      throw new Error(errorMessages.join('; ',));
    }
  }
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
