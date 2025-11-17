import React, { useState } from 'react';
import {
 View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../lib/theme';
import { useGoogleSheets } from '../context/GoogleSheetsContext';
import { getDaysUntilExpiry, getExpiryStatus, formatDate, getExpiryStatusColor, getStockStatus, getStockStatusColor } from '../lib/utils';

export default function MedicinesScreen() {
  const { medicines, mainStoreStock, refreshAllData } = useGoogleSheets();
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filterExpiry, setFilterExpiry] = useState<'all' | 'expired' | 'expiring' | 'normal'>('all');

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshAllData();
    setRefreshing(false);
  };

  // Filter medicines
  const filteredMedicines = medicines
    .filter((med) => {
      if (!searchText) return true;
      return (
        med.name.toLowerCase().includes(searchText.toLowerCase()) ||
        med.brand.toLowerCase().includes(searchText.toLowerCase()) ||
        med.category.toLowerCase().includes(searchText.toLowerCase())
      );
    })
    .filter((med) => {
      if (filterExpiry === 'all') return true;
      return getExpiryStatus(med.expiryDate) === filterExpiry;
    });

  const renderMedicineCard = ({ item }: { item: any }) => {
    const stock = mainStoreStock.find((s) => s.medicineId === item.id);
    const daysToExpiry = getDaysUntilExpiry(item.expiryDate);
    const expiryStatus = getExpiryStatus(item.expiryDate);
    const stockStatus = getStockStatus(stock?.quantity || 0, item.safetyStockLevel);

    return (
      <TouchableOpacity style={styles.medicineCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text style={styles.medicineName}>{item.name}</Text>
            <Text style={styles.medicineDetails}>
              {item.brand} • {item.strength}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStockStatusColor(stockStatus) }]}>
            <Text style={styles.statusText}>
              {stock?.quantity || 0}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Category:</Text>
            <Text style={styles.value}>{item.category}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Batch:</Text>
            <Text style={styles.value}>{item.batchNo}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Price:</Text>
            <Text style={styles.value}>₹{item.sellingPrice}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View
            style={[
              styles.expiryBadge,
              { backgroundColor: getExpiryStatusColor(expiryStatus) },
            ]}
          >
            <Text style={styles.expiryText}>
              {daysToExpiry < 0 ? 'Expired' : `${daysToExpiry}d`}
            </Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="edit" size={18} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="more-vert" size={18} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={filteredMedicines}
        renderItem={renderMedicineCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Medicines</Text>

            {/* Search */}
            <View style={styles.searchContainer}>
              <MaterialIcons name="search" size={20} color={colors.onSurfaceVariant} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search medicines..."
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor={colors.onSurfaceVariant}
              />
              {searchText ? (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <MaterialIcons name="close" size={20} color={colors.onSurfaceVariant} />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterTabs}>
              {['all', 'expired', 'expiring', 'normal'].map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterTab,
                    filterExpiry === filter && styles.filterTabActive,
                  ]}
                  onPress={() => setFilterExpiry(filter as any)}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      filterExpiry === filter && styles.filterTabTextActive,
                    ]}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="inbox" size={64} color={colors.outline} />
            <Text style={styles.emptyText}>No medicines found</Text>
          </View>
        }
      />

      {/* FAB - Add Medicine */}
      <TouchableOpacity style={styles.fab}>
        <MaterialIcons name="add" size={28} color={colors.onPrimary} />
      </TouchableOpacity>
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
    marginBottom: spacing.gap16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.md,
    paddingHorizontal: spacing.gap12,
    height: 44,
    marginBottom: spacing.gap12,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: spacing.gap12,
    color: colors.onSurface,
    ...typography.bodyMedium,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: spacing.gap8,
  },
  filterTab: {
    paddingHorizontal: spacing.gap12,
    paddingVertical: spacing.gap8,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceVariant,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterTabText: {
    ...typography.labelSmall,
    color: colors.onSurfaceVariant,
  },
  filterTabTextActive: {
    color: colors.onPrimary,
  },
  medicineCard: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    marginBottom: spacing.gap12,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: spacing.gap12,
    paddingLeft: spacing.gap12,
    paddingRight: spacing.gap12,
  },
  cardInfo: {
    flex: 1,
  },
  medicineName: {
    ...typography.titleMedium,
    color: colors.onSurface,
  },
  medicineDetails: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginTop: spacing.gap4,
  },
  statusBadge: {
    paddingHorizontal: spacing.gap12,
    paddingVertical: spacing.gap6,
    borderRadius: radius.sm,
  },
  statusText: {
    ...typography.labelLarge,
    color: colors.onPrimary,
  },
  cardBody: {
    paddingHorizontal: spacing.gap12,
    paddingVertical: spacing.gap8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.gap4,
  },
  label: {
    ...typography.labelSmall,
    color: colors.onSurfaceVariant,
  },
  value: {
    ...typography.labelSmall,
    color: colors.onSurface,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.gap12,
    paddingVertical: spacing.gap12,
    borderTopWidth: 1,
    borderTopColor: colors.outline,
  },
  expiryBadge: {
    paddingHorizontal: spacing.gap8,
    paddingVertical: spacing.gap4,
    borderRadius: radius.xs,
  },
  expiryText: {
    ...typography.labelSmall,
    color: colors.onPrimary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.gap12,
  },
  actionButton: {
    padding: spacing.gap8,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.gap24,
    right: spacing.gap16,
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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