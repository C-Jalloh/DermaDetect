import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, TextInput, Card, RadioButton } from 'react-native-paper';
import { theme } from '../../utils/theme';

interface RegisterPatientBottomSheetProps {
  onDismiss: () => void;
}

const RegisterPatientBottomSheet: React.FC<RegisterPatientBottomSheetProps> = ({
  onDismiss,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  const handleSave = () => {
    // TODO: Save patient to database
    console.log('Registering patient:', {
      firstName,
      lastName,
      dob,
      gender,
      contactInfo,
    });
    onDismiss();
  };

  const isFormValid = firstName && lastName && dob && gender && contactInfo;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Patient Registration</Text>

          <TextInput
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Date of Birth (YYYY-MM-DD)"
            value={dob}
            onChangeText={setDob}
            style={styles.input}
            mode="outlined"
            placeholder="e.g., 1990-01-15"
          />

          <Text style={styles.label}>Gender</Text>
          <RadioButton.Group onValueChange={setGender} value={gender}>
            <View style={styles.radioContainer}>
              <View style={styles.radioItem}>
                <RadioButton value="Male" />
                <Text style={styles.radioLabel}>Male</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="Female" />
                <Text style={styles.radioLabel}>Female</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="Other" />
                <Text style={styles.radioLabel}>Other</Text>
              </View>
            </View>
          </RadioButton.Group>

          <TextInput
            label="Contact Information"
            value={contactInfo}
            onChangeText={setContactInfo}
            style={styles.input}
            mode="outlined"
            placeholder="Phone number or email"
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
              disabled={!isFormValid}
            >
              Register Patient
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 8,
    marginTop: 8,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: theme.colors.textPrimary,
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

export default RegisterPatientBottomSheet;