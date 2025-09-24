import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Button, Chip, Card } from 'react-native-paper';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { theme } from '../utils/theme';
import BaseBottomSheet from './BaseBottomSheet';
import { DataEnrichmentData } from './DataEnrichmentBottomSheet';

export interface ConfirmationBottomSheetProps {
  initialImageUri: string;
  data: DataEnrichmentData;
  onConfirm: () => void;
  onEdit: () => void;
}

export interface ConfirmationBottomSheetRef {
  present: () => void;
  dismiss: () => void;
}

const ConfirmationBottomSheet = forwardRef<ConfirmationBottomSheetRef, ConfirmationBottomSheetProps>(
  ({ initialImageUri, data, onConfirm, onEdit }, ref) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => ({
      present: () => {
        bottomSheetRef.current?.present();
      },
      dismiss: () => {
        bottomSheetRef.current?.dismiss();
      },
    }));

    const getUrgencyLabel = (level: string) => {
      switch (level) {
        case 'moderate': return 'Moderate Concern';
        case 'high': return 'High Concern';
        case 'severe': return 'Severe Concern';
        default: return level;
      }
    };

    const getUrgencyColor = (level: string) => {
      switch (level) {
        case 'moderate': return '#FFC107';
        case 'high': return '#FF9800';
        case 'severe': return '#F44336';
        default: return theme.colors.outline;
      }
    };

    return (
      <BaseBottomSheet
        ref={bottomSheetRef}
        title="Review & Confirm"
        snapPoints={['90%']}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Images Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Images</Text>
            <View style={styles.imagesContainer}>
              <View style={styles.imageWrapper}>
                <Image source={{ uri: initialImageUri }} style={styles.image} />
                <Text style={styles.imageLabel}>Primary Image</Text>
              </View>
              {data.additionalImages.map((uri: string, index: number) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.image} />
                  <Text style={styles.imageLabel}>Additional {index + 1}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Symptoms Section */}
          {data.symptoms.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Patient Symptoms</Text>
              <View style={styles.tagsContainer}>
                {data.symptoms.map((symptom) => (
                  <Chip
                    key={symptom}
                    style={styles.confirmationTag}
                    textStyle={styles.confirmationTagText}
                  >
                    {symptom}
                  </Chip>
                ))}
              </View>
            </View>
          )}

          {/* Lesion Characteristics Section */}
          {data.lesionCharacteristics.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Lesion Details</Text>
              <View style={styles.tagsContainer}>
                {data.lesionCharacteristics.map((characteristic) => (
                  <Chip
                    key={characteristic}
                    style={styles.confirmationTag}
                    textStyle={styles.confirmationTagText}
                  >
                    {characteristic}
                  </Chip>
                ))}
              </View>
            </View>
          )}

          {/* Urgency Assessment */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Assessment</Text>
            <View style={[styles.urgencyDisplay, { backgroundColor: getUrgencyColor(data.urgencyLevel) }]}>
              <Text style={styles.urgencyDisplayText}>
                {getUrgencyLabel(data.urgencyLevel)}
              </Text>
            </View>
          </View>

          {/* Notes Section */}
          {data.notes.trim() && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Notes</Text>
              <Card style={styles.notesCard}>
                <Card.Content>
                  <Text style={styles.notesText}>{data.notes}</Text>
                </Card.Content>
              </Card>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={onEdit}
              style={styles.editButton}
            >
              Edit Details
            </Button>
            <Button
              mode="contained"
              onPress={onConfirm}
              style={styles.confirmButton}
            >
              Confirm & Save for Doctor
            </Button>
          </View>
        </ScrollView>
      </BaseBottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageWrapper: {
    marginRight: 12,
    marginBottom: 12,
    alignItems: 'center',
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
  confirmationTag: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: theme.colors.primaryContainer,
  },
  confirmationTagText: {
    color: theme.colors.onPrimaryContainer,
    fontSize: 14,
  },
  urgencyDisplay: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  urgencyDisplayText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notesCard: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  notesText: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    lineHeight: 24,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  editButton: {
    marginBottom: 12,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
  },
});

export default ConfirmationBottomSheet;