import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CHWTabParamList } from '../../navigation/CHWNavigator';
import { theme } from '../../utils/theme';
import AlertBottomSheet, { AlertBottomSheetRef } from '../../components/AlertBottomSheet';
import { PersonIcon } from '../../assets/icons';
import { apiService } from '../../services/api';

type PatientRegistrationNavigationProp = StackNavigationProp<CHWTabParamList, 'CHWRegisterPatient'>;

const PatientRegistrationScreen: React.FC = () => {
  const navigation = useNavigation<PatientRegistrationNavigationProp>();
  const alertBottomSheetRef = useRef<AlertBottomSheetRef>(null);
  const [alertConfig, setAlertConfig] = useState<{title: string, message: string, buttons?: any[]} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSave = async () => {
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.dob || !formData.gender) {
      setAlertConfig({ title: 'Error', message: 'Please fill in all required fields' });
      alertBottomSheetRef.current?.present();
      return;
    }

    setIsLoading(true);
    try {
      // Prepare patient data for API - demographics should be a JSON string
      const demographics = {
        name: `${formData.firstName} ${formData.lastName}`,
        age: formData.dob ? new Date().getFullYear() - new Date(formData.dob).getFullYear() : null,
        gender: formData.gender,
        phone: formData.contactPhone,
        address: '', // Could be added to form later
        emergency_contact: formData.emergencyContact,
      };

      const patientData = {
        demographics: JSON.stringify(demographics)
      };

      // Call API to create patient
      await apiService.createPatient(patientData);

      setAlertConfig({
        title: 'Success',
        message: 'Patient registered successfully',
        buttons: [{ text: 'OK', onPress: () => navigation.goBack() }]
      });
      alertBottomSheetRef.current?.present();
    } catch (error) {
      console.error('Error creating patient:', error);
      setAlertConfig({
        title: 'Error',
        message: 'Failed to register patient. Please try again.'
      });
      alertBottomSheetRef.current?.present();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <PersonIcon width={32} height={32} fill={theme.colors.primary} />
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
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Patient'}
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