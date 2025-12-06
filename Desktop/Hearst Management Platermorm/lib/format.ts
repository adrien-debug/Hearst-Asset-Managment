/**
 * Format a number with consistent decimal separator (always uses dot)
 * and optional thousands separators
 */
export function formatNumber(
  value: number,
  options: {
    decimals?: number;
    useThousandsSeparator?: boolean;
  } = {}
): string {
  const { decimals = 1, useThousandsSeparator = true } = options;
  
  // Use toFixed to ensure dot as decimal separator
  const formatted = value.toFixed(decimals);
  const parts = formatted.split('.');
  
  // Add thousands separators to integer part
  const integerPart = useThousandsSeparator
    ? parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : parts[0];
  
  // Combine with decimal part if exists
  return parts[1] ? `${integerPart}.${parts[1]}` : integerPart;
}

/**
 * Format currency consistently
 */
export function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return `$${amount.toFixed(2)}`;
}

/**
 * Format date consistently using en-US locale
 */
export function formatDate(
  dateString: string,
  options: {
    month?: 'short' | 'long' | 'numeric';
    day?: 'numeric';
    year?: 'numeric';
    hour?: '2-digit';
    minute?: '2-digit';
    second?: '2-digit';
  } = {}
): string {
  const {
    month = 'short',
    day = 'numeric',
    year = 'numeric',
    hour,
    minute,
    second
  } = options;

  return new Date(dateString).toLocaleString('en-US', {
    month,
    day,
    year,
    hour,
    minute,
    second
  } as Intl.DateTimeFormatOptions);
}

/**
 * Format date as "Jan 2024" (without period after month)
 */
export function formatMonthYear(dateString: string): string {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Format percentage consistently
 */
export function formatPercentage(value: number, decimals: number = 1, showSign: boolean = true): string {
  const sign = showSign && value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}



