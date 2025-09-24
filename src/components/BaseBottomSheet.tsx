import React, { forwardRef, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomSheetModal, BottomSheetScrollView, BottomSheetHandle } from '@gorhom/bottom-sheet';
import { theme } from '../utils/theme';

interface BaseBottomSheetProps {
  title?: string;
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  enableBackdropPress?: boolean;
  onBackdropPress?: () => void;
}

const BaseBottomSheet = forwardRef<BottomSheetModal, BaseBottomSheetProps>(
  ({ title, children, snapPoints = ['50%', '90%'], enableBackdropPress = true, onBackdropPress }, ref) => {
    const handleComponent = useCallback(
      (props: any) => (
        <BottomSheetHandle {...props}>
          <View style={styles.handle} />
        </BottomSheetHandle>
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        handleComponent={handleComponent}
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.handleIndicator}
        enableDismissOnClose={enableBackdropPress}
        onDismiss={onBackdropPress}
      >
        <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
          {title && (
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
            </View>
          )}
          {children}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#3B3E47', // 20% lighter than screen background (#0A0E1A)
  },
  handle: {
    backgroundColor: '#3B3E47', // Match the background color
  },
  handleIndicator: {
    backgroundColor: theme.colors.onSurfaceVariant,
  },
  scrollContent: {
    padding: 16,
  },
  titleContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
});

export default BaseBottomSheet;