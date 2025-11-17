import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../lib/theme';
import { useGoogleSheets } from '../context/GoogleSheetsContext';
import { formatDateTime } from '../lib/utils';

export default function TransactionsScreen() {
  const { transactions, refreshAllData } = useGoogleSheets();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshAllData();
    setRefreshing(false);
  };

  const getTransactionIcon = (type: string) => {
    const icons: Record<string, any> = {
      medicine_added: { name: 'add-circle', color: colors.success },
      medicine_edited: { name: 'edit', color: colors.primary },
      medicine_deleted: { name: 'delete', color: colors.error },
      stock_transfer: { name: 'compare-arrows', color: colors.secondary },
      stock_deduction: { name: 'remove-circle', color: colors.warning },
      login: { name: 'login', color: colors.primary },
    };
    return icons[type] || { name: 'info', color: colors.onSurfaceVariant };
  };

  const renderTransaction = ({ item }: { item: any }) => {
    const icon = getTransactionIcon(item.type);

    return (
      <View style={styles.transactionCard}>
        <View style={[styles.iconBadge, { backgroundColor: icon.color }]}>
          <MaterialIcons name={icon.name} size={18} color={colors.onPrimary} />
        </View>

        <View style={styles.transactionContent}>
          <Text style={styles.transactionDescription}>{item.description}</Text>
          <View style={styles.transactionMeta}>
            <Text style={styles.transactionType}>{item.type.replace(/_/g, ' ').toUpperCase()}</Text>
            <Text style={styles.transactionTime}>{formatDateTime(item.createdAt)}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.expandButton}>
          <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Transaction Log</Text>
            <Text style={styles.subtitle}>All system activities and changes</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="history" size={64} color={colors.outline} />
            <Text style={styles.emptyText}>No transactions yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  listContent: {
    paddingHorizontal: spacing.gap16,
    paddingBottom: spacing.gap24,
  },
  header: {
    marginTop: spacing.gap12,
    marginBottom: spacing.gap20,
  },
  title: {
    ...typography.headlineSmall,
    color: colors.onSurface,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginTop: spacing.gap4,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.md,
    padding: spacing.gap12,
    marginBottom: spacing.gap12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.gap12,
  },
  transactionContent: {
    flex: 1,
  },
  transactionDescription: {
    ...typography.titleMedium,
    color: colors.onSurface,
  },
  transactionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.gap6,
  },
  transactionType: {
    ...typography.labelSmall,
    color: colors.onSurfaceVariant,
  },
  transactionTime: {
    ...typography.labelSmall,
    color: colors.onSurfaceVariant,
  },
  expandButton: {
    padding: spacing.gap8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.gap32,
  },
  emptyText: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    marginTop: spacing.gap12,
  },
});