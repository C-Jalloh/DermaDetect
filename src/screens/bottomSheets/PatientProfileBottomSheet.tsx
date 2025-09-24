import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { theme } from '../../utils/theme';
import BaseBottomSheet from '../../components/BaseBottomSheet';
import AddVitalsBottomSheet from './AddVitalsBottomSheet';

// Mock patient data - in real app, fetch from database
const getMockPatient = (patientId: string | null) => {
  const patients = {
    '1': {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      dob: '1985-03-15',
      gender: 'Male',
      contactInfo: '+1234567890',
      lastVisit: '2024-09-20',
      vitals: {
        bloodPressure: '120/80',
        heartRate: '72 bpm',
        temperature: '98.6°F',
        weight: '180 lbs',
      },
    },
    '2': {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      dob: '1990-07-22',
      gender: 'Female',
      contactInfo: '+1234567891',
      lastVisit: '2024-09-18',
      vitals: {
        bloodPressure: '118/75',
        heartRate: '68 bpm',
        temperature: '98.4°F',
        weight: '145 lbs',
      },
    },
  };
  return patientId ? patients[patientId as keyof typeof patients] : null;
};

interface PatientProfileBottomSheetProps {
  patientId: string | null;
  onDismiss: () => void;
  navigation?: any;
}

const PatientProfileBottomSheet: React.FC<PatientProfileBottomSheetProps> = ({
  patientId,
  onDismiss,
  navigation,
}) => {
  const addVitalsSheetRef = useRef<BottomSheetModal>(null);

  const patient = getMockPatient(patientId);

  if (!patient) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Patient not found</Text>
      </View>
    );
  }

  const handleStartTriage = () => {
    onDismiss();
    // Navigate to full-screen Camera (as camera needs full screen)
    navigation.navigate('Camera', { patientId: patient.id });
  };

  const handleAddVitals = () => {
    addVitalsSheetRef.current?.present();
  };

  return (
    <View style={styles.container}>
      <Card style={styles.patientCard}>
        <Card.Content>
          <View style={styles.patientHeader}>
            <FontAwesome5 name="user" size={32} color={theme.colors.primary} solid />
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>
                {patient.firstName} {patient.lastName}
              </Text>
              <Text style={styles.patientDetails}>
                {patient.gender} • {new Date().getFullYear() - new Date(patient.dob).getFullYear()} years old
              </Text>
              <Text style={styles.contactInfo}>{patient.contactInfo}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.vitalsCard}>
        <Card.Title title="Latest Vitals" />
        <Card.Content>
          <View style={styles.vitalsGrid}>
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Blood Pressure</Text>
              <Text style={styles.vitalValue}>{patient.vitals.bloodPressure}</Text>
            </View>
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Heart Rate</Text>
              <Text style={styles.vitalValue}>{patient.vitals.heartRate}</Text>
            </View>
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Temperature</Text>
              <Text style={styles.vitalValue}>{patient.vitals.temperature}</Text>
            </View>
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Weight</Text>
              <Text style={styles.vitalValue}>{patient.vitals.weight}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.actionsContainer}>
        <Button
          mode="contained"
          onPress={handleStartTriage}
          style={styles.primaryButton}
          icon="camera"
        >
          + Start New Triage
        </Button>

        <Button
          mode="outlined"
          onPress={handleAddVitals}
          style={styles.secondaryButton}
          icon="plus"
        >
          + Add Vitals / Update
        </Button>
      </View>

      <BaseBottomSheet
        ref={addVitalsSheetRef}
        title="Add Vitals"
        snapPoints={['60%', '80%']}
      >
        <AddVitalsBottomSheet
          patientId={patientId}
          onDismiss={() => addVitalsSheetRef.current?.dismiss()}
        />
      </BaseBottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: theme.colors.error,
    marginTop: 20,
  },
  patientCard: {
    backgroundColor: theme.colors.cardBackground,
    marginBottom: 16,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientInfo: {
    marginLeft: 16,
    flex: 1,
  },
  patientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  patientDetails: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  contactInfo: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  vitalsCard: {
    backgroundColor: theme.colors.cardBackground,
    marginBottom: 16,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  vitalItem: {
    width: '50%',
    paddingVertical: 8,
  },
  vitalLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  vitalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  actionsContainer: {
    gap: 12,
  },
  primaryButton: {
    marginBottom: 8,
  },
  secondaryButton: {
    borderColor: theme.colors.primary,
  },
});

export default PatientProfileBottomSheet;