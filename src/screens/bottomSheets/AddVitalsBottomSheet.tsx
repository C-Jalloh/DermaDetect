import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, TextInput, Card } from 'react-native-paper';
import { theme } from '../../utils/theme';

interface AddVitalsBottomSheetProps {
  patientId: string | null;
  onDismiss: () => void;
}

const AddVitalsBottomSheet: React.FC<AddVitalsBottomSheetProps> = ({
  patientId,
  onDismiss,
}) => {
  const [bloodPressure, setBloodPressure] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [temperature, setTemperature] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    // TODO: Save vitals to database
    console.log('Saving vitals for patient:', patientId, {
      bloodPressure,
      heartRate,
      temperature,
      weight,
      notes,
    });
    onDismiss();
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Add/Update Vitals</Text>

          <TextInput
            label="Blood Pressure (e.g., 120/80)"
            value={bloodPressure}
            onChangeText={setBloodPressure}
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Heart Rate (bpm)"
            value={heartRate}
            onChangeText={setHeartRate}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
          />

          <TextInput
            label="Temperature (°F)"
            value={temperature}
            onChangeText={setTemperature}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
          />

          <TextInput
            label="Weight (lbs)"
            value={weight}
            onChangeText={setWeight}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
          />

          <TextInput
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={3}
          />

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={onDismiss}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.saveButton}
            >
              Save Vitals
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: theme.colors.cardBackground,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
    backgroundColor: theme.colors.surface,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default AddVitalsBottomSheet;