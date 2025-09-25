// jest.setup.js
/* global jest */
import 'react-native-gesture-handler/jestSetup';

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const {View} = require('react-native');
  return {
    GestureHandlerRootView: View,
    PanGestureHandler: View,
    TapGestureHandler: View,
    State: {
      UNDETERMINED: 0,
      FAILED: 1,
      BEGAN: 2,
      CANCELLED: 3,
      ACTIVE: 4,
      END: 5,
    },
  };
});

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => ({
  useSharedValue: jest.fn(() => ({ value: 0 })),
  useAnimatedStyle: jest.fn(() => ({})),
  withTiming: jest.fn(),
  withSpring: jest.fn(),
  runOnJS: jest.fn(),
  interpolate: jest.fn(),
  Extrapolate: {
    CLAMP: 'clamp',
  },
}));

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons', () => ({
  createIconSet: () => {},
}));

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native-paper
jest.mock('react-native-paper', () => ({
  ...jest.requireActual('react-native-paper'),
  useTheme: () => ({
    colors: {
      primary: '#007AFF',
      background: '#FFFFFF',
      surface: '#FFFFFF',
      text: '#000000',
      textSecondary: '#666666',
      cardBackground: '#FFFFFF',
      riskHigh: '#FF3B30',
      riskLow: '#34C759',
    },
  }),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock react-native-screens
jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
  ScreenContainer: ({ children }) => children,
  Screen: ({ children }) => children,
}));

// Mock react-native-svg
jest.mock('react-native-svg', () => ({
  Svg: () => null,
  Circle: () => null,
  Rect: () => null,
  Path: () => null,
  G: () => null,
  Text: () => null,
  TSpan: () => null,
  Line: () => null,
  Polygon: () => null,
  Polyline: () => null,
  Defs: () => null,
  Stop: () => null,
  LinearGradient: () => null,
  RadialGradient: () => null,
  ClipPath: () => null,
  Mask: () => null,
  Use: () => null,
  Symbol: () => null,
  Ellipse: () => null,
  Image: () => null,
  Pattern: () => null,
  Marker: () => null,
}));

// Mock lottie-react-native
jest.mock('lottie-react-native', () => 'LottieView');

// Mock react-native-vision-camera
jest.mock('react-native-vision-camera', () => ({
  Camera: () => null,
  useCameraDevices: () => ({ devices: [], selectedDevice: null }),
  useCameraPermission: () => ({ hasPermission: true, requestPermission: jest.fn() }),
}));

// Mock redux-persist
jest.mock('redux-persist', () => ({
  persistStore: jest.fn(),
  persistReducer: jest.fn((config, reducers) => reducers),
  PersistGate: ({ children }) => children,
}));

// Mock @gorhom/bottom-sheet
jest.mock('@gorhom/bottom-sheet', () => ({
  BottomSheetModalProvider: ({ children }) => children,
  BottomSheetModal: () => null,
  BottomSheetView: () => null,
  useBottomSheetModal: () => ({
    present: jest.fn(),
    dismiss: jest.fn(),
  }),
}));

// Mock console.warn to reduce noise in tests
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning: React.jsx: type is invalid')
  ) {
    return;
  }
  originalWarn.call(console, ...args);
};