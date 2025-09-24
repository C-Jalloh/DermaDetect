import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Chip } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DoctorStackParamList } from '../../navigation/DoctorNavigator';
import { theme } from '../../utils/theme';

type PatientProfileDoctorRouteProp = RouteProp<DoctorStackParamList, 'PatientProfileDoctor'>;
type PatientProfileDoctorNavigationProp = StackNavigationProp<DoctorStackParamList, 'PatientProfileDoctor'>;

interface Props {
  route: PatientProfileDoctorRouteProp;
}

const PatientProfileDoctorScreen: React.FC<Props> = () => {
  const navigation = useNavigation<PatientProfileDoctorNavigationProp>();

  // Mock comprehensive patient data
  const patientData = {
    demographics: {
      firstName: 'John',
      lastName: 'Doe',
      dob: '1985-03-15',
      gender: 'Male',
      contactInfo: '+1234567890',
    },
    vitals: [
      {
        date: '2024-09-20',
        temperature: '98.6°F',
        bloodPressure: '120/80',
        weight: '70kg',
        notes: 'Patient reports mild skin irritation',
      },
      {
        date: '2024-09-15',
        temperature: '98.4°F',
        bloodPressure: '118/78',
        weight: '69.5kg',
        notes: 'Follow-up visit, no new concerns',
      },
    ],
    triages: [
      {
        id: '1',
        date: '2024-09-20',
        aiResult: 'Potential malignant lesion',
        confidence: 0.92,
        status: 'pending_diagnosis',
        imageUri: 'mock_uri',
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <FontAwesome5 name="user-md" size={32} color={theme.colors.primary} solid />
        <Text style={styles.title}>
          {patientData.demographics.firstName} {patientData.demographics.lastName}
        </Text>
        <Text style={styles.subtitle}>Patient Overview</Text>
      </View>

      <Card style={styles.demographicsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Demographics</Text>
          <Text style={styles.infoText}>Age: {new Date().getFullYear() - new Date(patientData.demographics.dob).getFullYear()} years</Text>
          <Text style={styles.infoText}>Gender: {patientData.demographics.gender}</Text>
          <Text style={styles.infoText}>Contact: {patientData.demographics.contactInfo}</Text>
          <Text style={styles.infoText}>DOB: {patientData.demographics.dob}</Text>
        </Card.Content>
      </Card>

      <Text style={styles.sectionTitle}>Recent Vitals</Text>
      {patientData.vitals.map((vital, index) => (
        <Card key={index} style={styles.vitalsCard}>
          <Card.Content>
            <View style={styles.vitalHeader}>
              <FontAwesome5 name="calendar-alt" size={20} color={theme.colors.primary} />
              <Text style={styles.vitalDate}>{vital.date}</Text>
            </View>
            <View style={styles.vitalsGrid}>
              <Chip style={styles.vitalChip}>Temp: {vital.temperature}</Chip>
              <Chip style={styles.vitalChip}>BP: {vital.bloodPressure}</Chip>
              <Chip style={styles.vitalChip}>Weight: {vital.weight}</Chip>
            </View>
            <Text style={styles.notesText}>{vital.notes}</Text>
          </Card.Content>
        </Card>
      ))}

      <Text style={styles.sectionTitle}>Triage History</Text>
      {patientData.triages.map((triage) => (
        <Card key={triage.id} style={styles.triageCard}>
          <Card.Content>
            <View style={styles.triageHeader}>
              <FontAwesome5 name="camera" size={20} color={theme.colors.primary} />
              <Text style={styles.triageDate}>{triage.date}</Text>
              <Chip
                style={[styles.statusChip, { backgroundColor: triage.status === 'pending_diagnosis' ? theme.colors.riskHigh : theme.colors.riskLow }]}
                textStyle={{ color: theme.colors.textPrimary }}
              >
                {triage.status.replace('_', ' ').toUpperCase()}
              </Chip>
            </View>
            <Text style={styles.aiResult}>{triage.aiResult}</Text>
            <Text style={styles.confidence}>Confidence: {(triage.confidence * 100).toFixed(1)}%</Text>

            {triage.status === 'pending_diagnosis' && (
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Diagnosis', { triageId: triage.id })}
                style={styles.diagnoseButton}
              >
                Create Diagnosis
              </Button>
            )}
          </Card.Content>
        </Card>
      ))}
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
    backgroundColor: theme.colors.cardBackground,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginTop: 12,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  demographicsCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: theme.colors.cardBackground,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 12,
    marginLeft: 16,
  },
  infoText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  vitalsCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: theme.colors.cardBackground,
  },
  vitalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vitalDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginLeft: 8,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  vitalChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: theme.colors.primary,
  },
  notesText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  triageCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: theme.colors.cardBackground,
  },
  triageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  triageDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  aiResult: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  confidence: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  diagnoseButton: {
    backgroundColor: theme.colors.primary,
  },
});

export default PatientProfileDoctorScreen;