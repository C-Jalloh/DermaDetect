import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Button, TextInput, Chip } from 'react-native-paper';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { theme } from '../utils/theme';
import BaseBottomSheet from './BaseBottomSheet';
import DetailsBottomSheet, { DetailsBottomSheetRef, DetailItem } from './DetailsBottomSheet';
import PhotoOptionsBottomSheet, { PhotoOptionsBottomSheetRef } from './PhotoOptionsBottomSheet';

export interface DataEnrichmentData {
  additionalImages: string[];
  symptoms: string[];
  lesionCharacteristics: string[];
  urgencyLevel: 'moderate' | 'high' | 'severe';
  notes: string;
}

export interface DataEnrichmentBottomSheetProps {
  initialImageUri: string;
  additionalImages?: string[];
  onContinue: (data: DataEnrichmentData) => void;
  onAddPhoto?: () => void;
}

export interface DataEnrichmentBottomSheetRef {
  present: () => void;
  dismiss: () => void;
}

const SYMPTOM_TAGS = ['Painful', 'Itchy', 'Burning', 'Bleeding', 'Spreading Rapidly', 'Fever Present'];
const LESION_TAGS = ['Raised', 'Flaky', 'Fluid-filled', 'Irregular Borders', 'Multiple Colors'];

const SYMPTOM_DETAILS: { [key: string]: DetailItem } = {
  'Painful': {
    title: 'Painful',
    description: 'The lesion causes pain or discomfort to the touch. This may indicate inflammation, infection, or deeper tissue involvement.',
    icon: 'exclamation-triangle',
    severity: 'high',
    examples: ['Sharp pain when touched', 'Throbbing sensation', 'Burning pain', 'Deep aching']
  },
  'Itchy': {
    title: 'Itchy',
    description: 'The area feels itchy or pruritic. This is common in allergic reactions, eczema, or certain infections.',
    icon: 'hand-paper',
    severity: 'medium',
    examples: ['Constant itching', 'Worse at night', 'Spreading itchiness', 'Skin becomes red when scratched']
  },
  'Burning': {
    title: 'Burning',
    description: 'A burning sensation in the affected area. This may indicate nerve involvement or chemical irritation.',
    icon: 'fire',
    severity: 'high',
    examples: ['Hot burning feeling', 'Stinging sensation', 'Worse with movement', 'Radiating burn']
  },
  'Bleeding': {
    title: 'Bleeding',
    description: 'The lesion is actively bleeding or has bled recently. This requires immediate medical attention.',
    icon: 'tint',
    severity: 'high',
    examples: ['Active bleeding', 'Blood-stained clothing', 'Frequent bleeding', 'Difficult to stop bleeding']
  },
  'Spreading Rapidly': {
    title: 'Spreading Rapidly',
    description: 'The lesion is growing or spreading quickly. Rapid growth may indicate malignancy or aggressive infection.',
    icon: 'expand-arrows-alt',
    severity: 'high',
    examples: ['Size doubled in days', 'New lesions appearing', 'Edges moving outward', 'Changing shape quickly']
  },
  'Fever Present': {
    title: 'Fever Present',
    description: 'Patient has an elevated body temperature. This may indicate systemic infection or inflammatory response.',
    icon: 'thermometer-half',
    severity: 'high',
    examples: ['Temperature >100.4°F (38°C)', 'Chills and sweating', 'Body aches', 'Fatigue']
  }
};

