/**
 * Format numbers strictly according to the Indian numbering system:
 * Clusters of 2 digits after the initial hundred/thousand group (e.g. 1,23,456.50)
 */
export function formatIndianNumber(value: number, decimals: number = 2): string {
  if (isNaN(value)) return '0.00';
  
  const isNegative = value < 0;
  const absVal = Math.abs(value);
  const fixed = absVal.toFixed(decimals);
  const [integerPart, decimalPart] = fixed.split('.');

  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);

  let formatted = lastThree;
  if (otherNumbers !== '') {
    // Add commas every 2 digits from right to left
    const clustered = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    formatted = clustered + ',' + lastThree;
  }

  const result = decimals > 0 ? `${formatted}.${decimalPart}` : formatted;
  return isNegative ? `-${result}` : result;
}

/**
 * Format a number into an Indian Rupee string: e.g. ₹28,450.00
 */
export function formatRupee(amount: number, showDecimals: boolean = true): string {
  const formatted = formatIndianNumber(amount, showDecimals ? 2 : 0);
  return `₹${formatted}`;
}

/**
 * Format date in standard student passbook format: e.g. 12 Oct 2026
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

/**
 * Calculate percentage safely between 0 and 100
 */
export function getPercentage(current: number, total: number): number {
  if (total <= 0) return 0;
  const pct = Math.round((current / total) * 100);
  return Math.min(Math.max(pct, 0), 100);
}
