// Color constants - Centralized for easy theming

export const COLORS = {
  // Primary colors
  PRIMARY: '#2563eb',
  PRIMARY_DARK: '#1d4ed8',
  PRIMARY_HOVER: '#1d4ed8',

  // Status colors
  SUCCESS: '#10b981',
  SUCCESS_BG: '#d1fae5',
  SUCCESS_TEXT: '#065f46',

  WARNING: '#f59e0b',
  WARNING_BG: '#fef3c7',
  WARNING_TEXT: '#92400e',

  INFO: '#3b82f6',
  INFO_BG: '#bfdbfe',
  INFO_TEXT: '#1e40af',

  DANGER: '#ef4444',
  DANGER_HOVER: '#dc2626',
  DANGER_BG: '#fee2e2',

  // Neutral colors
  GRAY_50: '#f9fafb',
  GRAY_100: '#f3f4f6',
  GRAY_200: '#e5e7eb',
  GRAY_300: '#d1d5db',
  GRAY_400: '#9ca3af',
  GRAY_500: '#6b7280',
  GRAY_600: '#4b5563',
  GRAY_700: '#374151',
  GRAY_800: '#1f2937',
  GRAY_900: '#111827',

  // UI colors
  WHITE: '#ffffff',
  BLACK: '#000000',
  BORDER: '#e5e7eb',
} as const;

export const BUTTON_STYLES = {
  primary: {
    backgroundColor: COLORS.PRIMARY,
    hoverBackgroundColor: COLORS.PRIMARY_HOVER,
    color: COLORS.WHITE,
  },
  danger: {
    backgroundColor: COLORS.DANGER,
    hoverBackgroundColor: COLORS.DANGER_HOVER,
    color: COLORS.WHITE,
  },
} as const;
