import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CHWTabParamList } from '../../navigation/CHWNavigator';
import { theme } from '../../utils/theme';
import AlertBottomSheet, { AlertBottomSheetRef } from '../../components/AlertBottomSheet';

type PatientRegistrationNavigationProp = StackNavigationProp<CHWTabParamList, 'CHWRegisterPatient'>;

const PatientRegistrationScreen: React.FC = () => {
  const navigation = useNavigation<PatientRegistrationNavigationProp>();
  const alertBottomSheetRef = useRef<AlertBottomSheetRef>(null);
  const [alertConfig, setAlertConfig] = useState<{title: string, message: string, buttons?: any[]} | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    contactPhone: '',
    emergencyContact: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.dob || !formData.gender) {
      setAlertConfig({ title: 'Error', message: 'Please fill in all required fields' });
      alertBottomSheetRef.current?.present();
      return;
    }

    // TODO: Save to database
    setAlertConfig({
      title: 'Success',
      message: 'Patient registered successfully',
      buttons: [{ text: 'OK', onPress: () => navigation.goBack() }]
    });
    alertBottomSheetRef.current?.present();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <FontAwesome5 name="user-plus" size={32} color={theme.colors.primary} solid />
        <Text style={styles.title}>Register New Patient</Text>
        <Text style={styles.subtitle}>Enter patient demographic information</Text>
      </View>

      <Card style={styles.formCard}>
        <Card.Content>
          <TextInput
            label="First Name *"
            value={formData.firstName}
            onChangeText={(value) => handleInputChange('firstName', value)}
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Last Name *"
            value={formData.lastName}
            onChangeText={(value) => handleInputChange('lastName', value)}
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Date of Birth (YYYY-MM-DD) *"
            value={formData.dob}
            onChangeText={(value) => handleInputChange('dob', value)}
            placeholder="1990-01-15"
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Gender *"
            value={formData.gender}
            onChangeText={(value) => handleInputChange('gender', value)}
            placeholder="Male/Female/Other"
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Contact Phone Number"
            value={formData.contactPhone}
            onChangeText={(value) => handleInputChange('contactPhone', value)}
            keyboardType="phone-pad"
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Emergency Contact"
            value={formData.emergencyContact}
            onChangeText={(value) => handleInputChange('emergencyContact', value)}
            placeholder="Name and phone number"
            style={styles.input}
            mode="outlined"
          />

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={[styles.button, styles.cancelButton]}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              style={[styles.button, styles.saveButton]}
            >
              Save Patient
            </Button>
          </View>
        </Card.Content>
      </Card>
      <AlertBottomSheet
        ref={alertBottomSheetRef}
        title={alertConfig?.title || ''}
        message={alertConfig?.message || ''}
        buttons={alertConfig?.buttons}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  formCard: {
    margin: 16,
    backgroundColor: theme.colors.cardBackground,
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme.colors.background,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    borderColor: theme.colors.textSecondary,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
});

export default PatientRegistrationScreen;