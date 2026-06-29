declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string | number>) => void };
  }
}

export function getLoanRange(amount: number): string {
  if (amount < 1000000) return '<10L';
  if (amount < 3000000) return '10-30L';
  if (amount < 5000000) return '30-50L';
  if (amount < 10000000) return '50L-1Cr';
  return '>1Cr';
}

export function getSIPRange(monthly: number): string {
  if (monthly < 5000) return '<5K';
  if (monthly < 15000) return '5-15K';
  if (monthly < 50000) return '15-50K';
  return '>50K';
}

export function getSalaryRange(annual: number): string {
  if (annual < 500000) return '<5L';
  if (annual < 1000000) return '5-10L';
  if (annual < 2000000) return '10-20L';
  if (annual < 5000000) return '20-50L';
  return '>50L';
}

export function track(event: string, data?: Record<string, string | number>) {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(event, data);
  }
}
