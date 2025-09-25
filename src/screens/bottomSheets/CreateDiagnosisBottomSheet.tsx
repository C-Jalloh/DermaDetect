import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, TextInput, Card } from 'react-native-paper';
import { theme } from '../../utils/theme';
import ImageSlider from '../../components/ImageSlider';

interface CreateDiagnosisBottomSheetProps {
  triageId: string;
  patientId: string | null;
  triageImageUris: string[];
  onDismiss: () => void;
}

const CreateDiagnosisBottomSheet: React.FC<CreateDiagnosisBottomSheetProps> = ({
  triageId,
  patientId,
  triageImageUris,
  onDismiss,
}) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');

  const handleSaveDiagnosis = () => {
    // TODO: Save diagnosis to database and create LabeledData entry
    console.log('Saving diagnosis:', {
      triageId,
      patientId,
      diagnosis,
      prescription,
      triageImageUris,
    });

    // This is the trigger for the data flywheel - linking diagnosis to triage image
    // In real implementation, this would create a LabeledData record in WatermelonDB

    onDismiss();
  };

  const isFormValid = diagnosis.trim() && prescription.trim();

  return (
    <View style={styles.container}>
      <Card style={styles.imageCard}>
        <Card.Content>
          <Text style={styles.imageTitle}>Triage Images</Text>
          <ImageSlider
            images={triageImageUris}
            imageStyle={styles.triageImage}
            containerStyle={styles.imagesContainer}
          />
        </Card.Content>
      </Card>

      <Card style={styles.formCard}>
        <Card.Content>
          <Text style={styles.title}>Create Diagnosis</Text>

          <TextInput
            label="Diagnosis"
            value={diagnosis}
            onChangeText={setDiagnosis}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={3}
            placeholder="Enter your diagnosis..."
          />

          <TextInput
            label="Prescription/Treatment Plan"
            value={prescription}
            onChangeText={setPrescription}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={4}
            placeholder="Enter prescription and treatment recommendations..."
          />

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={onDismiss}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSaveDiagnosis}
              style={styles.saveButton}
              disabled={!isFormValid}
            >
              Save Final Diagnosis
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageCard: {
    backgroundColor: theme.colors.cardBackground,
    marginBottom: 16,
  },
  imageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
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
  formCard: {
    backgroundColor: theme.colors.cardBackground,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
    backgroundColor: theme.colors.surface,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default CreateDiagnosisBottomSheet;