const LESION_DETAILS: { [key: string]: DetailItem } = {
  'Raised': {
    title: 'Raised',
    description: 'The lesion protrudes above the surrounding skin level. This can indicate various conditions from benign to malignant.',
    icon: 'arrow-up',
    severity: 'medium',
    examples: ['Bump on skin', 'Elevated nodule', 'Papule formation', 'Raised plaque']
  },
  'Flaky': {
    title: 'Flaky',
    description: 'The skin surface shows scaling or flaking. This is common in dry skin conditions, fungal infections, or psoriasis.',
    icon: 'snowflake',
    severity: 'low',
    examples: ['Dry, scaly patches', 'White flakes', 'Peeling skin', 'Rough texture']
  },
  'Fluid-filled': {
    title: 'Fluid-filled',
    description: 'The lesion contains clear or cloudy fluid. This may be a blister, vesicle, or cyst requiring careful evaluation.',
    icon: 'tint',
    severity: 'medium',
    examples: ['Clear fluid blister', 'Cloudy vesicle', 'Blood-filled lesion', 'Pus-filled pustule']
  },
  'Irregular Borders': {
    title: 'Irregular Borders',
    description: 'The edges of the lesion are not smooth or well-defined. Irregular borders are concerning for malignancy.',
    icon: 'wave-square',
    severity: 'high',
    examples: ['Jagged edges', 'Notched borders', 'Spiky outline', 'Poorly defined margins']
  },
  'Multiple Colors': {
    title: 'Multiple Colors',
    description: 'The lesion shows variation in color within the same area. Color variation can indicate malignancy.',
    icon: 'palette',
    severity: 'high',
    examples: ['Black, brown, and blue', 'Red and white areas', 'Color changes over time', 'Uneven pigmentation']
  }
};

