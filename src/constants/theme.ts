import '@/global.css';
import { Platform } from 'react-native';

export const DesignTokens = {
  colors: {
    primary: '#000000',
    onPrimary: '#ffffff',
    ink: '#000000',
    inkDeep: '#090909',
    charcoal: '#525252',
    body: '#737373',
    mute: '#a3a3a3',
    canvas: '#ffffff',
    surfaceSoft: '#fafafa',
    surfaceCard: '#ffffff',
    hairline: '#e5e5e5',
    hairlineStrong: '#d4d4d4',
    onDark: '#ffffff',
    onDarkMute: 'rgba(255, 255, 255, 0.7)',
    surfaceDark: '#171717',
    focusRing: 'rgba(59, 130, 246, 0.5)',
    terminalRed: '#ff5f56',
    terminalYellow: '#ffbd2e',
    terminalGreen: '#27c93f',
    link: '#000000',
    linkMute: '#737373',
  },
  rounded: {
    none: 0,
    sm: 6,
    md: 8,
    lg: 12,
    full: 9999,
  },
  spacing: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    section: 88,
  },
};

export const Colors = {
  light: {
    text: DesignTokens.colors.ink,
    background: DesignTokens.colors.canvas,
    backgroundElement: DesignTokens.colors.surfaceSoft,
    backgroundSelected: DesignTokens.colors.surfaceSoft,
    textSecondary: DesignTokens.colors.body,
    card: DesignTokens.colors.surfaceCard,
    border: DesignTokens.colors.hairline,
    primary: DesignTokens.colors.primary,
    primaryLight: DesignTokens.colors.surfaceSoft,
    success: DesignTokens.colors.terminalGreen,
    danger: DesignTokens.colors.terminalRed,
    warning: DesignTokens.colors.terminalYellow,
  },
  dark: {
    text: DesignTokens.colors.ink,
    background: DesignTokens.colors.canvas,
    backgroundElement: DesignTokens.colors.surfaceSoft,
    backgroundSelected: DesignTokens.colors.surfaceSoft,
    textSecondary: DesignTokens.colors.body,
    card: DesignTokens.colors.surfaceCard,
    border: DesignTokens.colors.hairline,
    primary: DesignTokens.colors.primary,
    primaryLight: DesignTokens.colors.surfaceSoft,
    success: DesignTokens.colors.terminalGreen,
    danger: DesignTokens.colors.terminalRed,
    warning: DesignTokens.colors.terminalYellow,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'SF Pro Rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
  section: 88,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 720;
