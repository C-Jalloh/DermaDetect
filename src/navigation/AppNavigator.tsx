import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { store, persistor } from '../store';
import { RootState } from '../store';
import { theme } from '../utils/theme';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import CHWNavigator from './CHWNavigator';
import DoctorNavigator from './DoctorNavigator';
import CameraScreen from '../screens/CameraScreen';
import ResultScreen from '../screens/ResultScreen';
import PatientConsentScreen from '../screens/PatientConsentScreen';
import CHWSettingsScreen from '../screens/chw/CHWSettingsScreen';
import DoctorSettingsScreen from '../screens/doctor/DoctorSettingsScreen';
import PatientProfileCHWScreen from '../screens/chw/PatientProfileCHWScreen';
import PatientRegistrationScreen from '../screens/chw/PatientRegistrationScreen';
import PatientProfileDoctorScreen from '../screens/doctor/PatientProfileDoctorScreen';
import AddVitalsScreen from '../screens/chw/AddVitalsScreen';
import DiagnosisScreen from '../screens/doctor/DiagnosisScreen';

export type RootStackParamList = {
  Login: undefined;
  CHWMain: undefined;
  DoctorMain: undefined;
  Camera: { patientId: string };
  Result: { imageUri: string; additionalImages?: string[]; patientId: string };
  PatientConsent: { patientId?: string };
  CHWSettings: undefined;
  DoctorSettings: undefined;
  PatientProfileCHW: { patientId: string };
  PatientRegistration: undefined;
  PatientProfileDoctor: { patientId: string };
  AddVitals: { patientId: string };
  Diagnosis: { triageId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

// Root navigator component that handles role-based routing
const AppNavigatorContent: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => {
    console.log('useSelector called, auth state:', state.auth);
    return state.auth;
  });

  console.log('AppNavigatorContent render:', { user, isAuthenticated });

  if (!isAuthenticated || !user) {
    return <LoginScreen />;
  }

  const initialRouteName = user.role === 'CHW' ? 'CHWMain' : 'DoctorMain';

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen
        name="CHWMain"
        component={CHWNavigator}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="DoctorMain"
        component={DoctorNavigator}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
      <Stack.Screen name="PatientConsent" component={PatientConsentScreen} />
      <Stack.Screen name="CHWSettings" component={CHWSettingsScreen} />
      <Stack.Screen name="DoctorSettings" component={DoctorSettingsScreen} />
      <Stack.Screen name="PatientProfileCHW" component={PatientProfileCHWScreen} />
      <Stack.Screen name="PatientRegistration" component={PatientRegistrationScreen} />
      <Stack.Screen name="PatientProfileDoctor" component={PatientProfileDoctorScreen} />
      <Stack.Screen name="AddVitals" component={AddVitalsScreen} />
      <Stack.Screen name="Diagnosis" component={DiagnosisScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View style={styles.loadingContainer}>
            <Text>Loading...</Text>
          </View>
        }
        persistor={persistor}
      >
        <PaperProvider theme={theme}>
          <BottomSheetModalProvider>
            <NavigationContainer>
              <AppNavigatorContent />
            </NavigationContainer>
          </BottomSheetModalProvider>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;