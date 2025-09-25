import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { theme } from '../utils/theme';
import BaseBottomSheet from './BaseBottomSheet';
import { ThumbsDownIcon } from '../assets/icons';

export interface TriageResultBottomSheetProps {
  onProceed: () => void;
}

export interface TriageResultBottomSheetRef {
  present: () => void;
  dismiss: () => void;
}

const TriageResultBottomSheet = forwardRef<TriageResultBottomSheetRef, TriageResultBottomSheetProps>(
  ({ onProceed }, ref) => {
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
        snapPoints={['60%']}
        enableBackdropPress={false}
      >
        <View style={styles.container}>
          {/* Red Alert Block */}
          <View style={styles.alertBlock}>
            <ThumbsDownIcon
              width={48}
              height={48}
              fill="white"
              style={styles.alertIcon}
            />
            <Text style={styles.alertTitle}>HIGH RISK</Text>
            <Text style={styles.alertSubtitle}>Urgent Referral Recommended</Text>
          </View>

          {/* Call to Action */}
          <View style={styles.actionContainer}>
            <Button
              mode="contained"
              onPress={onProceed}
              style={styles.proceedButton}
              labelStyle={styles.proceedButtonText}
            >
              Proceed to Add Details for Doctor
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
  },
  alertBlock: {
    backgroundColor: '#DC3545', // Deep red
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 30,
    borderRadius: 8,
  },
  alertIcon: {
    marginBottom: 16,
  },
  alertTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  alertSubtitle: {
    fontSize: 18,
    color: 'white',
    opacity: 0.9,
  },
  actionContainer: {
    paddingHorizontal: 20,
  },
  proceedButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TriageResultBottomSheet;