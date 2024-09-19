export function formatDate(date, format = 'DD/MM/YYYY') {
    const options = { 
        'DD/MM/YYYY': {year: 'numeric', months: '2-digit', day: '2-digit'},
        'MM/DD/YYYY': {year: 'numeric', months: '2-digit', day: '2-digit'},
        'YYYY/DD/MM': {year: 'numeric', months: '2-digit', day: '2-digit'},
    }
    return new Date(date).toLocaleDateString('en-GB', options);
}

export function formatCurrency(amount, currency = 'NGN') {
  const symbol = {
      NGN: '₦',
      USD: '$'
  };

  const formattedAmount = parseFloat(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
  });

  return symbol[currency] + formattedAmount;
}