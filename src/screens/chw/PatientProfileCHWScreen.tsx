import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { theme } from '../../utils/theme';
import { PersonIcon, HeartRateIcon } from '../../assets/icons';
import { apiService } from '../../services/api';

type PatientProfileCHWRouteProp = RouteProp<RootStackParamList, 'PatientProfileCHW'>;
type PatientProfileCHWNavigationProp = StackNavigationProp<RootStackParamList, 'PatientProfileCHW'>;

interface Props {
  route: PatientProfileCHWRouteProp;
}

const PatientProfileCHWScreen: React.FC<Props> = ({ route }) => {
  const { patientId } = route.params;
  const navigation = useNavigation<PatientProfileCHWNavigationProp>();
  const [patient, setPatient] = useState<any>(null);
  const [vitals, setVitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        // Check if user is authenticated
        const token = await apiService.getToken();
        if (!token) {
          console.error('No authentication token available');
          setPatient(null);
          setLoading(false);
          return;
        }

        console.log('Fetching patient data for ID:', patientId);
        const [patientData, vitalsData] = await Promise.all([
          apiService.getPatient(patientId),
          apiService.getPatientVitals(patientId)
        ]);
        console.log('Patient data received:', patientData);
        console.log('Vitals data received:', vitalsData);
        setPatient(patientData);
        setVitals(vitalsData);
      } catch (error) {
        console.error('Failed to fetch patient data:', error);
        // Check if it's an authentication error
        if (error instanceof Error && error.message && error.message.includes('401')) {
          console.error('Authentication failed - user may not be logged in');
        }
        setPatient(null);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      checkAuthAndFetchData();
    } else {
      setLoading(false);
    }
  }, [patientId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading patient data...</Text>
        </View>
      </View>
    );
  }

  if (!patient) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load patient data</Text>
          <Text style={styles.errorSubtext}>Please ensure you are logged in and try again</Text>
          <Text style={styles.errorSubtext}>Patient ID: {patientId}</Text>
        </View>
      </View>
    );
  }

  // Parse demographics safely
  let demographics: any = {};
  try {
    demographics = typeof patient.demographics === 'string' 
      ? JSON.parse(patient.demographics) 
      : patient.demographics || {};
    console.log('Parsed demographics:', demographics);
  } catch (error) {
    console.error('Failed to parse demographics:', error);
    demographics = {};
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <PersonIcon width={32} height={32} fill={theme.colors.primary} />
        <Text style={styles.title}>{demographics.name || 'Unknown Patient'}</Text>
        <Text style={styles.subtitle}>
          Patient ID: {patient.id}
        </Text>
      </View>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Patient Information</Text>
          <Text style={styles.infoText}>Name: {demographics.name || 'Not provided'}</Text>
          <Text style={styles.infoText}>ID: {patient.id || 'Not available'}</Text>
          <Text style={styles.infoText}>Last Modified: {patient.last_modified_at ? new Date(patient.last_modified_at).toLocaleDateString() : 'Not available'}</Text>
          <Text style={styles.infoText}>Status: {patient.sync_status || 'Unknown'}</Text>
        </Card.Content>
      </Card>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.triageButton]}
          onPress={() => navigation.navigate('PatientConsent', { patientId })}
        >
          <FontAwesome5 name="camera" size={24} color={theme.colors.background} />
          <Text style={styles.actionButtonText}>Start New Triage</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.vitalsButton]}
          onPress={() => navigation.navigate('AddVitals', { patientId })}
        >
          <HeartRateIcon width={24} height={24} fill={theme.colors.background} />
          <Text style={styles.actionButtonText}>Add Vitals</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Vitals History</Text>
      {vitals.length === 0 ? (
        <Card style={styles.visitCard}>
          <Card.Content>
            <Text style={styles.notesText}>No vitals recorded yet</Text>
          </Card.Content>
        </Card>
      ) : (
        vitals.map((vital: any) => (
          <Card key={vital.id} style={styles.visitCard}>
            <Card.Content>
              <View style={styles.visitHeader}>
                <FontAwesome5 name="calendar-alt" size={20} color={theme.colors.primary} />
                <Text style={styles.visitDate}>{new Date(vital.last_modified_at).toLocaleDateString()}</Text>
              </View>

              <View style={styles.vitalsContainer}>
                <Chip style={styles.vitalChip}>Temp: {vital.temperature}</Chip>
                <Chip style={styles.vitalChip}>BP: {vital.blood_pressure}</Chip>
                <Chip style={styles.vitalChip}>Weight: {vital.weight}</Chip>
              </View>

              {vital.notes && (
                <Text style={styles.notesText}>{vital.notes}</Text>
              )}
            </Card.Content>
          </Card>
        ))
      )}
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
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
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
  debugText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: 'monospace',
    backgroundColor: theme.colors.cardBackground,
    padding: 8,
    marginTop: 8,
    borderRadius: 4,
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