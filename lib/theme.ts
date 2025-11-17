// Mobile-first color system based on Material Design 3
export const colors = {
  // Primary brand colors
  primary: '#2563EB', // Vibrant blue
  onPrimary: '#FFFFFF',
  primaryContainer: '#DBEAFE',
  onPrimaryContainer: '#0C3B82',

  // Secondary colors
  secondary: '#7C3AED', // Purple
  onSecondary: '#FFFFFF',
  secondaryContainer: '#EDE9FE',
  onSecondaryContainer: '#3F0066',

  // Error states
  error: '#DC2626', // Red
  onError: '#FFFFFF',
  errorContainer: '#FECACA',
  onErrorContainer: '#7F1D1D',

  // Success states
  success: '#16A34A', // Green
  onSuccess: '#FFFFFF',

  // Warning states
  warning: '#EA580C', // Orange
  onWarning: '#FFFFFF',

  // Neutral surfaces
  surface: '#FFFFFF',
  onSurface: '#1F2937',
  surfaceVariant: '#F3F4F6',
  onSurfaceVariant: '#6B7280',

  // Outline for borders
  outline: '#D1D5DB',
  outlineVariant: '#E5E7EB',

  // Dark mode variants
  dark: {
    surface: '#1F2937',
    onSurface: '#F9FAFB',
    surfaceVariant: '#111827',
    onSurfaceVariant: '#D1D5DB',
    outline: '#6B7280',
    outlineVariant: '#4B5563',
  },

  // Status colors
  expired: '#DC2626',
  expiringWarning: '#EA580C',
  expiringCaution: '#F59E0B',
  lowStock: '#EA580C',
  normal: '#16A34A',
  disabled: '#9CA3AF',
};

// Typography styles for mobile
export const typography = {
  display: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
  },
  headlineLarge: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  headlineMedium: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  headlineSmall: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 26,
  },
  titleLarge: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  titleMedium: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  titleSmall: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 18,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  labelLarge: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
  },
  labelSmall: {
    fontSize: 11,
    fontWeight: '500' as const,
    lineHeight: 16,
  },
};

// Mobile-first spacing system (8px base unit)
export const spacing = {
  gap4: 4,
  gap6: 6,
  gap8: 8,
  gap12: 12,
  gap16: 16,
  gap20: 20,
  gap24: 24,
  gap32: 32,
};

// Border radius
export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};