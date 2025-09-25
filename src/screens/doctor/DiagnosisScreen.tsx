import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../utils/theme';
import AlertBottomSheet, { AlertBottomSheetRef } from '../../components/AlertBottomSheet';
import { StethoscopeIcon } from '../../assets/icons';
import { apiService } from '../../services/api';

type DiagnosisRouteProp = RouteProp<any, 'Diagnosis'>;
type DiagnosisNavigationProp = StackNavigationProp<any, 'Diagnosis'>;

interface Props {
  route: DiagnosisRouteProp;
}

const DiagnosisScreen: React.FC<Props> = ({ route }) => {
  const { triageId } = route.params as any;
  const navigation = useNavigation<DiagnosisNavigationProp>();
  const alertBottomSheetRef = useRef<AlertBottomSheetRef>(null);
  const [alertConfig, setAlertConfig] = useState<{title: string, message: string, buttons?: any[]} | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        const data = await apiService.getCase(triageId);
        setCaseData(data);
      } catch (error) {
        console.error('Error fetching case data:', error);
        setAlertConfig({
          title: 'Error',
          message: 'Failed to load case data. Please try again.',
          buttons: [{ text: 'OK', onPress: () => navigation.goBack() }]
        });
        alertBottomSheetRef.current?.present();
      } finally {
        setLoading(false);
      }
    };

    fetchCaseData();
  }, [triageId, navigation]);

  const handleSaveDiagnosis = async () => {
    if (!diagnosis.trim()) {
      setAlertConfig({ title: 'Error', message: 'Please enter a diagnosis' });
      alertBottomSheetRef.current?.present();
      return;
    }

    try {
      await apiService.createDiagnosis(triageId, {
        diagnosis: diagnosis.trim(),
        prescription: prescription.trim() || null,
      });

      setAlertConfig({
        title: 'Success',
        message: 'Diagnosis saved successfully. This will help improve the AI model.',
        buttons: [{ text: 'OK', onPress: () => navigation.goBack() }]
      });
      alertBottomSheetRef.current?.present();
    } catch (error) {
      console.error('Error saving diagnosis:', error);
      setAlertConfig({
        title: 'Error',
        message: 'Failed to save diagnosis. Please try again.',
      });
      alertBottomSheetRef.current?.present();
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading case data...</Text>
      </View>
    );
  }

  if (!caseData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Case not found</Text>
      </View>
    );
  }

  // Extract patient name and image from case data
  const patientName = caseData.patient?.name || 'Unknown Patient';
  const imageUri = caseData.image_url || 'https://via.placeholder.com/300x200?text=No+Image';
  const aiResult = caseData.ai_analysis || {
    confidence: 0,
    diagnosis: 'No AI analysis available',
    risk_level: 'unknown',
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <StethoscopeIcon width={32} height={32} fill={theme.colors.primary} />
        <Text style={styles.title}>Create Diagnosis</Text>
        <Text style={styles.subtitle}>{patientName}</Text>
      </View>

      <Card style={styles.imageCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Triage Image</Text>
          <Image
            source={{ uri: imageUri }}
            style={styles.triageImage}
            resizeMode="cover"
          />
          <View style={styles.aiResult}>
            <Text style={styles.aiLabel}>AI Analysis:</Text>
            <Text style={styles.aiDiagnosis}>{aiResult.diagnosis}</Text>
            <Text style={styles.aiConfidence}>
              Confidence: {(aiResult.confidence * 100).toFixed(1)}%
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.formCard}>
        <Card.Content>
          <TextInput
            label="Diagnosis *"
            value={diagnosis}
            onChangeText={setDiagnosis}
            multiline
            numberOfLines={3}
            placeholder="Enter your clinical diagnosis..."
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Prescription & Notes"
            value={prescription}
            onChangeText={setPrescription}
            multiline
            numberOfLines={4}
            placeholder="Enter prescription details and treatment notes..."
            style={styles.input}
            mode="outlined"
          />

          <View style={styles.infoContainer}>
            <FontAwesome5 name="info-circle" size={16} color={theme.colors.primary} />
            <Text style={styles.infoText}>
              This diagnosis will be saved with the image to create labeled training data for AI improvement.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={[styles.button, styles.cancelButton]}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSaveDiagnosis}
              style={[styles.button, styles.saveButton]}
            >
              Save Final Diagnosis
            </Button>
          </View>
        </Card.Content>
      </Card>
      <AlertBottomSheet
        ref={alertBottomSheetRef}
        title={alertConfig?.title || ''}
        message={alertConfig?.message || ''}
        buttons={alertConfig?.buttons}
      />
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
  imageCard: {
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
  triageImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  aiResult: {
    backgroundColor: theme.colors.background,
    padding: 12,
    borderRadius: 8,
  },
  aiLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  aiDiagnosis: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  aiConfidence: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  formCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: theme.colors.cardBackground,
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme.colors.background,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.primary + '20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    borderColor: theme.colors.textSecondary,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
});

export default DiagnosisScreen;