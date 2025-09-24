import React, { useRef } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Button, Card, Chip } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { theme } from '../../utils/theme';
import BaseBottomSheet from '../../components/BaseBottomSheet';
import CreateDiagnosisBottomSheet from './CreateDiagnosisBottomSheet';

// Mock patient data with triage info - in real app, fetch from database
const getMockPatientWithTriage = (patientId: string | null) => {
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
      triage: {
        id: 't1',
        imageUri: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Triage+Image',
        aiResult: { confidence: 0.92, diagnosis: 'Potential malignant lesion' },
        riskLevel: 'high',
        triageDate: '2024-09-20',
        notes: 'Patient reports itching and recent growth',
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
      triage: {
        id: 't2',
        imageUri: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Triage+Image',
        aiResult: { confidence: 0.78, diagnosis: 'Suspicious lesion requiring review' },
        riskLevel: 'medium',
        triageDate: '2024-09-19',
        notes: 'Family history of skin cancer',
      },
    },
  };
  return patientId ? patients[patientId as keyof typeof patients] : null;
};

interface PatientProfileDoctorBottomSheetProps {
  patientId: string | null;
  onDismiss: () => void;
}

const PatientProfileDoctorBottomSheet: React.FC<PatientProfileDoctorBottomSheetProps> = ({
  patientId,
  onDismiss: _onDismiss,
}) => {
  const createDiagnosisSheetRef = useRef<BottomSheetModal>(null);

  const patient = getMockPatientWithTriage(patientId);

  if (!patient) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Patient not found</Text>
      </View>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return theme.colors.riskHigh;
      case 'medium': return theme.colors.riskMedium;
      case 'low': return theme.colors.riskLow;
      default: return theme.colors.textSecondary;
    }
  };

  const handleCreateDiagnosis = () => {
    createDiagnosisSheetRef.current?.present();
  };

  return (
    <ScrollView style={styles.container}>
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

      <Card style={styles.triageCard}>
        <Card.Title title="Latest Triage" />
        <Card.Content>
          <View style={styles.triageHeader}>
            <Chip
              style={[styles.riskChip, { backgroundColor: getRiskColor(patient.triage.riskLevel) }]}
              textStyle={{ color: theme.colors.textPrimary }}
            >
              {patient.triage.riskLevel.toUpperCase()} RISK
            </Chip>
          </View>
          <Image source={{ uri: patient.triage.imageUri }} style={styles.triageImage} />
          <Text style={styles.triageDate}>Triage Date: {patient.triage.triageDate}</Text>
          <Text style={styles.aiResult}>
            AI Analysis: {patient.triage.aiResult.diagnosis}
          </Text>
          <Text style={styles.confidence}>
            Confidence: {(patient.triage.aiResult.confidence * 100).toFixed(1)}%
          </Text>
          {patient.triage.notes && (
            <Text style={styles.notes}>Notes: {patient.triage.notes}</Text>
          )}
        </Card.Content>
      </Card>

      <View style={styles.actionsContainer}>
        <Button
          mode="contained"
          onPress={handleCreateDiagnosis}
          style={styles.primaryButton}
          icon="stethoscope"
        >
          + Create Diagnosis
        </Button>
      </View>

      <BaseBottomSheet
        ref={createDiagnosisSheetRef}
        title="Create Diagnosis"
        snapPoints={['80%', '90%']}
      >
        <CreateDiagnosisBottomSheet
          triageId={patient.triage.id}
          patientId={patientId}
          triageImageUri={patient.triage.imageUri}
          onDismiss={() => createDiagnosisSheetRef.current?.dismiss()}
        />
      </BaseBottomSheet>
    </ScrollView>
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
  triageCard: {
    backgroundColor: theme.colors.cardBackground,
    marginBottom: 16,
  },
  triageHeader: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  triageImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  triageDate: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  aiResult: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  confidence: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  notes: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontStyle: 'italic',
  },
  riskChip: {
    alignSelf: 'flex-start',
  },
  actionsContainer: {
    marginBottom: 16,
  },
  primaryButton: {
    marginBottom: 8,
  },
});

export default PatientProfileDoctorBottomSheet;