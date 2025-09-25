import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../utils/theme';
import AlertBottomSheet, { AlertBottomSheetRef } from '../../components/AlertBottomSheet';
import { HeartRateIcon } from '../../assets/icons';
import { apiService } from '../../services/api';

type AddVitalsRouteProp = RouteProp<{ AddVitals: { patientId: string } }, 'AddVitals'>;
type AddVitalsNavigationProp = StackNavigationProp<any, 'AddVitals'>;

interface Props {
  route: AddVitalsRouteProp;
}

const AddVitalsScreen: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation<AddVitalsNavigationProp>();
  const alertBottomSheetRef = useRef<AlertBottomSheetRef>(null);
  const [alertConfig, setAlertConfig] = useState<{title: string, message: string, buttons?: any[]} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { patientId } = route.params;
  const [formData, setFormData] = useState({
    temperature: '',
    bloodPressure: '',
    weight: '',
    notes: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Basic validation
    if (!formData.temperature || !formData.bloodPressure || !formData.weight) {
      setAlertConfig({ title: 'Error', message: 'Please fill in all required vital signs' });
      alertBottomSheetRef.current?.present();
      return;
    }

    setIsLoading(true);
    try {
      await apiService.createVitals(patientId, {
        temperature: `${formData.temperature}°F`,
        blood_pressure: formData.bloodPressure,
        weight: `${formData.weight}kg`,
        notes: formData.notes,
      });

      setAlertConfig({
        title: 'Success',
        message: 'Vitals recorded successfully',
        buttons: [{ text: 'OK', onPress: () => navigation.goBack() }]
      });
      alertBottomSheetRef.current?.present();
    } catch (error) {
      console.error('Error recording vitals:', error);
      setAlertConfig({
        title: 'Error',
        message: 'Failed to record vitals. Please try again.'
      });
      alertBottomSheetRef.current?.present();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <HeartRateIcon width={32} height={32} fill={theme.colors.primary} />
        <Text style={styles.title}>Add Vitals</Text>
        <Text style={styles.subtitle}>Record patient vital signs</Text>
      </View>

      <Card style={styles.formCard}>
        <Card.Content>
          <TextInput
            label="Temperature (°F) *"
            value={formData.temperature}
            onChangeText={(value) => handleInputChange('temperature', value)}
            keyboardType="numeric"
            placeholder="98.6"
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Blood Pressure *"
            value={formData.bloodPressure}
            onChangeText={(value) => handleInputChange('bloodPressure', value)}
            placeholder="120/80"
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Weight (kg) *"
            value={formData.weight}
            onChangeText={(value) => handleInputChange('weight', value)}
            keyboardType="numeric"
            placeholder="70"
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Notes"
            value={formData.notes}
            onChangeText={(value) => handleInputChange('notes', value)}
            multiline
            numberOfLines={4}
            placeholder="Describe patient's current condition, symptoms, or observations..."
            style={[styles.input, styles.notesInput]}
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
              {isLoading ? 'Saving...' : 'Save Vitals'}
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
  notesInput: {
    height: 100,
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

export default AddVitalsScreen;