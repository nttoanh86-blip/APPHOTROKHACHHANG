/**
 * Formats a number to Vietnamese Dong currency format with thousand separators
 */
export function formatVND(value: number): string {
  if (isNaN(value)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format plain number with dots: 1000000 -> "1.000.000"
 */
export function formatNumberDots(value: number): string {
  if (isNaN(value)) return '0';
  return new Intl.NumberFormat('vi-VN').format(value);
}

/**
 * Parses a string formatted with dots or commas into a clean number
 */
export function parseNumberFromDots(str: string): number {
  const clean = str.replace(/[^\d]/g, '');
  const parsed = parseInt(clean, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Generates voucher code in format VB-XXXXXX (6 random digits)
 */
export function generateVoucherCode(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `VB-${randomNum}`;
}

/**
 * Adds months to a date while handling fixed due day (e.g. 25th of month)
 */
export function calculatePaymentDate(startDate: string, monthOffset: number, dueDay: number): string {
  const base = new Date(startDate);
  if (isNaN(base.getTime())) {
    return '';
  }
  
  const targetMonth = base.getMonth() + monthOffset;
  const targetYear = base.getFullYear() + Math.floor(targetMonth / 12);
  const normalizedMonth = ((targetMonth % 12) + 12) % 12;
  
  // Find max days in target month
  const daysInMonth = new Date(targetYear, normalizedMonth + 1, 0).getDate();
  const actualDay = Math.min(dueDay, daysInMonth);
  
  const d = new Date(targetYear, normalizedMonth, actualDay);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  
  return `${dd}/${mm}/${yyyy}`;
}
