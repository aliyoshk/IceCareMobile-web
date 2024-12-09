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

export function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9.%+-]+@[a-zA-Z0-9.-]+[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

export function IsValidPhoneNumber(phoneNumber) {
    const phoneRegex = /^(\d{11})$/;
    return phoneRegex.test(phoneNumber);
}

export function formatAmountToCurrency(event, currency = 'NGN') {
    const symbolMap = {
        NGN: '₦',
        USD: '$',
        GBP: '£',
        EUR: '€',
        JPY: '¥',
        CAD: 'C$',
    };

    const input = event.target;
    let value = input.value.replace(/[^0-9.]/g, ''); // Remove non-numeric and non-period characters


    // If the input is empty, clear the field without the currency symbol
    if (!value) {
        input.value = '';
        return;
    }

    const cursorPosition = input.selectionStart;

    // Allow the user to manually enter a sign or decimals if desired
    if (value && !isNaN(value)) {
        value = parseFloat(value).toLocaleString('en-US', {
            minimumFractionDigits: 0, // Allow user to type without forcing decimal places
            maximumFractionDigits: 2  // User can add decimals manually if desired
        });
    }

    // Attach the currency symbol
    const symbol = symbolMap[currency] || '';
    input.value = symbol + value;

    // Set the cursor position to avoid jumping
    const newCursorPosition = symbol.length + value.length - (value.length - cursorPosition);
    input.setSelectionRange(newCursorPosition, newCursorPosition);
}

export function parseCurrencyValue(value) {
    if (typeof value === 'string') {
      return parseFloat(value.replace(/[^0-9.-]/g, '')) || 0;
    }
    return value;
}

export function formatAmount(value, currency = 'NGN') {
    if (!value) return '';
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
    return `${currency} ${numericValue.toLocaleString()}`;
}