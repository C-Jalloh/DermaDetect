import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { theme } from '../../utils/theme';
import BaseBottomSheet from '../../components/BaseBottomSheet';
import AddVitalsBottomSheet from './AddVitalsBottomSheet';
import { ProfileIcon, BloodPressureIcon, TemperatureIcon, WeightIcon } from '../../assets/icons';
import { apiService } from '../../services/api';

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
  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const addVitalsSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      if (!patientId) {
        setLoading(false);
        return;
      }

      try {
        // Check if user is authenticated
        const token = await apiService.getToken();
        if (!token) {
          console.error('No authentication token available for patient profile');
          setPatientData(null);
          setLoading(false);
          return;
        }

        console.log('Fetching patient data for bottom sheet, ID:', patientId);
        const data = await apiService.getPatient(patientId);
        console.log('Patient data received for bottom sheet:', data);
        setPatientData(data);
      } catch (error) {
        console.error('Error fetching patient data for bottom sheet:', error);
        // Check if it's an authentication error
        if (error instanceof Error && error.message && error.message.includes('401')) {
          console.error('Authentication failed for patient profile bottom sheet');
        }
        setPatientData(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [patientId]);

  const handleAddVitals = () => {
    addVitalsSheetRef.current?.present();
  };

  const handleViewFullProfile = () => {
    if (patientData?.id) {
      navigation?.navigate('PatientProfileCHW', { patientId: patientData.id });
    }
    onDismiss();
  };

  if (loading) {
    return (
      <BaseBottomSheet>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading patient data...</Text>
        </View>
      </BaseBottomSheet>
    );
  }

  if (!patientData) {
    return (
      <BaseBottomSheet>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Unable to load patient data</Text>
          <Text style={styles.errorSubtext}>Please ensure you are logged in</Text>
        </View>
      </BaseBottomSheet>
    );
  }

  // Parse demographics from the API response
  let demographics = patientData.demographics;
  
  // Handle both string and object formats
  if (typeof demographics === 'string') {
    try {
      demographics = JSON.parse(demographics);
    } catch (e) {
      console.warn('Failed to parse patient demographics in CHW profile:', e);
      demographics = {};
    }
  }
  
  const vitals = patientData.vitals || [];

  return (
    <BaseBottomSheet>
      <View style={styles.container}>
        <View style={styles.header}>
          <ProfileIcon width={32} height={32} fill={theme.colors.primary} />
          <Text style={styles.title}>
            {demographics.name || 'Unknown Patient'}
          </Text>
          <Text style={styles.subtitle}>Patient Profile</Text>
        </View>

        <Card style={styles.demographicsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Demographics</Text>
            <Text style={styles.infoText}>Age: {demographics.age || 'Unknown'} years</Text>
            <Text style={styles.infoText}>Gender: {demographics.gender || 'Unknown'}</Text>
            <Text style={styles.infoText}>Contact: {demographics.phone || 'No contact info'}</Text>
            <Text style={styles.infoText}>Address: {demographics.address || 'Not provided'}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.vitalsCard}>
          <Card.Content>
            <View style={styles.vitalsHeader}>
              <Text style={styles.sectionTitle}>Latest Vitals</Text>
              <Button
                mode="outlined"
                onPress={handleAddVitals}
                style={styles.addVitalsButton}
              >
                Add Vitals
              </Button>
            </View>

            {vitals.length > 0 ? (
              <View style={styles.vitalsGrid}>
                <View style={styles.vitalItem}>
                  <BloodPressureIcon width={24} height={24} fill={theme.colors.primary} />
                  <Text style={styles.vitalLabel}>Blood Pressure</Text>
                  <Text style={styles.vitalValue}>{vitals[0].blood_pressure || 'N/A'}</Text>
                </View>
                <View style={styles.vitalItem}>
                  <TemperatureIcon width={24} height={24} fill={theme.colors.primary} />
                  <Text style={styles.vitalLabel}>Temperature</Text>
                  <Text style={styles.vitalValue}>{vitals[0].temperature || 'N/A'}</Text>
                </View>
                <View style={styles.vitalItem}>
                  <WeightIcon width={24} height={24} fill={theme.colors.primary} />
                  <Text style={styles.vitalLabel}>Weight</Text>
                  <Text style={styles.vitalValue}>{vitals[0].weight || 'N/A'}</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.noVitalsText}>No vitals recorded yet</Text>
            )}
          </Card.Content>
        </Card>

        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={onDismiss}
            style={styles.actionButton}
          >
            Close
          </Button>
          <Button
            mode="contained"
            onPress={handleViewFullProfile}
            style={styles.actionButton}
          >
            View Full Profile
          </Button>
        </View>
      </View>

      <AddVitalsBottomSheet
        patientId={patientId}
        onDismiss={() => addVitalsSheetRef.current?.dismiss()}
      />
    </BaseBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: theme.colors.error,
  },
  errorSubtext: {
    textAlign: 'center',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 8,
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
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  vitalsCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: theme.colors.cardBackground,
  },
  vitalsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addVitalsButton: {
    borderColor: theme.colors.primary,
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
    marginTop: 4,
    marginBottom: 2,
  },
  vitalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  noVitalsText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
    marginTop: 0,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default PatientProfileBottomSheet;