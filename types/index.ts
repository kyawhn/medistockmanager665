// Medicine entity
export interface Medicine {
  id: string; // Auto-generated unique ID
  name: string;
  category: string;
  strength: string; // e.g., "500mg"
  brand: string;
  supplier: string;
  batchNo: string;
  expiryDate: string; // ISO date string (YYYY-MM-DD)
  unitCost: number;
  sellingPrice: number;
  safetyStockLevel: number; // Minimum stock before warning
  imageUrl?: string;
  status: 'active' | 'discontinued' | 'draft';
  createdAt: string;
  updatedAt: string;
}

// Store entity
export interface Store {
  id: string;
  name: string;
  type: 'main' | 'sub';
  location?: string;
  createdAt: string;
}

// Main Store Stock
export interface MainStoreStock {
  id: string;
  medicineId: string;
  quantity: number;
  lastUpdated: string;
}

// Sub Store Stock
export interface SubStoreStock {
  id: string;
  medicineId: string;
  storeId: string;
  quantity: number;
  lastUpdated: string;
}

// Stock Transfer
export interface StockTransfer {
  id: string;
  medicineId: string;
  fromStore: string; // Store ID
  toStore: string; // Store ID
  quantity: number;
  reason: 'transfer' | 'dispensed' | 'received' | 'adjustment';
  notes?: string;
  createdBy: string; // User ID
  createdAt: string;
  status: 'pending' | 'completed' | 'cancelled';
}

// Transaction (audit log)
export interface Transaction {
  id: string;
  type: 'medicine_added' | 'medicine_edited' | 'medicine_deleted' | 'stock_transfer' | 'stock_deduction' | 'login';
  medicineId?: string;
  entity?: Record<string, any>; // The data affected
  oldValues?: Record<string, any>; // Previous values for edits
  newValues?: Record<string, any>; // New values
  userId: string;
  storeId?: string;
  description: string;
  createdAt: string;
}

// User/Storekeeper
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'storekeeper';
  phone?: string;
  storeId?: string; // For storekeepers assigned to a specific store
  createdAt: string;
  lastLogin?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Stock status for display
export interface StockStatus {
  medicineId: string;
  medicineName: string;
  currentStock: number;
  safetyLevel: number;
  status: 'low' | 'normal' | 'critical';
  daysToExpiry?: number;
  expiryStatus: 'expired' | 'expiring' | 'warning' | 'normal';
}

// Dashboard stats
export interface DashboardStats {
  totalMedicines: number;
  lowStockCount: number;
  expiredCount: number;
  expiringCount: number; // Expiring in 60 days
  totalTransactions: number;
  lastSync?: string;
}

// Filter options
export interface FilterOptions {
  category?: string;
  storeId?: string;
  status?: 'low' | 'normal' | 'expired' | 'expiring';
  searchText?: string;
  expiryFilter?: 'all' | 'expired' | 'expiring' | 'normal';
}