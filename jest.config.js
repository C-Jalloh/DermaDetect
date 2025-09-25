module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-gesture-handler|@react-navigation|@reduxjs/toolkit|react-redux|@reduxjs/toolkit|redux-persist|moti|lottie-react-native|@react-native-async-storage/async-storage|react-native-paper|@callstack/react-native-paper|react-native-vector-icons|@expo/vector-icons|react-native-svg|@react-native-community/netinfo|react-native-netinfo|react-native-safe-area-context|react-native-screens|@react-native/assets-registry|@react-native/normalize-color|@react-native/polyfills|@gorhom/bottom-sheet)/)',
  ],
};
