import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatting utilities
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-GB').format(num);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(0)}%`;
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-GB');
  } catch {
    return 'Invalid Date';
  }
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'active':
      return 'bg-blue-100 text-blue-800';
    case 'planned':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}


// CSV parsing utilities
export function parseDate(dateStr: string): Date | null {
  if (!dateStr || dateStr.trim() === '') return null;
  
  // Handle different date formats
  const formats = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY
  ];
  
  let date: Date;
  if (formats[0].test(dateStr)) {
    date = new Date(dateStr);
  } else if (formats[1].test(dateStr)) {
    const [day, month, year] = dateStr.split('/');
    date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  } else {
    date = new Date(dateStr);
  }
  
  return isNaN(date.getTime()) ? null : date;
}

export function parseBudget(budgetStr: string): number {
  if (!budgetStr || budgetStr.trim() === '') return 0;
  const cleaned = budgetStr.replace(/[$,]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function parseNumeric(value: string): number | null {
  if (!value || value.trim() === '' || value.toLowerCase() === 'n/a') return null;
  const cleaned = value.replace(/,/g, '');
  const parsed = parseInt(cleaned);
  return isNaN(parsed) ? null : parsed;
}

export function parseFloatValue(value: string): number | null {
  if (!value || value.trim() === '' || value.toLowerCase() === 'n/a') return null;
  const cleaned = value.replace(/,/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

export function mapStatus(status: string): 'Completed' | 'Active' | 'Planned' {
  const normalized = status.toLowerCase().trim();
  if (normalized === 'completed') return 'Completed';
  if (normalized === 'active') return 'Active';
  if (normalized === 'planned') return 'Planned';
  return 'Planned'; // default
}

