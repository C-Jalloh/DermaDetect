import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, Title, Chip, TextInput } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useDispatch } from 'react-redux';
import { addCase } from '../store/slices/casesSlice';
import { generatePatientId, generateCaseId } from '../services/dummyData';
import { PatientCase } from '../types';
import { theme } from '../utils/theme';

type DetailsFormScreenRouteProp = RouteProp<RootStackParamList, 'DetailsForm'>;
type DetailsFormScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DetailsForm'>;

interface Props {
  route: DetailsFormScreenRouteProp;
}

const SYMPTOMS = ['Itchy', 'Painful', 'Burning', 'None'];
const CHARACTERISTICS = ['Raised', 'Flaky', 'Spreading', 'Fluid-filled'];

const DetailsFormScreen: React.FC<Props> = ({ route }) => {
  const [_caseId] = useState(route.params.caseId); // Store for potential future use
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const navigation = useNavigation<DetailsFormScreenNavigationProp>();
  const dispatch = useDispatch();

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const toggleCharacteristic = (characteristic: string) => {
    setSelectedCharacteristics(prev =>
      prev.includes(characteristic)
        ? prev.filter(c => c !== characteristic)
        : [...prev, characteristic]
    );
  };

  const handleSave = async () => {
    setSaving(true);

    // Create the case object
    const newCase: PatientCase = {
      id: generateCaseId(),
      patientId: generatePatientId(),
      imageUri: `mock://image-${Date.now()}.jpg`, // Mock image URI
      triageResult: 'high', // This screen is only for high-risk cases
      status: 'pending_sync',
      notes: {
        symptoms: selectedSymptoms,
        characteristics: selectedCharacteristics,
        additionalNotes: additionalNotes.trim(),
      },
      createdAt: new Date(),
    };

    // Save to Redux store
    dispatch(addCase(newCase));

    // Simulate save delay
    setTimeout(() => {
      setSaving(false);
      navigation.navigate('Home');
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Additional Details</Title>
            <Text style={styles.subtitle}>
              High-risk case detected. Please provide additional observations to help the consulting doctor.
            </Text>

            {/* Symptoms Section */}
            <View style={styles.sectionHeader}>
              <MaterialIcons name="device-thermostat" size={20} color={theme.colors.textPrimary} />
              <Text style={styles.sectionTitle}>Symptoms</Text>
            </View>
            <Text style={styles.sectionSubtitle}>Select all that apply</Text>
            <View style={styles.chipContainer}>
              {SYMPTOMS.map((symptom) => (
                <Chip
                  key={symptom}
                  mode={selectedSymptoms.includes(symptom) ? 'flat' : 'outlined'}
                  onPress={() => toggleSymptom(symptom)}
                  style={styles.chip}
                  selected={selectedSymptoms.includes(symptom)}
                >
                  {symptom}
                </Chip>
              ))}
            </View>

            {/* Characteristics Section */}
            <View style={styles.sectionHeader}>
              <MaterialIcons name="search" size={20} color={theme.colors.textPrimary} />
              <Text style={styles.sectionTitle}>Characteristics</Text>
            </View>
            <Text style={styles.sectionSubtitle}>Select all that apply</Text>
            <View style={styles.chipContainer}>
              {CHARACTERISTICS.map((characteristic) => (
                <Chip
                  key={characteristic}
                  mode={selectedCharacteristics.includes(characteristic) ? 'flat' : 'outlined'}
                  onPress={() => toggleCharacteristic(characteristic)}
                  style={styles.chip}
                  selected={selectedCharacteristics.includes(characteristic)}
                >
                  {characteristic}
                </Chip>
              ))}
            </View>

            {/* Additional Notes */}
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={4}
              placeholder="Any additional observations or patient history..."
              value={additionalNotes}
              onChangeText={setAdditionalNotes}
              style={styles.notesInput}
            />
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSave}
          loading={saving}
          disabled={saving}
          style={styles.saveButton}
          contentStyle={styles.buttonContent}
        >
          {saving ? 'Saving...' : 'Save & Complete Case'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    elevation: 0,
    shadowOpacity: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: theme.colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginLeft: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    color: theme.colors.textSecondary,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    margin: 4,
  },
  notesInput: {
    marginTop: 8,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default DetailsFormScreen;