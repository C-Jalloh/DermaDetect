import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CHWStackParamList } from '../../navigation/CHWNavigator';
import { theme } from '../../utils/theme';

type PatientProfileCHWRouteProp = RouteProp<CHWStackParamList, 'PatientProfileCHW'>;
type PatientProfileCHWNavigationProp = StackNavigationProp<CHWStackParamList, 'PatientProfileCHW'>;

interface Props {
  route: PatientProfileCHWRouteProp;
}

const PatientProfileCHWScreen: React.FC<Props> = ({ route }) => {
  const { patientId } = route.params;
  const navigation = useNavigation<PatientProfileCHWNavigationProp>();

  // Mock patient data
  const patient = {
    id: patientId,
    firstName: 'John',
    lastName: 'Doe',
    dob: '1985-03-15',
    gender: 'Male',
    contactInfo: '+1234567890',
    emergencyContact: 'Jane Doe (+1234567891)',
  };

  // Mock visits data
  const visits = [
    {
      id: '1',
      date: '2024-09-20',
      vitals: { temperature: '98.6°F', bloodPressure: '120/80', weight: '70kg' },
      notes: 'Patient reports mild skin irritation',
    },
    {
      id: '2',
      date: '2024-09-15',
      vitals: { temperature: '98.4°F', bloodPressure: '118/78', weight: '69.5kg' },
      notes: 'Follow-up visit, no new concerns',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <FontAwesome5 name="user" size={32} color={theme.colors.primary} solid />
        <Text style={styles.title}>{patient.firstName} {patient.lastName}</Text>
        <Text style={styles.subtitle}>
          {patient.gender} • {new Date().getFullYear() - new Date(patient.dob).getFullYear()} years old
        </Text>
      </View>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <Text style={styles.infoText}>Phone: {patient.contactInfo}</Text>
          <Text style={styles.infoText}>Emergency: {patient.emergencyContact}</Text>
          <Text style={styles.infoText}>Date of Birth: {patient.dob}</Text>
        </Card.Content>
      </Card>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.triageButton]}
          onPress={() => navigation.navigate('PatientConsent')}
        >
          <FontAwesome5 name="camera" size={24} color={theme.colors.background} />
          <Text style={styles.actionButtonText}>Start New Triage</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.vitalsButton]}
          onPress={() => navigation.navigate('AddVitals', { patientId })}
        >
          <FontAwesome5 name="heartbeat" size={24} color={theme.colors.background} />
          <Text style={styles.actionButtonText}>Add Vitals</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Visit History</Text>
      {visits.map((visit) => (
        <Card key={visit.id} style={styles.visitCard}>
          <Card.Content>
            <View style={styles.visitHeader}>
              <FontAwesome5 name="calendar-alt" size={20} color={theme.colors.primary} />
              <Text style={styles.visitDate}>{visit.date}</Text>
            </View>

            <View style={styles.vitalsContainer}>
              <Chip style={styles.vitalChip}>Temp: {visit.vitals.temperature}</Chip>
              <Chip style={styles.vitalChip}>BP: {visit.vitals.bloodPressure}</Chip>
              <Chip style={styles.vitalChip}>Weight: {visit.vitals.weight}</Chip>
            </View>

            <Text style={styles.notesText}>{visit.notes}</Text>
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
  infoCard: {
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
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  triageButton: {
    backgroundColor: theme.colors.primary,
  },
  vitalsButton: {
    backgroundColor: theme.colors.secondary,
  },
  actionButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  visitCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: theme.colors.cardBackground,
  },
  visitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  visitDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginLeft: 8,
  },
  vitalsContainer: {
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
});

export default PatientProfileCHWScreen;