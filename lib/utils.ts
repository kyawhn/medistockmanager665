import { colors } from './theme';

// Date utilities
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function getDaysUntilExpiry(expiryDate: string): number {
  try {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return -1;
  }
}

// Stock status utilities
export type StockStatusType = 'critical' | 'low' | 'normal' | 'high';

export function getStockStatus(currentStock: number, safetyLevel: number): StockStatusType {
  if (currentStock === 0) return 'critical';
  if (currentStock < safetyLevel * 0.5) return 'critical';
  if (currentStock < safetyLevel) return 'low';
  return 'normal';
}

export type ExpiryStatusType = 'expired' | 'expiring' | 'warning' | 'normal';

export function getExpiryStatus(expiryDate: string): ExpiryStatusType {
  const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
  
  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry < 30) return 'expiring';
  if (daysUntilExpiry < 60) return 'warning';
  return 'normal';
}

export function getExpiryStatusColor(status: ExpiryStatusType): string {
  switch (status) {
    case 'expired':
      return colors.expired;
    case 'expiring':
      return colors.expiringWarning;
    case 'warning':
      return colors.expiringCaution;
    case 'normal':
      return colors.normal;
    default:
      return colors.normal;
  }
}

export function getStockStatusColor(status: StockStatusType): string {
  switch (status) {
    case 'critical':
      return colors.error;
    case 'low':
      return colors.warning;
    case 'normal':
      return colors.normal;
    default:
      return colors.primary;
  }
}

// Currency formatting
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

// Number formatting
export function formatNumber(num: number, decimals = 2): string {
  return Number(num).toFixed(decimals);
}

// Search/filter utilities
export function matchesSearchText(text: string, searchText: string): boolean {
  return text.toLowerCase().includes(searchText.toLowerCase());
}

export function filterMedicines(medicines: any[], searchText: string, filters: any) {
  return medicines.filter((medicine) => {
    // Search text filter
    if (searchText) {
      const matches =
        matchesSearchText(medicine.name, searchText) ||
        matchesSearchText(medicine.brand, searchText) ||
        matchesSearchText(medicine.category, searchText);
      if (!matches) return false;
    }

    // Category filter
    if (filters.category && medicine.category !== filters.category) {
      return false;
    }

    // Status filter
    if (filters.status && medicine.status !== filters.status) {
      return false;
    }

    // Expiry filter
    if (filters.expiryFilter) {
      const expiryStatus = getExpiryStatus(medicine.expiryDate);
      if (filters.expiryFilter !== expiryStatus && filters.expiryFilter !== 'all') {
        return false;
      }
    }

    return true;
  });
}

// Storage utilities
export async function saveToAsyncStorage(key: string, value: any): Promise<void> {
  try {
    const jsonValue = JSON.stringify(value);
    // This is a placeholder - AsyncStorage should be imported in components
  } catch (error) {
    console.error(`Error saving to AsyncStorage:`, error);
  }
}

export async function getFromAsyncStorage(key: string): Promise<any> {
  try {
    // This is a placeholder - AsyncStorage should be imported in components
    return null;
  } catch (error) {
    console.error(`Error reading from AsyncStorage:`, error);
    return null;
  }
}

// Stock prediction (simple moving average)
export function predictStockOutDate(
  currentStock: number,
  dailyUsage: number,
  reorderLeadTime: number = 7
): Date | null {
  if (dailyUsage <= 0) return null;
  
  const daysUntilStockOut = currentStock / dailyUsage;
  const date = new Date();
  date.setDate(date.getDate() + daysUntilStockOut - reorderLeadTime);
  
  return date;
}

// Batch operations
export function groupBy<T>(array: T[], key: (item: T) => string): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const groupKey = key(item);
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    },
    {} as Record<string, T[]>
  );
}