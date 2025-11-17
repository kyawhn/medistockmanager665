import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import {
  getMedicines,
  getMainStoreStock,
  getSubStoreStock,
  getTransactions,
  getStores,
} from '../lib/googleSheets';
import { Medicine, MainStoreStock, SubStoreStock, Transaction, Store, DashboardStats } from '../types';

interface GoogleSheetsContextType {
  // Data
  medicines: Medicine[];
  mainStoreStock: MainStoreStock[];
  subStoreStock: SubStoreStock[];
  transactions: Transaction[];
  stores: Store[];
  
  // Loading states
  isLoading: boolean;
  isSyncing: boolean;
  lastSync: Date | null;
  error: string | null;

  // Actions
  refreshAllData: () => Promise<void>;
  getDashboardStats: () => DashboardStats;
  getMedicineStock: (medicineId: string) => { main: number; subs: Record<string, number> };
}

const GoogleSheetsContext = createContext<GoogleSheetsContextType | undefined>(undefined);

export const GoogleSheetsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [mainStoreStock, setMainStoreStock] = useState<MainStoreStock[]>([]);
  const [subStoreStock, setSubStoreStock] = useState<SubStoreStock[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stores, setStores] = useState<Store[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    refreshAllData();
  }, []);

  const refreshAllData = useCallback(async () => {
    try {
      setIsSyncing(true);
      setError(null);

      const [med, mainStock, subStock, trans, storeList] = await Promise.all([
        getMedicines(),
        getMainStoreStock(),
        getSubStoreStock(),
        getTransactions(),
        getStores(),
      ]);

      setMedicines(med);
      setMainStoreStock(mainStock);
      setSubStoreStock(subStock);
      setTransactions(trans);
      setStores(storeList);
      setLastSync(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync data';
      setError(errorMessage);
      console.error('Google Sheets sync error:', err);
    } finally {
      setIsSyncing(false);
      setIsLoading(false);
    }
  }, []);

  const getDashboardStats = useCallback((): DashboardStats => {
    const now = new Date();
    const sixtyDaysFromNow = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

    const lowStockCount = medicines.filter((med) => {
      const mainStock = mainStoreStock.find((s) => s.medicineId === med.id);
      return (mainStock?.quantity || 0) < med.safetyStockLevel;
    }).length;

    const expiredCount = medicines.filter((med) => {
      const expiryDate = new Date(med.expiryDate);
      return expiryDate < now && med.status === 'active';
    }).length;

    const expiringCount = medicines.filter((med) => {
      const expiryDate = new Date(med.expiryDate);
      return expiryDate >= now && expiryDate <= sixtyDaysFromNow && med.status === 'active';
    }).length;

    return {
      totalMedicines: medicines.filter((m) => m.status === 'active').length,
      lowStockCount,
      expiredCount,
      expiringCount,
      totalTransactions: transactions.length,
      lastSync: lastSync?.toISOString(),
    };
  }, [medicines, mainStoreStock, transactions, lastSync]);

  const getMedicineStock = useCallback(
    (medicineId: string) => {
      const mainStockEntry = mainStoreStock.find((s) => s.medicineId === medicineId);
      const subStocks = subStoreStock.filter((s) => s.medicineId === medicineId);

      const subStockMap: Record<string, number> = {};
      subStocks.forEach((stock) => {
        subStockMap[stock.storeId] = stock.quantity;
      });

      return {
        main: mainStockEntry?.quantity || 0,
        subs: subStockMap,
      };
    },
    [mainStoreStock, subStoreStock]
  );

  return (
    <GoogleSheetsContext.Provider
      value={{
        medicines,
        mainStoreStock,
        subStoreStock,
        transactions,
        stores,
        isLoading,
        isSyncing,
        lastSync,
        error,
        refreshAllData,
        getDashboardStats,
        getMedicineStock,
      }}
    >
      {children}
    </GoogleSheetsContext.Provider>
  );
};

export const useGoogleSheets = () => {
  const context = useContext(GoogleSheetsContext);
  if (!context) {
    throw new Error('useGoogleSheets must be used within GoogleSheetsProvider');
  }
  return context;
};