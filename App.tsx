import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Screens
import LoginScreen from './screens/auth/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import MedicinesScreen from './screens/MedicinesScreen';
import StockTransferScreen from './screens/StockTransferScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import SettingsScreen from './screens/SettingsScreen';

// Context & Providers
import { AuthProvider } from './context/AuthContext';
import { GoogleSheetsProvider } from './context/GoogleSheetsContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Theme
import { colors } from './lib/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigation - Main app interface
function TabNavigator() {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }: any) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.surfaceVariant,
        tabBarStyle: {
          backgroundColor: theme === 'dark' ? colors.dark.surface : '#fff',
          borderTopColor: colors.outline,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
        },
        tabBarIcon: ({ color, size }: any) => {
          const icons: Record<string, string> = {
            Dashboard: 'dashboard',
            Medicines: 'local-pharmacy',
            Transfer: 'swapHoriz',
            Transactions: 'receipt',
            Settings: 'settings',
          };
          return <MaterialIcons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Medicines" component={MedicinesScreen} />
      <Tab.Screen name="Transfer" component={StockTransferScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// Auth Stack - Before login
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.surface },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

// App Navigation Router
function RootNavigator() {
  // Simple check - in production use proper auth state management
  const [userToken] = useState<string | null>(null);

  return userToken ? <TabNavigator /> : <AuthStack />;
}

// Main App Component
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <GoogleSheetsProvider>
          <SafeAreaProvider style={styles.container}>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </GoogleSheetsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});