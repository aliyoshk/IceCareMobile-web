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

    // Allow only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
        value = parts[0] + '.' + parts[1];
    }

    const cursorPosition = input.selectionStart;

    // Format the integer part with commas and retain the decimal part
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const decimalPart = parts[1] !== undefined ? '.' + parts[1] : '';

    value = integerPart + decimalPart;

    // Attach the currency symbol
    const symbol = symbolMap[currency] || '';
    input.value = symbol + value;

    // Set the cursor position to avoid jumping
    const newCursorPosition = symbol.length + value.length - (integerPart.length + decimalPart.length - cursorPosition);
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

export function formatAmountToDecimal(amount) {
    // Convert the input to a number safely
    const numericAmount = Number(amount);

    if (isNaN(numericAmount)) {
        throw new Error("Invalid input: The provided amount is not a valid number.");
    }

    // Format the number for display, adding commas and fixing decimal places
    const formattedAmount = numericAmount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    return formattedAmount;
}
