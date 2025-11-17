import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { getUserByEmail, logTransaction } from '../lib/googleSheets';

interface AuthContextType {
  userToken: string | null;
  user: User | null;
  isAuthLoaded: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setGoogleSheetApiKey: (key: string, sheetId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  // Bootstrap async data when app first loads
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userData = await AsyncStorage.getItem('user');
        
        if (token && userData) {
          setUserToken(token);
          setUser(JSON.parse(userData));
        }
      } catch (e) {
        console.error('Error bootstrapping auth:', e);
      } finally {
        setIsAuthLoaded(true);
      }
    };

    bootstrap();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // In a real app, this would verify credentials with a backend
      // For now, we fetch from Google Sheets and verify the user exists
      const appUser = await getUserByEmail(email);
      
      if (!appUser) {
        throw new Error('User not found');
      }

      // Create a simple token (in production, use OAuth/JWT)
      const token = `token-${Date.now()}`;
      
      setUserToken(token);
      setUser(appUser);
      
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(appUser));

      // Log login transaction
      await logTransaction({
        type: 'login',
        userId: appUser.id,
        description: `User ${appUser.email} logged in`,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (user) {
        await logTransaction({
          type: 'login',
          userId: user.id,
          description: `User ${user.email} logged out`,
        });
      }

      setUserToken(null);
      setUser(null);
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const setGoogleSheetApiKey = async (key: string, sheetId: string) => {
    try {
      await AsyncStorage.setItem('GOOGLE_SHEETS_API_KEY', key);
      await AsyncStorage.setItem('SHEET_ID', sheetId);
    } catch (error) {
      console.error('Error saving API keys:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        user,
        isAuthLoaded,
        login,
        logout,
        setGoogleSheetApiKey,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};