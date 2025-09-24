import { MD3DarkTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
  fontFamily: 'System',
};

export const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#00BFFF', // Electric blue for icons and interactive elements
    secondary: '#00BFFF',
    error: '#F44336',
    background: '#0A0E1A', // Deep dark navy blue
    surface: 'rgba(255, 255, 255, 0.05)', // Semi-transparent glassmorphic surface
    onSurface: '#FFFFFF',
    surfaceVariant: 'rgba(255, 255, 255, 0.08)', // Slightly more opaque for cards
    onSurfaceVariant: 'rgba(255, 255, 255, 0.7)',
    // Custom colors for risk levels - vibrant and clear
    riskLow: '#4CAF50', // Green for "Not Serious/Safe"
    riskMedium: '#FF9800', // Orange/Yellow for "Needs Attention"
    riskHigh: '#F44336', // Red for "Very Serious"
    // Glassmorphic styling
    cardBackground: 'rgba(255, 255, 255, 0.05)',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    textTertiary: 'rgba(255, 255, 255, 0.5)',
    // Accent colors
    accent: '#00BFFF',
    success: '#4CAF50',
    warning: '#FF9800',
    danger: '#F44336',
  },
  fonts: configureFonts({ config: fontConfig }),
};