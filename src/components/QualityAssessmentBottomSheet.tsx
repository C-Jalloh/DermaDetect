import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { theme } from '../utils/theme';
import BaseBottomSheet from './BaseBottomSheet';
import { ThumbsUpIcon, ThumbsDownIcon } from '../assets/icons';

export interface QualityAssessmentBottomSheetProps {
  onThumbsUp: () => void;
  onThumbsDown: () => void;
  onSkip: () => void;
}

export interface QualityAssessmentBottomSheetRef {
  present: () => void;
  dismiss: () => void;
}

const QualityAssessmentBottomSheet = forwardRef<QualityAssessmentBottomSheetRef, QualityAssessmentBottomSheetProps>(
  ({ onThumbsUp, onThumbsDown, onSkip }, ref) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => ({
      present: () => {
        bottomSheetRef.current?.present();
      },
      dismiss: () => {
        bottomSheetRef.current?.dismiss();
      },
    }));

    return (
      <BaseBottomSheet
        ref={bottomSheetRef}
        snapPoints={['50%']}
        enableBackdropPress={true}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>How was the analysis?</Text>
            <Text style={styles.subtitle}>Help us improve by rating the AI analysis quality</Text>
          </View>

          {/* Rating Options */}
          <View style={styles.ratingContainer}>
            <TouchableOpacity
              style={[styles.ratingOption, styles.goodRating]}
              onPress={onThumbsUp}
            >
              <ThumbsUpIcon width={48} height={48} fill="white" />
              <Text style={styles.ratingText}>Good Analysis</Text>
              <Text style={styles.ratingSubtext}>Accurate and helpful</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.ratingOption, styles.badRating]}
              onPress={onThumbsDown}
            >
              <ThumbsDownIcon width={48} height={48} fill="white" />
              <Text style={styles.ratingText}>Needs Improvement</Text>
              <Text style={styles.ratingSubtext}>Inaccurate or unclear</Text>
            </TouchableOpacity>
          </View>

          {/* Skip Option */}
          <View style={styles.skipContainer}>
            <Button
              mode="text"
              onPress={onSkip}
              labelStyle={styles.skipButtonText}
            >
              Skip for now
            </Button>
          </View>
        </View>
      </BaseBottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 16,
  },
  ratingOption: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  goodRating: {
    backgroundColor: theme.colors.success, // Green for good
  },
  badRating: {
    backgroundColor: theme.colors.error, // Red for bad
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
    textAlign: 'center',
  },
  ratingSubtext: {
    fontSize: 12,
    color: 'white',
    opacity: 0.9,
    marginTop: 4,
    textAlign: 'center',
  },
  skipContainer: {
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
});

export default QualityAssessmentBottomSheet;