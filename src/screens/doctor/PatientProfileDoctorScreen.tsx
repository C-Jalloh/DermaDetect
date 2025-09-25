import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Chip } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { theme } from '../../utils/theme';
import { StethoscopeIcon } from '../../assets/icons';
import { apiService } from '../../services/api';

type PatientProfileDoctorRouteProp = RouteProp<RootStackParamList, 'PatientProfileDoctor'>;
type PatientProfileDoctorNavigationProp = StackNavigationProp<RootStackParamList, 'PatientProfileDoctor'>;

interface Props {
  route: PatientProfileDoctorRouteProp;
}

const PatientProfileDoctorScreen: React.FC<Props> = ({ route }) => {
  const { patientId } = route.params;
  const navigation = useNavigation<PatientProfileDoctorNavigationProp>();
  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const data = await apiService.getPatient(patientId);
        setPatientData(data);
      } catch (error) {
        console.error('Error fetching patient data:', error);
        // Handle error - could show an alert or error state
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading patient data...</Text>
      </View>
    );
  }

  if (!patientData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Patient not found</Text>
      </View>
    );
  }

  // Extract data from API response
  const demographics = {
    firstName: patientData.first_name || 'Unknown',
    lastName: patientData.last_name || 'Patient',
    dob: patientData.date_of_birth || 'Unknown',
    gender: patientData.gender || 'Unknown',
    contactInfo: patientData.phone_number || 'No contact info',
  };

  const vitals = patientData.vitals || [];
  const cases = patientData.cases || [];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <StethoscopeIcon width={32} height={32} fill={theme.colors.primary} />
        <Text style={styles.title}>
          {demographics.firstName} {demographics.lastName}
        </Text>
        <Text style={styles.subtitle}>Patient Overview</Text>
      </View>

      <Card style={styles.demographicsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Demographics</Text>
          <Text style={styles.infoText}>Age: {demographics.dob !== 'Unknown' ? new Date().getFullYear() - new Date(demographics.dob).getFullYear() : 'Unknown'} years</Text>
          <Text style={styles.infoText}>Gender: {demographics.gender}</Text>
          <Text style={styles.infoText}>Contact: {demographics.contactInfo}</Text>
          <Text style={styles.infoText}>DOB: {demographics.dob}</Text>
        </Card.Content>
      </Card>

      <Text style={styles.sectionTitle}>Recent Vitals</Text>
      {vitals.map((vital: any, index: number) => (
        <Card key={index} style={styles.vitalsCard}>
          <Card.Content>
            <View style={styles.vitalHeader}>
              <FontAwesome5 name="calendar-alt" size={20} color={theme.colors.primary} />
              <Text style={styles.vitalDate}>{vital.created_at ? new Date(vital.created_at).toLocaleDateString() : 'Unknown date'}</Text>
            </View>
            <View style={styles.vitalsGrid}>
              <Chip style={styles.vitalChip}>Temp: {vital.temperature || 'N/A'}</Chip>
              <Chip style={styles.vitalChip}>BP: {vital.blood_pressure || 'N/A'}</Chip>
              <Chip style={styles.vitalChip}>Weight: {vital.weight || 'N/A'}</Chip>
            </View>
            <Text style={styles.notesText}>{vital.notes || 'No notes'}</Text>
          </Card.Content>
        </Card>
      ))}

      <Text style={styles.sectionTitle}>Case History</Text>
      {cases.map((caseItem: any) => (
        <Card key={caseItem.id} style={styles.triageCard}>
          <Card.Content>
            <View style={styles.triageHeader}>
              <FontAwesome5 name="camera" size={20} color={theme.colors.primary} />
              <Text style={styles.triageDate}>{caseItem.created_at ? new Date(caseItem.created_at).toLocaleDateString() : 'Unknown date'}</Text>
              <Chip
                style={[styles.statusChip, { backgroundColor: caseItem.status === 'pending_diagnosis' ? theme.colors.riskHigh : theme.colors.riskLow }]}
                textStyle={{ color: theme.colors.textPrimary }}
              >
                {caseItem.status?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
              </Chip>
            </View>
            <Text style={styles.aiResult}>{caseItem.ai_analysis?.diagnosis || 'No AI analysis'}</Text>
            <Text style={styles.confidence}>Confidence: {caseItem.ai_analysis?.confidence ? (caseItem.ai_analysis.confidence * 100).toFixed(1) : 'N/A'}%</Text>

            {caseItem.status === 'pending_diagnosis' && (
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Diagnosis', { triageId: caseItem.id })}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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