const DataEnrichmentBottomSheet = forwardRef<DataEnrichmentBottomSheetRef, DataEnrichmentBottomSheetProps>(
  ({ initialImageUri, additionalImages = [], onContinue, onAddPhoto }, ref) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const detailsSheetRef = useRef<DetailsBottomSheetRef>(null);
    const photoOptionsSheetRef = useRef<PhotoOptionsBottomSheetRef>(null);
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [selectedLesionChars, setSelectedLesionChars] = useState<string[]>([]);
    const [urgencyLevel, setUrgencyLevel] = useState<'moderate' | 'high' | 'severe'>('high');
    const [notes, setNotes] = useState('');

    useImperativeHandle(ref, () => ({
      present: () => {
        bottomSheetRef.current?.present();
      },
      dismiss: () => {
        bottomSheetRef.current?.dismiss();
      },
    }));

    const toggleSymptom = (symptom: string) => {
      setSelectedSymptoms(prev =>
        prev.includes(symptom)
          ? prev.filter(s => s !== symptom)
          : [...prev, symptom]
      );
    };

    const toggleLesionChar = (characteristic: string) => {
      setSelectedLesionChars(prev =>
        prev.includes(characteristic)
          ? prev.filter(c => c !== characteristic)
          : [...prev, characteristic]
      );
    };

    const handleContinue = () => {
      const data: DataEnrichmentData = {
        additionalImages: additionalImages,
        symptoms: selectedSymptoms,
        lesionCharacteristics: selectedLesionChars,
        urgencyLevel,
        notes,
      };
      onContinue(data);
    };

    const handleAddPhoto = () => {
      photoOptionsSheetRef.current?.present();
    };

    const handleTakePhoto = () => {
      if (onAddPhoto) {
        onAddPhoto();
      }
    };

    const handleChooseFromGallery = () => {
      if (onAddPhoto) {
        onAddPhoto();
      }
    };

    const handleViewSymptomDetails = () => {
      const selectedDetails = selectedSymptoms
        .map(symptom => SYMPTOM_DETAILS[symptom])
        .filter(Boolean);
      if (selectedDetails.length > 0) {
        detailsSheetRef.current?.present();
      }
    };

    const handleViewLesionDetails = () => {
      const selectedDetails = selectedLesionChars
        .map(characteristic => LESION_DETAILS[characteristic])
        .filter(Boolean);
      if (selectedDetails.length > 0) {
        detailsSheetRef.current?.present();
      }
    };

    return (
      <>
        <BaseBottomSheet
          ref={bottomSheetRef}
          title="Add Details for Referral"
          snapPoints={['90%']}
        >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Add More Photos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Photos</Text>
            <TouchableOpacity style={styles.addPhotoButton} onPress={handleAddPhoto}>
              <FontAwesome5 name="plus" size={24} color={theme.colors.primary} />
              <Text style={styles.addPhotoText}>Add Another Photo</Text>
            </TouchableOpacity>

            {/* Show current images */}
            <View style={styles.imagesContainer}>
              <View style={styles.imageWrapper}>
                <Image source={{ uri: initialImageUri }} style={styles.image} />
                <Text style={styles.imageLabel}>Primary</Text>
              </View>
              {additionalImages.map((uri: string, index: number) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.image} />
                  <Text style={styles.imageLabel}>Additional {index + 1}</Text>
                </View>
              ))}
            </View>
          </View>

            {/* Symptom Tags */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Patient Symptoms</Text>
                {selectedSymptoms.length > 0 && (
                  <TouchableOpacity onPress={handleViewSymptomDetails}>
                    <Text style={styles.viewDetailsText}>View Details</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.tagsContainer}>
                {SYMPTOM_TAGS.map((symptom) => (
                  <Chip
                    key={symptom}
                    selected={selectedSymptoms.includes(symptom)}
                    onPress={() => toggleSymptom(symptom)}
                    style={styles.tag}
                    textStyle={styles.tagText}
                  >
                    {symptom}
                  </Chip>
                ))}
              </View>
            </View>

            {/* Lesion Characteristics */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Lesion Details</Text>
                {selectedLesionChars.length > 0 && (
                  <TouchableOpacity onPress={handleViewLesionDetails}>
                    <Text style={styles.viewDetailsText}>View Details</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.tagsContainer}>
                {LESION_TAGS.map((characteristic) => (
                  <Chip
                    key={characteristic}
                    selected={selectedLesionChars.includes(characteristic)}
                    onPress={() => toggleLesionChar(characteristic)}
                    style={styles.tag}
                    textStyle={styles.tagText}
                  >
                    {characteristic}
                  </Chip>
                ))}
              </View>
            </View>          {/* Urgency Assessment */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Assessment</Text>
            <View style={styles.urgencyContainer}>
              {[
                { key: 'moderate', label: 'Moderate Concern', color: '#FFC107' },
                { key: 'high', label: 'High Concern', color: '#FF9800' },
                { key: 'severe', label: 'Severe Concern', color: '#F44336' },
              ].map(({ key, label, color }) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.urgencyButton,
                    urgencyLevel === key && { backgroundColor: color },
                  ]}
                  onPress={() => setUrgencyLevel(key as any)}
                >
                  <Text
                    style={[
                      styles.urgencyText,
                      urgencyLevel === key && styles.urgencyTextSelected,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Additional Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={3}
              value={notes}
              onChangeText={setNotes}
              placeholder="Any additional details for the doctor..."
              style={styles.notesInput}
            />
          </View>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleContinue}
              style={styles.continueButton}
            >
              Continue
            </Button>
          </View>
        </ScrollView>
      </BaseBottomSheet>

      {/* Details Bottom Sheet */}
      <DetailsBottomSheet
        ref={detailsSheetRef}
        title="Selected Details"
        items={selectedSymptoms.map(symptom => SYMPTOM_DETAILS[symptom]).concat(
          selectedLesionChars.map(characteristic => LESION_DETAILS[characteristic])
        ).filter(Boolean)}
      />

      {/* Photo Options Bottom Sheet */}
      <PhotoOptionsBottomSheet
        ref={photoOptionsSheetRef}
        onTakePhoto={handleTakePhoto}
        onChooseFromGallery={handleChooseFromGallery}
      />
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  viewDetailsText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    marginBottom: 16,
  },
  addPhotoText: {
    fontSize: 16,
    color: theme.colors.primary,
    marginLeft: 8,
    fontWeight: '500',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageWrapper: {
    marginRight: 12,
    marginBottom: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  imageLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
  },
  urgencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  urgencyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.outline,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  urgencyText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  urgencyTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  notesInput: {
    backgroundColor: theme.colors.surface,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  continueButton: {
    paddingVertical: 8,
  },
});

export default DataEnrichmentBottomSheet;