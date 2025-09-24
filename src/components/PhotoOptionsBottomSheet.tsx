import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { theme } from '../utils/theme';
import BaseBottomSheet from './BaseBottomSheet';

export interface PhotoOptionsBottomSheetProps {
  onTakePhoto: () => void;
  onChooseFromGallery: () => void;
}

export interface PhotoOptionsBottomSheetRef {
  present: () => void;
  dismiss: () => void;
}

const PhotoOptionsBottomSheet = forwardRef<PhotoOptionsBottomSheetRef, PhotoOptionsBottomSheetProps>(
  ({ onTakePhoto, onChooseFromGallery }, ref) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => ({
      present: () => {
        bottomSheetRef.current?.present();
      },
      dismiss: () => {
        bottomSheetRef.current?.dismiss();
      },
    }));

    const handleTakePhoto = () => {
      bottomSheetRef.current?.dismiss();
      setTimeout(() => {
        onTakePhoto();
      }, 300);
    };

    const handleChooseFromGallery = () => {
      bottomSheetRef.current?.dismiss();
      setTimeout(() => {
        onChooseFromGallery();
      }, 300);
    };

    const handleCancel = () => {
      bottomSheetRef.current?.dismiss();
    };

    return (
      <BaseBottomSheet
        ref={bottomSheetRef}
        title="Add Photo"
        snapPoints={['30%']}
      >
        <View style={styles.container}>
          <TouchableOpacity style={styles.option} onPress={handleTakePhoto}>
            <FontAwesome5 name="camera" size={24} color={theme.colors.primary} />
            <Text style={styles.optionText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={handleChooseFromGallery}>
            <FontAwesome5 name="images" size={24} color={theme.colors.primary} />
            <Text style={styles.optionText}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelOption} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </BaseBottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginLeft: 16,
    fontWeight: '500',
  },
  cancelOption: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: theme.colors.error,
    fontWeight: '500',
  },
});

export default PhotoOptionsBottomSheet;