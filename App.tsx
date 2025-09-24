/**
 * DermaDetect - AI-Powered Dermatology Triage for Community Health Workers
 * https://github.com/your-org/dermadetect
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from './src/navigation/AppNavigator';
import { store, persistor } from './src/store';
import { theme } from './src/utils/theme';

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <PaperProvider theme={theme}>
              <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
              <AppNavigator />
            </PaperProvider>
          </PersistGate>
        </ReduxProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
