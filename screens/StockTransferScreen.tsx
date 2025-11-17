import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../lib/theme';
import { useGoogleSheets } from '../context/GoogleSheetsContext';

export default function StockTransferScreen() {
  const { medicines, stores, mainStoreStock, subStoreStock, createTransfer } = useGoogleSheets();

  const [step, setStep] = useState<'select-medicine' | 'select-stores' | 'quantity' | 'confirm'>('select-medicine');
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
  const [fromStore, setFromStore] = useState<string>('');
  const [toStore, setToStore] = useState<string>('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMedicineSelect = (medicine: any) => {
    setSelectedMedicine(medicine);
    setStep('select-stores');
  };

  const handleStoresSelect = () => {
    if (!fromStore || !toStore) {
      Alert.alert('Error', 'Please select both source and destination stores');
      return;
    }
    if (fromStore === toStore) {
      Alert.alert('Error', 'Source and destination stores must be different');
      return;
    }
    setStep('quantity');
  };

  const handleQuantitySubmit = () => {
    if (!quantity || parseInt(quantity) <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }
    setStep('confirm');
  };

  const handleConfirmTransfer = async () => {
    try {
      setIsLoading(true);
      await createTransfer({
        medicineId: selectedMedicine.id,
        fromStore,
        toStore,
        quantity: parseInt(quantity),
        reason: 'transfer',
        notes,
        createdBy: 'current-user-id',
        status: 'completed',
      });
      Alert.alert('Success', 'Stock transferred successfully!');
      resetForm();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Transfer failed');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep('select-medicine');
    setSelectedMedicine(null);
    setFromStore('');
    setToStore('');
    setQuantity('');
    setNotes('');
  };

  // Step 1: Select Medicine
  if (step === 'select-medicine') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Transfer Stock</Text>
          <Text style={styles.subtitle}>Select a medicine to transfer</Text>
        </View>

        <FlatList
          data={medicines}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.medicineItem} onPress={() => handleMedicineSelect(item)}>
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetails}>{item.brand} • {item.strength}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      </SafeAreaView>
    );
  }

  // Step 2: Select Stores
  if (step === 'select-stores') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setStep('select-medicine')}>
              <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>Select Stores</Text>
          </View>

          {selectedMedicine && (
            <View style={styles.medicineCard}>
              <Text style={styles.medicineCardTitle}>{selectedMedicine.name}</Text>
              <Text style={styles.medicineCardSubtitle}>{selectedMedicine.brand}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>From Store (Source)</Text>
            <FlatList
              data={stores}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.storeOption, fromStore === item.id && styles.storeOptionActive]}
                  onPress={() => setFromStore(item.id)}
                >
                  <View style={styles.storeInfo}>
                    <Text style={styles.storeName}>{item.name}</Text>
                    <Text style={styles.storeType}>{item.type === 'main' ? 'Main Store' : 'Sub Store'}</Text>
                  </View>
                  {fromStore === item.id && (
                    <MaterialIcons name="check-circle" size={24} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>To Store (Destination)</Text>
            <FlatList
              data={stores}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.storeOption, toStore === item.id && styles.storeOptionActive]}
                  onPress={() => setToStore(item.id)}
                >
                  <View style={styles.storeInfo}>
                    <Text style={styles.storeName}>{item.name}</Text>
                    <Text style={styles.storeType}>{item.type === 'main' ? 'Main Store' : 'Sub Store'}</Text>
                  </View>
                  {toStore === item.id && (
                    <MaterialIcons name="check-circle" size={24} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleStoresSelect}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Step 3: Enter Quantity
  if (step === 'quantity') {
    const availableStock = fromStore === 'main'
      ? mainStoreStock.find((s) => s.medicineId === selectedMedicine.id)?.quantity || 0
      : subStoreStock.find((s) => s.medicineId === selectedMedicine.id && s.storeId === fromStore)?.quantity || 0;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.header, { flexDirection: 'row', gap: spacing.gap12 }]}>
            <TouchableOpacity onPress={() => setStep('select-stores')}>
              <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>Enter Quantity</Text>
          </View>

          <View style={styles.infoCard}>
            <MaterialIcons name="info" size={20} color={colors.primary} />
            <View style={{ flex: 1, marginLeft: spacing.gap12 }}>
              <Text style={styles.infoCardTitle}>Available Stock</Text>
              <Text style={styles.infoCardContent}>{availableStock} units in {fromStore === 'main' ? 'Main Store' : 'Sub Store'}</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantity to Transfer</Text>
            <TextInput
              style={styles.largeInput}
              keyboardType="number-pad"
              placeholder="Enter quantity"
              value={quantity}
              onChangeText={setQuantity}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.largeInput, styles.multilineInput]}
              placeholder="Add transfer notes"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleQuantitySubmit}>
            <Text style={styles.buttonText}>Review Transfer</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Step 4: Confirm
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, { flexDirection: 'row', gap: spacing.gap12 }]}>
          <TouchableOpacity onPress={() => setStep('quantity')}>
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Confirm Transfer</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Medicine</Text>
            <Text style={styles.summaryValue}>{selectedMedicine?.name}</Text>
          </View>
          <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: colors.outline, paddingTop: spacing.gap12, marginTop: spacing.gap12 }]}>
            <Text style={styles.summaryLabel}>From</Text>
            <Text style={styles.summaryValue}>{stores.find((s) => s.id === fromStore)?.name}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>To</Text>
            <Text style={styles.summaryValue}>{stores.find((s) => s.id === toStore)?.name}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Quantity</Text>
            <Text style={styles.summaryValue}>{quantity} units</Text>
          </View>
          {notes && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Notes</Text>
              <Text style={styles.summaryValue}>{notes}</Text>
            </View>
          )}
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.gap12 }}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={resetForm}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { flex: 1 }]} onPress={handleConfirmTransfer} disabled={isLoading}>
            <Text style={styles.buttonText}>{isLoading ? 'Processing...' : 'Confirm Transfer'}</Text>
          </TouchableOpacity>
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
    padding: spacing.gap16,
    paddingBottom: spacing.gap24,
  },
  header: {
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
  listContent: {
    paddingHorizontal: spacing.gap16,
    paddingBottom: spacing.gap24,
  },
  medicineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.md,
    padding: spacing.gap16,
    marginBottom: spacing.gap12,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  itemName: {
    ...typography.titleMedium,
    color: colors.onSurface,
  },
  itemDetails: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginTop: spacing.gap4,
  },
  medicineCard: {
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.md,
    padding: spacing.gap16,
    marginBottom: spacing.gap20,
  },
  medicineCardTitle: {
    ...typography.titleMedium,
    color: colors.onPrimaryContainer,
  },
  medicineCardSubtitle: {
    ...typography.bodySmall,
    color: colors.onPrimaryContainer,
    marginTop: spacing.gap4,
  },
  section: {
    marginBottom: spacing.gap20,
  },
  sectionTitle: {
    ...typography.titleMedium,
    color: colors.onSurface,
    marginBottom: spacing.gap12,
  },
  storeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.md,
    padding: spacing.gap16,
    marginBottom: spacing.gap12,
    borderWidth: 2,
    borderColor: colors.outline,
  },
  storeOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryContainer,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    ...typography.titleMedium,
    color: colors.onSurface,
  },
  storeType: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginTop: spacing.gap4,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.gap16,
    alignItems: 'center',
    marginTop: spacing.gap12,
  },
  buttonText: {
    ...typography.labelLarge,
    color: colors.onPrimary,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.surfaceVariant,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  cancelButtonText: {
    ...typography.labelLarge,
    color: colors.onSurfaceVariant,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.md,
    padding: spacing.gap16,
    marginBottom: spacing.gap20,
  },
  infoCardTitle: {
    ...typography.labelLarge,
    color: colors.onPrimaryContainer,
  },
  infoCardContent: {
    ...typography.bodySmall,
    color: colors.onPrimaryContainer,
    marginTop: spacing.gap4,
  },
  inputGroup: {
    marginBottom: spacing.gap20,
  },
  label: {
    ...typography.labelLarge,
    color: colors.onSurface,
    marginBottom: spacing.gap8,
  },
  largeInput: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.outline,
    paddingHorizontal: spacing.gap16,
    paddingVertical: spacing.gap12,
    color: colors.onSurface,
    ...typography.bodyMedium,
  },
  multilineInput: {
    minHeight: 80,
    paddingTop: spacing.gap12,
  },
  summaryCard: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.md,
    padding: spacing.gap16,
    marginBottom: spacing.gap20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.gap12,
  },
  summaryLabel: {
    ...typography.labelMedium,
    color: colors.onSurfaceVariant,
  },
  summaryValue: {
    ...typography.labelMedium,
    color: colors.onSurface,
    fontWeight: '600' as const,
  },
});