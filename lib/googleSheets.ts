// Google Sheets API integration for Medicine Inventory App
// This file handles all communication with Google Sheets backend

import { Medicine, Store, Transaction, User, StockTransfer, MainStoreStock, SubStoreStock } from '../types';

// Configuration - User must set these in Settings screen
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_SHEETS_API_KEY || '';
const SHEET_ID = process.env.EXPO_PUBLIC_SHEET_ID || '';
const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

// Sheet names in the Google Sheet
const SHEET_NAMES = {
  MEDICINES: 'Medicines',
  MAIN_STORE_STOCK: 'MainStore_Stock',
  SUB_STORES_STOCK: 'SubStores_Stock',
  TRANSACTIONS: 'Transactions',
  USERS: 'Users',
  STORES: 'Stores',
};

// Helper: Build range for sheet queries
const buildRange = (sheetName: string, range?: string) => {
  return range ? `${sheetName}!${range}` : `${sheetName}`;
};

// Helper: Make API calls to Google Sheets
async function makeSheetRequest(
  method: 'GET' | 'POST' | 'PUT',
  sheetName: string,
  range?: string,
  values?: any[][]
) {
  if (!GOOGLE_API_KEY || !SHEET_ID) {
    throw new Error('Google Sheets API key or Sheet ID not configured. Please set them in Settings.');
  }

  try {
    const url = buildSheetUrl(method, sheetName, range);
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: method !== 'GET' ? JSON.stringify({ values: values || [] }) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Google Sheets API Error:', error);
    throw error;
  }
}

// Helper: Build Google Sheets API URL
function buildSheetUrl(method: string, sheetName: string, range?: string): string {
  const fullRange = buildRange(sheetName, range);
  const encodedRange = encodeURIComponent(fullRange);
  
  if (method === 'GET') {
    return `${BASE_URL}/${SHEET_ID}/values/${encodedRange}?key=${GOOGLE_API_KEY}`;
  }
  
  return `${BASE_URL}/${SHEET_ID}/values/${encodedRange}?valueInputOption=RAW&key=${GOOGLE_API_KEY}`;
}

// Helper: Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Helper: Get next row index for auto-incrementing ID
async function getNextRowIndex(sheetName: string): Promise<number> {
  const data = await makeSheetRequest('GET', sheetName, 'A:A');
  return (data.values?.length || 0) + 1;
}

// ============= MEDICINES SHEET =============

export async function getMedicines(): Promise<Medicine[]> {
  try {
    const data = await makeSheetRequest('GET', SHEET_NAMES.MEDICINES, 'A:M');
    if (!data.values || data.values.length < 2) return [];

    const [headers, ...rows] = data.values;
    return rows.map((row) => rowToMedicine(row, headers));
  } catch (error) {
    console.error('Error fetching medicines:', error);
    return [];
  }
}

export async function getMedicineById(id: string): Promise<Medicine | null> {
  const medicines = await getMedicines();
  return medicines.find((m) => m.id === id) || null;
}

