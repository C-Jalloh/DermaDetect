import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTheme } from 'react-native-paper';
import BaseBottomSheet from './BaseBottomSheet';

export interface AlertBottomSheetProps {
  title: string;
  message: string;
  buttons?: Array<{
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
  }>;
}

export interface AlertBottomSheetRef {
  present: () => void;
  dismiss: () => void;
}

const AlertBottomSheet = forwardRef<AlertBottomSheetRef, AlertBottomSheetProps>(
  ({ title, message, buttons = [{ text: 'OK' }] }, ref) => {
    const theme = useTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => ({
      present: () => {
        bottomSheetRef.current?.present();
      },
      dismiss: () => {
        bottomSheetRef.current?.dismiss();
      },
    }));

    const handleButtonPress = (onPress?: () => void) => {
      if (onPress) {
        onPress();
      }
      bottomSheetRef.current?.dismiss();
    };

    const getButtonStyle = (style?: string) => {
      switch (style) {
        case 'destructive':
          return styles.destructiveButton;
        case 'cancel':
          return styles.cancelButton;
        default:
          return styles.defaultButton;
      }
    };

    const getButtonTextStyle = (style?: string) => {
      switch (style) {
        case 'destructive':
          return styles.destructiveButtonText;
        case 'cancel':
          return styles.cancelButtonText;
        default:
          return styles.defaultButtonText;
      }
    };

    return (
      <BaseBottomSheet
        ref={bottomSheetRef}
        title={title}
        snapPoints={['30%', '50%']}
        enableBackdropPress={false}
      >
        <View style={styles.content}>
          <Text style={[styles.message, { color: theme.colors.onSurface }]}>
            {message}
          </Text>
          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.button, getButtonStyle(button.style)]}
                onPress={() => handleButtonPress(button.onPress)}
              >
                <Text style={[styles.buttonText, getButtonTextStyle(button.style)]}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </BaseBottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  defaultButton: {
    backgroundColor: '#00BFFF',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00BFFF',
  },
  destructiveButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  defaultButtonText: {
    color: '#FFFFFF',
  },
  cancelButtonText: {
    color: '#00BFFF',
  },
  destructiveButtonText: {
    color: '#FFFFFF',
  },
});

export default AlertBottomSheet;