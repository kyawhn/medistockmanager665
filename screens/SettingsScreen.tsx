import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../lib/theme';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            Alert.alert('Error', 'Failed to logout');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.title}>Settings</Text>

        {/* User Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <View style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              <MaterialIcons name="account-circle" size={56} color={colors.primary} />
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || 'User'}</Text>
              <Text style={styles.profileEmail}>{user?.email || 'No email'}</Text>
              <Text style={styles.profileRole}>
                {user?.role === 'admin' ? '👨‍💼 Administrator' : '👤 Storekeeper'}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={{ flex: 1 }}>
              <MaterialIcons name="edit" size={24} color={colors.onSurfaceVariant} />
            </View>
            <View style={{ flex: 9 }}>
              <Text style={styles.settingLabel}>Edit Profile</Text>
              <Text style={styles.settingDescription}>Update your personal information</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={{ flex: 1 }}>
              <MaterialIcons name="lock" size={24} color={colors.onSurfaceVariant} />
            </View>
            <View style={{ flex: 9 }}>
              <Text style={styles.settingLabel}>Change Password</Text>
              <Text style={styles.settingDescription}>Update your security settings</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
          </TouchableOpacity>
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>

          {/* Theme Toggle */}
          <View style={styles.settingItem}>
            <View style={{ flex: 1 }}>
              <MaterialIcons
                name={theme === 'dark' ? 'dark-mode' : 'light-mode'}
                size={24}
                color={colors.onSurfaceVariant}
              />
            </View>
            <View style={{ flex: 9 }}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingDescription}>Toggle dark theme</Text>
            </View>
            <Switch value={theme === 'dark'} onValueChange={toggleTheme} trackColor={{ false: colors.outline, true: colors.primary }} />
          </View>

          {/* Notifications Toggle */}
          <View style={styles.settingItem}>
            <View style={{ flex: 1 }}>
              <MaterialIcons name="notifications" size={24} color={colors.onSurfaceVariant} />
            </View>
            <View style={{ flex: 9 }}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingDescription}>Low stock & expiry alerts</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.outline, true: colors.primary }}
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={{ flex: 1 }}>
              <MaterialIcons name="sync" size={24} color={colors.onSurfaceVariant} />
            </View>
            <View style={{ flex: 9 }}>
              <Text style={styles.settingLabel}>Auto Sync</Text>
              <Text style={styles.settingDescription}>Sync data every 5 minutes</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
          </TouchableOpacity>
        </View>

        {/* Data & Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Privacy</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={{ flex: 1 }}>
              <MaterialIcons name="cloud-download" size={24} color={colors.onSurfaceVariant} />
            </View>
            <View style={{ flex: 9 }}>
              <Text style={styles.settingLabel}>Export Inventory</Text>
              <Text style={styles.settingDescription}>Download as CSV or PDF</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={{ flex: 1 }}>
              <MaterialIcons name="backup" size={24} color={colors.onSurfaceVariant} />
            </View>
            <View style={{ flex: 9 }}>
              <Text style={styles.settingLabel}>Backup Data</Text>
              <Text style={styles.settingDescription}>Create a backup of all data</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={{ flex: 1 }}>
              <MaterialIcons name="privacy-tip" size={24} color={colors.onSurfaceVariant} />
            </View>
            <View style={{ flex: 9 }}>
              <Text style={styles.settingLabel}>Privacy Policy</Text>
              <Text style={styles.settingDescription}>View our privacy policies</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
          </TouchableOpacity>
        </View>

        {/* Google Sheets Configuration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Google Sheets</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={{ flex: 1 }}>
              <MaterialIcons name="table-chart" size={24} color={colors.onSurfaceVariant} />
            </View>
            <View style={{ flex: 9 }}>
              <Text style={styles.settingLabel}>Sheet Configuration</Text>
              <Text style={styles.settingDescription}>Update API key and Sheet ID</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={{ flex: 1 }}>
              <MaterialIcons name="cloud-sync" size={24} color={colors.onSurfaceVariant} />
            </View>
            <View style={{ flex: 9 }}>
              <Text style={styles.settingLabel}>Sync Now</Text>
              <Text style={styles.settingDescription}>Force sync with Google Sheets</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
          </TouchableOpacity>
        </View>

        {/* About & Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About & Support</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={{ flex: 1 }}>
              <MaterialIcons name="info" size={24} color={colors.onSurfaceVariant} />
            </View>
            <View style={{ flex: 9 }}>
              <Text style={styles.settingLabel}>About MediTrack</Text>
              <Text style={styles.settingDescription}>Version 1.0.0</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={{ flex: 1 }}>
              <MaterialIcons name="help" size={24} color={colors.onSurfaceVariant} />
            </View>
            <View style={{ flex: 9 }}>
              <Text style={styles.settingLabel}>Help & Support</Text>
              <Text style={styles.settingDescription}>FAQs and contact support</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.dangerButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color={colors.onError} />
          <Text style={styles.dangerButtonText}>Logout</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>MediTrack © 2025</Text>
          <Text style={styles.footerSubtext}>Medicine Inventory Management System</Text>
        </View>
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
    paddingHorizontal: spacing.gap16,
    paddingBottom: spacing.gap32,
  },
  title: {
    ...typography.headlineSmall,
    color: colors.onSurface,
    marginTop: spacing.gap12,
    marginBottom: spacing.gap20,
  },
  section: {
    marginBottom: spacing.gap24,
  },
  sectionTitle: {
    ...typography.titleMedium,
    color: colors.onSurface,
    marginBottom: spacing.gap12,
    marginLeft: spacing.gap4,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.lg,
    padding: spacing.gap16,
    marginBottom: spacing.gap12,
  },
  profileAvatar: {
    marginRight: spacing.gap16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...typography.titleMedium,
    color: colors.onSurface,
  },
  profileEmail: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginTop: spacing.gap4,
  },
  profileRole: {
    ...typography.labelSmall,
    color: colors.primary,
    marginTop: spacing.gap6,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.md,
    paddingHorizontal: spacing.gap12,
    paddingVertical: spacing.gap12,
    marginBottom: spacing.gap8,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  settingLabel: {
    ...typography.titleMedium,
    color: colors.onSurface,
  },
  settingDescription: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginTop: spacing.gap4,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    borderRadius: radius.md,
    paddingVertical: spacing.gap16,
    marginTop: spacing.gap24,
    gap: spacing.gap8,
  },
  dangerButtonText: {
    ...typography.labelLarge,
    color: colors.onError,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.gap32,
    paddingVertical: spacing.gap16,
  },
  footerText: {
    ...typography.bodySmall,
    color: colors.onSurface,
    fontWeight: '600' as const,
  },
  footerSubtext: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginTop: spacing.gap4,
  },
});