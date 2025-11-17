import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../lib/theme';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const { login, setGoogleSheetApiKey } = useAuth();

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [sheetId, setSheetId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'setup'>('login');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
    } catch (error) {
      Alert.alert('Login Failed', error instanceof Error ? error.message : 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupGoogleSheets = async () => {
    if (!apiKey || !sheetId) {
      Alert.alert('Error', 'Please enter both API Key and Sheet ID');
      return;
    }

    try {
      setIsLoading(true);
      await setGoogleSheetApiKey(apiKey, sheetId);
      Alert.alert('Success', 'Google Sheets configured successfully!');
      setActiveTab('login');
    } catch (error) {
      Alert.alert('Setup Failed', error instanceof Error ? error.message : 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons name="local-pharmacy" size={64} color={colors.primary} />
          <Text style={styles.title}>MediTrack</Text>
          <Text style={styles.subtitle}>Medicine Inventory Management</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'login' && styles.activeTab]}
            onPress={() => setActiveTab('login')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'login' && styles.activeTabText,
              ]}
            >
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'setup' && styles.activeTab]}
            onPress={() => setActiveTab('setup')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'setup' && styles.activeTabText,
              ]}
            >
              Setup
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Tab */}
        {activeTab === 'login' && (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Welcome Back</Text>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="email" size={20} color={colors.onSurfaceVariant} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  editable={!isLoading}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name={showPassword ? 'visibility' : 'visibility-off'}
                  size={20}
                  color={colors.onSurfaceVariant}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  editable={!isLoading}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons
                    name={showPassword ? 'check-circle' : 'radio-button-unchecked'}
                    size={20}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <MaterialIcons name="info" size={20} color={colors.primary} />
              <Text style={styles.infoText}>
                Use "Setup" tab to configure your Google Sheets credentials first
              </Text>
            </View>
          </View>
        )}

        {/* Setup Tab */}
        {activeTab === 'setup' && (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Configure Google Sheets</Text>

            {/* API Key Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Google API Key</Text>
              <TextInput
                style={[styles.input, styles.largeInput]}
                placeholder="Paste your Google API Key"
                value={apiKey}
                onChangeText={setApiKey}
                editable={!isLoading}
                multiline
              />
              <Text style={styles.helperText}>
                Get your API key from Google Cloud Console
              </Text>
            </View>

            {/* Sheet ID Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Google Sheet ID</Text>
              <TextInput
                style={[styles.input, styles.largeInput]}
                placeholder="Paste your Sheet ID from the URL"
                value={sheetId}
                onChangeText={setSheetId}
                editable={!isLoading}
                multiline
              />
              <Text style={styles.helperText}>
                Found in the URL: docs.google.com/spreadsheets/d/[SHEET_ID]
              </Text>
            </View>

            {/* Setup Button */}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSetupGoogleSheets}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.buttonText}>Save Configuration</Text>
              )}
            </TouchableOpacity>

            {/* Instructions */}
            <View style={styles.instructionsBox}>
              <Text style={styles.instructionsTitle}>Setup Instructions:</Text>
              <Text style={styles.instructionItem}>
                1. Go to Google Cloud Console and create a new project
              </Text>
              <Text style={styles.instructionItem}>
                2. Enable Google Sheets API
              </Text>
              <Text style={styles.instructionItem}>
                3. Create an API Key (Restricted to Google Sheets)
              </Text>
              <Text style={styles.instructionItem}>
                4. Create a Google Sheet with the required tabs
              </Text>
              <Text style={styles.instructionItem}>
                5. Paste the API Key and Sheet ID above
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    padding: spacing.gap20,
    paddingBottom: spacing.gap32,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.gap32,
  },
  title: {
    ...typography.headlineLarge,
    color: colors.onSurface,
    marginTop: spacing.gap16,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    marginTop: spacing.gap8,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: spacing.gap24,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.gap12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography.labelLarge,
    color: colors.onSurfaceVariant,
  },
  activeTabText: {
    color: colors.primary,
  },
  formContainer: {
    marginBottom: spacing.gap24,
  },
  sectionTitle: {
    ...typography.headlineSmall,
    color: colors.onSurface,
    marginBottom: spacing.gap20,
  },
  inputGroup: {
    marginBottom: spacing.gap20,
  },
  label: {
    ...typography.labelLarge,
    color: colors.onSurface,
    marginBottom: spacing.gap8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.md,
    paddingHorizontal: spacing.gap12,
    height: 48,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  input: {
    flex: 1,
    marginHorizontal: spacing.gap12,
    color: colors.onSurface,
    ...typography.bodyMedium,
  },
  largeInput: {
    minHeight: 100,
    paddingVertical: spacing.gap12,
  },
  helperText: {
    ...typography.labelSmall,
    color: colors.onSurfaceVariant,
    marginTop: spacing.gap8,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.gap16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.gap12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    ...typography.labelLarge,
    color: colors.onPrimary,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.md,
    padding: spacing.gap12,
    marginTop: spacing.gap20,
    gap: spacing.gap12,
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.onPrimaryContainer,
    flex: 1,
  },
  instructionsBox: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.md,
    padding: spacing.gap16,
    marginTop: spacing.gap20,
  },
  instructionsTitle: {
    ...typography.labelLarge,
    color: colors.onSurface,
    marginBottom: spacing.gap12,
  },
  instructionItem: {
    ...typography.bodySmall,
    color: colors.onSurface,
    marginBottom: spacing.gap8,
    marginLeft: spacing.gap12,
  },
});