import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, Chip } from 'react-native-paper';
import { PersonIcon, BloodPressureIcon, HeartRateIcon, TemperatureIcon, WeightIcon } from '../../assets/icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { theme } from '../../utils/theme';
import BaseBottomSheet from '../../components/BaseBottomSheet';
import CreateDiagnosisBottomSheet from './CreateDiagnosisBottomSheet';
import ImageSlider from '../../components/ImageSlider';
import { apiService } from '../../services/api';

interface PatientProfileDoctorBottomSheetProps {
  patientId: string | null;
  caseData?: any; // Add case data to get risk level and triage info
  onDismiss: () => void;
}

const PatientProfileDoctorBottomSheet: React.FC<PatientProfileDoctorBottomSheetProps> = ({
  patientId,
  caseData,
  onDismiss: _onDismiss,
}) => {
  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const createDiagnosisSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientId) {
        setLoading(false);
        return;
      }

      try {
        const data = await apiService.getPatient(patientId);
        setPatientData(data);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId, caseData]);

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
        <View style={styles.container}>
          <Text style={styles.errorText}>Patient not found</Text>
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
      console.warn('Failed to parse patient demographics in profile:', e);
      demographics = {};
    }
  }
  
  const vitals = patientData.vitals || [];

  const patient = {
    id: patientData.id,
    name: demographics.name || 'Unknown Patient',
    dob: demographics.age ? `${new Date().getFullYear() - demographics.age}-01-01` : 'Unknown',
    gender: demographics.gender || 'Unknown',
    contactInfo: demographics.phone || 'No contact info',
    vitals: {
      bloodPressure: vitals[0]?.blood_pressure || 'Not recorded',
      heartRate: vitals[0]?.heart_rate || 'Not recorded',
      temperature: vitals[0]?.temperature || 'Not recorded',
      weight: vitals[0]?.weight || 'Not recorded',
    },
    triage: {
      id: caseData?.id || 'current',
      imageUris: caseData?.image_urls ? JSON.parse(caseData.image_urls) : [],
      aiResult: caseData?.ai_analysis ? JSON.parse(caseData.ai_analysis) : null,
      riskLevel: caseData?.risk_level || 'unknown',
      triageDate: caseData?.created_at ? new Date(caseData.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
      notes: caseData?.triage_data ? (() => {
        try {
          const parsed = JSON.parse(caseData.triage_data);
          if (typeof parsed === 'object' && parsed !== null) {
            // Convert object to readable string
            const parts = [];
            if (parsed.symptoms && Array.isArray(parsed.symptoms)) {
              parts.push(`Symptoms: ${parsed.symptoms.join(', ')}`);
            }
            if (parsed.risk_level) {
              parts.push(`Risk Level: ${parsed.risk_level}`);
            }
            if (parsed.notes) {
              parts.push(`Notes: ${parsed.notes}`);
            }
            return parts.length > 0 ? parts.join(' | ') : 'Patient profile view';
          }
          return String(parsed);
        } catch (e) {
          return caseData.triage_data;
        }
      })() : 'Patient profile view',
    },
  };

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
            <PersonIcon width={32} height={32} fill={theme.colors.primary} />
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>
                {patient.name}
              </Text>
              <Text style={styles.patientDetails}>
                {patient.gender} • {demographics.age || 'Unknown'} years old
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
              <View style={styles.vitalHeader}>
                <BloodPressureIcon width={20} height={20} fill={theme.colors.primary} />
                <Text style={styles.vitalLabel}>Blood Pressure</Text>
              </View>
              <Text style={styles.vitalValue}>{patient.vitals.bloodPressure}</Text>
            </View>
            <View style={styles.vitalItem}>
              <View style={styles.vitalHeader}>
                <HeartRateIcon width={20} height={20} fill={theme.colors.primary} />
                <Text style={styles.vitalLabel}>Heart Rate</Text>
              </View>
              <Text style={styles.vitalValue}>{patient.vitals.heartRate}</Text>
            </View>
            <View style={styles.vitalItem}>
              <View style={styles.vitalHeader}>
                <TemperatureIcon width={20} height={20} fill={theme.colors.primary} />
                <Text style={styles.vitalLabel}>Temperature</Text>
              </View>
              <Text style={styles.vitalValue}>{patient.vitals.temperature}</Text>
            </View>
            <View style={styles.vitalItem}>
              <View style={styles.vitalHeader}>
                <WeightIcon width={20} height={20} fill={theme.colors.primary} />
                <Text style={styles.vitalLabel}>Weight</Text>
              </View>
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
          <ImageSlider
            images={patient.triage.imageUris}
            imageStyle={styles.triageImage}
            containerStyle={styles.imagesContainer}
          />
          <Text style={styles.triageDate}>Triage Date: {patient.triage.triageDate}</Text>
          <Text style={styles.aiResult}>AI Analysis: Not available</Text>
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
        
        >
        Create Diagnosis
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
          triageImageUris={patient.triage.imageUris}
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
  vitalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
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
    width: 200,
    height: 150,
    borderRadius: 8,
    marginRight: 12,
  },
  imagesContainer: {
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