export async function addMedicine(medicine: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>): Promise<Medicine> {
  const newMedicine: Medicine = {
    ...medicine,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const row = medicineToRow(newMedicine);
  
  // Append to sheet
  const data = await makeSheetRequest('GET', SHEET_NAMES.MEDICINES, 'A:M');
  const nextRow = (data.values?.length || 0) + 1;
  const range = `A${nextRow}:M${nextRow}`;
  
  await makeSheetRequest('PUT', SHEET_NAMES.MEDICINES, range, [row]);
  
  // Log transaction
  await logTransaction({
    type: 'medicine_added',
    medicineId: newMedicine.id,
    description: `Added medicine: ${newMedicine.name}`,
    userId: 'current-user', // TODO: Get from auth context
  });

  return newMedicine;
}

export async function updateMedicine(id: string, updates: Partial<Medicine>): Promise<Medicine> {
  const medicines = await getMedicines();
  const medicineIndex = medicines.findIndex((m) => m.id === id);
  
  if (medicineIndex === -1) throw new Error('Medicine not found');

  const updatedMedicine = {
    ...medicines[medicineIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const row = medicineToRow(updatedMedicine);
  const range = `A${medicineIndex + 2}:M${medicineIndex + 2}`;
  
  await makeSheetRequest('PUT', SHEET_NAMES.MEDICINES, range, [row]);

  // Log transaction
  await logTransaction({
    type: 'medicine_edited',
    medicineId: id,
    oldValues: medicines[medicineIndex],
    newValues: updatedMedicine,
    description: `Updated medicine: ${updatedMedicine.name}`,
    userId: 'current-user',
  });

  return updatedMedicine;
}

export async function deleteMedicine(id: string): Promise<void> {
  const medicines = await getMedicines();
  const medicine = medicines.find((m) => m.id === id);
  
  if (!medicine) throw new Error('Medicine not found');

  // Mark as deleted (soft delete)
  await updateMedicine(id, { status: 'discontinued' });

  // Log transaction
  await logTransaction({
    type: 'medicine_deleted',
    medicineId: id,
    description: `Deleted medicine: ${medicine.name}`,
    userId: 'current-user',
  });
}

// ============= STOCK MANAGEMENT =============

export async function getMainStoreStock(): Promise<MainStoreStock[]> {
  try {
    const data = await makeSheetRequest('GET', SHEET_NAMES.MAIN_STORE_STOCK, 'A:D');
    if (!data.values || data.values.length < 2) return [];

    const [headers, ...rows] = data.values;
    return rows.map((row) => rowToMainStoreStock(row, headers));
  } catch (error) {
    console.error('Error fetching main store stock:', error);
    return [];
  }
}

export async function getSubStoreStock(storeId?: string): Promise<SubStoreStock[]> {
  try {
    const data = await makeSheetRequest('GET', SHEET_NAMES.SUB_STORES_STOCK, 'A:E');
    if (!data.values || data.values.length < 2) return [];

    const [headers, ...rows] = data.values;
    let stock = rows.map((row) => rowToSubStoreStock(row, headers));
    
    if (storeId) {
      stock = stock.filter((s) => s.storeId === storeId);
    }
    
    return stock;
  } catch (error) {
    console.error('Error fetching sub store stock:', error);
    return [];
  }
}

export async function updateStockQuantity(
  medicineId: string,
  storeId: 'main' | string,
  newQuantity: number,
  reason: string
): Promise<void> {
  if (storeId === 'main') {
    // Update main store stock
    const stock = await getMainStoreStock();
    const index = stock.findIndex((s) => s.medicineId === medicineId);
    
    if (index !== -1) {
      stock[index].quantity = newQuantity;
      stock[index].lastUpdated = new Date().toISOString();
      
      const row = mainStoreStockToRow(stock[index]);
      const range = `A${index + 2}:D${index + 2}`;
      await makeSheetRequest('PUT', SHEET_NAMES.MAIN_STORE_STOCK, range, [row]);
    } else {
      // Create new entry
      const newStock: MainStoreStock = {
        id: generateId(),
        medicineId,
        quantity: newQuantity,
        lastUpdated: new Date().toISOString(),
      };
      const row = mainStoreStockToRow(newStock);
      const data = await makeSheetRequest('GET', SHEET_NAMES.MAIN_STORE_STOCK, 'A:D');
      const nextRow = (data.values?.length || 0) + 1;
      await makeSheetRequest('PUT', SHEET_NAMES.MAIN_STORE_STOCK, `A${nextRow}:D${nextRow}`, [row]);
    }
  } else {
    // Update sub store stock
    const stock = await getSubStoreStock(storeId);
    const index = stock.findIndex((s) => s.medicineId === medicineId);
    
    if (index !== -1) {
      stock[index].quantity = newQuantity;
      stock[index].lastUpdated = new Date().toISOString();
      
      const row = subStoreStockToRow(stock[index]);
      const range = `A${index + 2}:E${index + 2}`;
      await makeSheetRequest('PUT', SHEET_NAMES.SUB_STORES_STOCK, range, [row]);
    }
  }

  // Log transaction
  await logTransaction({
    type: 'stock_transfer',
    medicineId,
    description: `${reason}: Updated stock for ${medicineId} in ${storeId}`,
    userId: 'current-user',
    storeId: storeId === 'main' ? undefined : storeId,
  });
}

// ============= STOCK TRANSFERS =============

export async function getTransfers(): Promise<StockTransfer[]> {
  try {
    // Note: This reads from Transactions sheet, filtered by type
    const transactions = await getTransactions();
    return transactions
      .filter((t) => t.type === 'stock_transfer')
      .map((t) => ({
        id: t.id,
        medicineId: t.medicineId || '',
        fromStore: t.entity?.fromStore || '',
        toStore: t.entity?.toStore || '',
        quantity: t.entity?.quantity || 0,
        reason: 'transfer' as const,
        notes: t.description,
        createdBy: t.userId,
        createdAt: t.createdAt,
        status: 'completed' as const,
      }));
  } catch (error) {
    console.error('Error fetching transfers:', error);
    return [];
  }
}

export async function createTransfer(transfer: Omit<StockTransfer, 'id' | 'createdAt'>): Promise<StockTransfer> {
  const newTransfer: StockTransfer = {
    ...transfer,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };

  // Update both stores' stock
  const medicines = await getMedicines();
  const medicine = medicines.find((m) => m.id === transfer.medicineId);

  if (!medicine) throw new Error('Medicine not found');

  // Deduct from source store
  if (transfer.fromStore === 'main') {
    const mainStock = await getMainStoreStock();
    const entry = mainStock.find((s) => s.medicineId === transfer.medicineId);
    if (entry && entry.quantity >= transfer.quantity) {
      await updateStockQuantity(transfer.medicineId, 'main', entry.quantity - transfer.quantity, 'Transfer out');
    } else {
      throw new Error('Insufficient stock in main store');
    }
  } else {
    const subStock = await getSubStoreStock(transfer.fromStore);
    const entry = subStock.find((s) => s.medicineId === transfer.medicineId);
    if (entry && entry.quantity >= transfer.quantity) {
      await updateStockQuantity(transfer.medicineId, transfer.fromStore, entry.quantity - transfer.quantity, 'Transfer out');
    } else {
      throw new Error('Insufficient stock in source store');
    }
  }

  // Add to destination store
  if (transfer.toStore === 'main') {
    const mainStock = await getMainStoreStock();
    const entry = mainStock.find((s) => s.medicineId === transfer.medicineId);
    const newQty = (entry?.quantity || 0) + transfer.quantity;
    await updateStockQuantity(transfer.medicineId, 'main', newQty, 'Transfer in');
  } else {
    const subStock = await getSubStoreStock(transfer.toStore);
    const entry = subStock.find((s) => s.medicineId === transfer.medicineId);
    const newQty = (entry?.quantity || 0) + transfer.quantity;
    await updateStockQuantity(transfer.medicineId, transfer.toStore, newQty, 'Transfer in');
  }

  // Log transaction
  await logTransaction({
    type: 'stock_transfer',
    medicineId: transfer.medicineId,
    entity: newTransfer,
    description: `Transferred ${transfer.quantity} units from ${transfer.fromStore} to ${transfer.toStore}`,
    userId: transfer.createdBy,
  });

  return newTransfer;
}

// ============= TRANSACTIONS (AUDIT LOG) =============

export async function getTransactions(limit?: number): Promise<Transaction[]> {
  try {
    const data = await makeSheetRequest('GET', SHEET_NAMES.TRANSACTIONS, 'A:H');
    if (!data.values || data.values.length < 2) return [];

    const [headers, ...rows] = data.values;
    let transactions = rows.map((row) => rowToTransaction(row, headers));
    
    // Sort by date descending
    transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    if (limit) {
      transactions = transactions.slice(0, limit);
    }
    
    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

export async function logTransaction(
  transaction: Omit<Transaction, 'id' | 'createdAt'>
): Promise<void> {
  const newTransaction: Transaction = {
    ...transaction,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };

  const row = transactionToRow(newTransaction);
  const data = await makeSheetRequest('GET', SHEET_NAMES.TRANSACTIONS, 'A:H');
  const nextRow = (data.values?.length || 0) + 1;
  
  await makeSheetRequest('PUT', SHEET_NAMES.TRANSACTIONS, `A${nextRow}:H${nextRow}`, [row]);
}

// ============= USERS =============

export async function getUsers(): Promise<User[]> {
  try {
    const data = await makeSheetRequest('GET', SHEET_NAMES.USERS, 'A:G');
    if (!data.values || data.values.length < 2) return [];

    const [headers, ...rows] = data.values;
    return rows.map((row) => rowToUser(row, headers));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await getUsers();
  return users.find((u) => u.email === email) || null;
}

// ============= STORES =============

export async function getStores(): Promise<Store[]> {
  try {
    const data = await makeSheetRequest('GET', SHEET_NAMES.STORES, 'A:E');
    if (!data.values || data.values.length < 2) return [];

    const [headers, ...rows] = data.values;
    return rows.map((row) => rowToStore(row, headers));
  } catch (error) {
    console.error('Error fetching stores:', error);
    return [];
  }
}

// ============= CONVERSION HELPERS =============

function rowToMedicine(row: any[], headers: string[]): Medicine {
  return {
    id: row[0] || generateId(),
    name: row[1] || '',
    category: row[2] || '',
    strength: row[3] || '',
    brand: row[4] || '',
    supplier: row[5] || '',
    batchNo: row[6] || '',
    expiryDate: row[7] || '',
    unitCost: parseFloat(row[8]) || 0,
    sellingPrice: parseFloat(row[9]) || 0,
    safetyStockLevel: parseInt(row[10]) || 0,
    imageUrl: row[11],
    status: row[12] || 'active',
    createdAt: row[13] || new Date().toISOString(),
    updatedAt: row[14] || new Date().toISOString(),
  };
}

function medicineToRow(medicine: Medicine): any[] {
  return [
    medicine.id,
    medicine.name,
    medicine.category,
    medicine.strength,
    medicine.brand,
    medicine.supplier,
    medicine.batchNo,
    medicine.expiryDate,
    medicine.unitCost,
    medicine.sellingPrice,
    medicine.safetyStockLevel,
    medicine.imageUrl || '',
    medicine.status,
    medicine.createdAt,
    medicine.updatedAt,
  ];
}

function rowToMainStoreStock(row: any[]): MainStoreStock {
  return {
    id: row[0] || generateId(),
    medicineId: row[1] || '',
    quantity: parseInt(row[2]) || 0,
    lastUpdated: row[3] || new Date().toISOString(),
  };
}

function mainStoreStockToRow(stock: MainStoreStock): any[] {
  return [stock.id, stock.medicineId, stock.quantity, stock.lastUpdated];
}

function rowToSubStoreStock(row: any[]): SubStoreStock {
  return {
    id: row[0] || generateId(),
    medicineId: row[1] || '',
    storeId: row[2] || '',
    quantity: parseInt(row[3]) || 0,
    lastUpdated: row[4] || new Date().toISOString(),
  };
}

function subStoreStockToRow(stock: SubStoreStock): any[] {
  return [stock.id, stock.medicineId, stock.storeId, stock.quantity, stock.lastUpdated];
}

function rowToTransaction(row: any[]): Transaction {
  return {
    id: row[0] || generateId(),
    type: row[1] || 'medicine_added',
    medicineId: row[2],
    entity: row[3] ? JSON.parse(row[3]) : undefined,
    oldValues: row[4] ? JSON.parse(row[4]) : undefined,
    newValues: row[5] ? JSON.parse(row[5]) : undefined,
    userId: row[6] || '',
    description: row[7] || '',
    createdAt: row[8] || new Date().toISOString(),
  };
}

function transactionToRow(transaction: Transaction): any[] {
  return [
    transaction.id,
    transaction.type,
    transaction.medicineId || '',
    JSON.stringify(transaction.entity || {}),
    JSON.stringify(transaction.oldValues || {}),
    JSON.stringify(transaction.newValues || {}),
    transaction.userId,
    transaction.description,
    transaction.createdAt,
  ];
}

function rowToUser(row: any[]): User {
  return {
    id: row[0] || generateId(),
    email: row[1] || '',
    name: row[2] || '',
    role: row[3] || 'storekeeper',
    phone: row[4],
    storeId: row[5],
    createdAt: row[6] || new Date().toISOString(),
  };
}

function rowToStore(row: any[]): Store {
  return {
    id: row[0] || generateId(),
    name: row[1] || '',
    type: row[2] || 'sub',
    location: row[3],
    createdAt: row[4] || new Date().toISOString(),
  };
}