import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../lib/theme';
import { useGoogleSheets } from '../context/GoogleSheetsContext';
import { useAuth } from '../context/AuthContext';
import { formatDateTime } from '../lib/utils';

export default function DashboardScreen() {
  const { medicines, mainStoreStock, isLoading, isSyncing, lastSync, refreshAllData, getDashboardStats } = useGoogleSheets();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const stats = getDashboardStats();

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshAllData();
    setRefreshing(false);
  };

  // Get alerts for display
  const criticalAlerts = medicines.filter((med) => {
    const mainStock = mainStoreStock.find((s) => s.medicineId === med.id);
    return (mainStock?.quantity || 0) < med.safetyStockLevel && med.status === 'active';
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name || 'User'}</Text>
            <Text style={styles.role}>{user?.role === 'admin' ? 'Administrator' : 'Storekeeper'}</Text>
          </View>
          <MaterialIcons name="local-pharmacy" size={36} color={colors.primary} />
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statPrimary]}>
            <MaterialIcons name="medication" size={32} color={colors.primary} />
            <Text style={styles.statValue}>{stats.totalMedicines}</Text>
            <Text style={styles.statLabel}>Total Medicines</Text>
          </View>

          <View style={[styles.statCard, styles.statWarning]}>
            <MaterialIcons name="warning" size={32} color={colors.warning} />
            <Text style={styles.statValue}>{stats.lowStockCount}</Text>
            <Text style={styles.statLabel}>Low Stock</Text>
          </View>

          <View style={[styles.statCard, styles.statError]}>
            <MaterialIcons name="schedule" size={32} color={colors.error} />
            <Text style={styles.statValue}>{stats.expiredCount}</Text>
            <Text style={styles.statLabel}>Expired</Text>
          </View>

          <View style={[styles.statCard, styles.statCaution]}>
            <MaterialIcons name="access-time" size={32} color={colors.expiringCaution} />
            <Text style={styles.statValue}>{stats.expiringCount}</Text>
            <Text style={styles.statLabel}>Expiring Soon</Text>
          </View>
        </View>

        {/* Alerts Section */}
        {criticalAlerts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Critical Alerts</Text>
            <FlatList
              data={criticalAlerts.slice(0, 3)}
              renderItem={({ item }) => {
                const stock = mainStoreStock.find((s) => s.medicineId === item.id);
                return (
                  <View style={styles.alertCard}>
                    <View style={[styles.alertBadge, { backgroundColor: colors.error }]}>
                      <MaterialIcons name="warning" size={16} color={colors.onError} />
                    </View>
                    <View style={styles.alertContent}>
                      <Text style={styles.alertTitle}>{item.name}</Text>
                      <Text style={styles.alertDescription}>
                        Stock: {stock?.quantity || 0} / {item.safetyStockLevel} (Safety Level)
                      </Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
                  </View>
                );
              }}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
            />
          </View>
        )}

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionGrid}>
            <TouchableOpacity style={styles.quickAction}>
              <MaterialIcons name="add-circle" size={28} color={colors.primary} />
              <Text style={styles.quickActionText}>Add Medicine</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAction}>
              <MaterialIcons name="compare-arrows" size={28} color={colors.secondary} />
              <Text style={styles.quickActionText}>Transfer Stock</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAction}>
              <MaterialIcons name="receipt" size={28} color={colors.primary} />
              <Text style={styles.quickActionText}>View Log</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAction}>
              <MaterialIcons name="search" size={28} color={colors.secondary} />
              <Text style={styles.quickActionText}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Last Sync Info */}
        <View style={styles.section}>
          <View style={styles.syncInfo}>
            <MaterialIcons name="cloud-sync" size={20} color={colors.onSurfaceVariant} />
            <Text style={styles.syncText}>
              Last synced: {lastSync ? formatDateTime(lastSync.toISOString()) : 'Never'}
            </Text>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.gap12,
    marginBottom: spacing.gap24,
  },
  greeting: {
    ...typography.headlineSmall,
    color: colors.onSurface,
  },
  role: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginTop: spacing.gap4,
  },
  statsGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gap12,
    marginBottom: spacing.gap24,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.lg,
    padding: spacing.gap16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  statPrimary: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  statWarning: {
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  statError: {
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  statCaution: {
    borderLeftWidth: 4,
    borderLeftColor: colors.expiringCaution,
  },
  statValue: {
    ...typography.display,
    color: colors.onSurface,
    marginTop: spacing.gap8,
  },
  statLabel: {
    ...typography.labelMedium,
    color: colors.onSurfaceVariant,
    marginTop: spacing.gap4,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.gap24,
  },
  sectionTitle: {
    ...typography.titleMedium,
    color: colors.onSurface,
    marginBottom: spacing.gap12,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorContainer,
    borderRadius: radius.md,
    padding: spacing.gap12,
    marginBottom: spacing.gap8,
  },
  alertBadge: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.gap12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    ...typography.labelLarge,
    color: colors.onErrorContainer,
  },
  alertDescription: {
    ...typography.bodySmall,
    color: colors.onErrorContainer,
    marginTop: spacing.gap4,
  },
  quickActionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gap12,
  },
  quickAction: {
    width: '48%',
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.md,
    padding: spacing.gap16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  quickActionText: {
    ...typography.labelMedium,
    color: colors.onSurface,
    marginTop: spacing.gap8,
    textAlign: 'center',
  },
  syncInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.md,
    padding: spacing.gap12,
    gap: spacing.gap8,
  },
  syncText: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
  },
});