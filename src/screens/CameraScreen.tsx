import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Text, Button, FAB, Appbar, Chip } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import AlertBottomSheet, { AlertBottomSheetRef } from '../components/AlertBottomSheet';
import { BackIcon, FlashIcon, AutoFocusIcon, CameraIcon, CloseIcon, RedoIcon, AnalyzeIcon } from '../assets/icons';

type CameraScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Camera'>;
type CameraScreenRouteProp = RouteProp<RootStackParamList, 'Camera'>;

// Icon wrapper for back action
const BackActionIcon = ({ color, size }: { color: string; size: number }) => <BackIcon width={size} height={size} fill={color} />;

// Icon wrapper for redo action
const RedoActionIcon = ({ color, size }: { color: string; size: number }) => <RedoIcon width={size} height={size} fill={color} />;

// Icon wrapper for analyze action
const AnalyzeActionIcon = ({ color, size }: { color: string; size: number }) => <AnalyzeIcon width={size} height={size} fill={color} />;

// Icon wrappers for camera controls
const FlashButtonIcon = ({ color, size }: { color: string; size: number }) => <FlashIcon width={size} height={size} fill={color} />;
const FocusButtonIcon = ({ color, size }: { color: string; size: number }) => <AutoFocusIcon width={size} height={size} fill={color} />;
const ShutterButtonIcon = ({ color, size }: { color: string; size: number }) => <CameraIcon width={size} height={size} fill={color} />;

const CameraScreen: React.FC = () => {
  const [capturing, setCapturing] = useState(false);
  const navigation = useNavigation<CameraScreenNavigationProp>();
  const route = useRoute<CameraScreenRouteProp>();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);
  const alertBottomSheetRef = useRef<AlertBottomSheetRef>(null);
  const [alertConfig, setAlertConfig] = useState<{title: string, message: string, buttons?: any[]} | null>(null);

  // Extract patientId from route params
  const { patientId } = route.params;
  console.log('CameraScreen opened for patientId:', patientId);

  // New state for enhanced camera features
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [flashMode, _setFlashMode] = useState<'off' | 'on' | 'auto'>('off');
  const [focusMode, setFocusMode] = useState<'auto' | 'manual'>('auto');
  const [torchMode, setTorchMode] = useState<'off' | 'on'>('off');

  useEffect(() => {
    const checkPermission = async () => {
      console.log('Checking camera permission, current hasPermission:', hasPermission);
      if (!hasPermission) {
        const granted = await requestPermission();
        console.log('Permission granted:', granted);
        if (!granted) {
          setAlertConfig({
            title: 'Camera Permission Required',
            message: 'Camera access is required to capture skin lesions for analysis.',
            buttons: [{ text: 'OK', onPress: () => navigation.goBack() }]
          });
          alertBottomSheetRef.current?.present();
        }
      }
    };
    checkPermission();
  }, [hasPermission, requestPermission, navigation]);

  console.log('CameraScreen render - device:', !!device, 'hasPermission:', hasPermission);

  const handleCapture = async () => {
    if (!camera.current || !device) {
      console.log('Camera not ready:', { camera: !!camera.current, device: !!device });
      return;
    }

    console.log('Taking photo with flash mode:', flashMode);
    setCapturing(true);
    try {
      const photo = await camera.current.takePhoto({
        flash: flashMode,
      });
      console.log('Photo taken:', photo);
      setCapturing(false);

      const imageUri = `file://${photo.path}`;
      console.log('Image URI:', imageUri);
      const newImages = [...capturedImages, imageUri];
      setCapturedImages(newImages);

      // Auto-advance to results if we have 3+ images or user can continue taking more
      if (newImages.length >= 3) {
        console.log('Navigating to results with 3+ images');
        navigation.navigate('Result', { imageUri: newImages[0], additionalImages: newImages.slice(1), patientId });
      } else {
        console.log('Showing capture success dialog');
        setAlertConfig({
          title: 'Photo Captured!',
          message: `Photo ${newImages.length} of 3 captured. Take ${3 - newImages.length} more for best results.`,
          buttons: [
            { text: 'Continue', style: 'default' },
            { text: 'View Results', onPress: () => navigation.navigate('Result', { imageUri: newImages[0], additionalImages: newImages.slice(1), patientId }) }
          ]
        });
        alertBottomSheetRef.current?.present();
      }
    } catch (error) {
      console.error('Camera capture failed:', error);
      setCapturing(false);
      setAlertConfig({ title: 'Error', message: 'Failed to capture photo. Please try again.' });
      alertBottomSheetRef.current?.present();
    }
  };

  const toggleFlash = () => {
    const newTorchMode = torchMode === 'off' ? 'on' : 'off';
    console.log('Toggling torch from', torchMode, 'to', newTorchMode);
    setTorchMode(newTorchMode);

    setAlertConfig({
      title: 'Flashlight',
      message: `Flashlight ${newTorchMode === 'on' ? 'ON' : 'OFF'}`
    });
    alertBottomSheetRef.current?.present();
  };

  const toggleFocus = () => {
    const newMode = focusMode === 'auto' ? 'manual' : 'auto';
    console.log('Toggling focus from', focusMode, 'to', newMode);
    setFocusMode(newMode);

    setAlertConfig({
      title: 'Focus Mode',
      message: `Focus set to: ${newMode.toUpperCase()}`
    });
    alertBottomSheetRef.current?.present();
  };

  const removeImage = (index: number) => {
    const newImages = capturedImages.filter((_, i) => i !== index);
    setCapturedImages(newImages);
  };

  const handleCancel = () => {
    console.log('Back button pressed, turning off flashlight and navigating back');
    // Turn off flashlight before navigating away
    setTorchMode('off');
    navigation.goBack();
  };

  const handleRedo = () => {
    console.log('Redo button pressed, clearing all captured images');
    setCapturedImages([]);
    setAlertConfig({
      title: 'Session Reset',
      message: 'All captured images have been cleared. Start fresh!'
    });
    alertBottomSheetRef.current?.present();
  };

  const handleDone = () => {
    console.log('Done button pressed, turning off flashlight and navigating to results');
    // Turn off flashlight before navigating to results
    setTorchMode('off');
    if (capturedImages.length > 0) {
      navigation.navigate('Result', {
        imageUri: capturedImages[0],
        additionalImages: capturedImages.slice(1),
        patientId
      });
    } else {
      setAlertConfig({
        title: 'No Photos',
        message: 'Please take at least one photo before proceeding.'
      });
      alertBottomSheetRef.current?.present();
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>No camera device available</Text>
      </View>
    );
  }

  console.log('Rendering camera UI with controls');

  return (
    <View style={styles.container}>
      {/* Navigation Bar */}
      <Appbar.Header style={styles.navbar}>
        <Appbar.Action icon={BackActionIcon} onPress={handleCancel} />
        <Appbar.Content title={`Triage - Patient ${patientId}`} />
        <View style={styles.headerActions}>
          {capturedImages.length > 0 && (
            <Appbar.Action icon={RedoActionIcon} onPress={handleRedo} />
          )}
          {capturedImages.length > 0 && (
            <Appbar.Action icon={AnalyzeActionIcon} onPress={handleDone} />
          )}
        </View>
      </Appbar.Header>

      {/* Captured Images Preview */}
      {capturedImages.length > 0 && (
        <View style={styles.previewContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewScroll}>
            {capturedImages.map((uri, index) => (
              <View key={index} style={styles.previewItem}>
                <Image source={{ uri }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}
                >
                  <CloseIcon width={12} height={12} fill="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.previewLabel}>{index + 1}</Text>
              </View>
            ))}
          </ScrollView>
          <Chip style={styles.photoCountChip}>
            {capturedImages.length}/3 Photos
          </Chip>
        </View>
      )}

      {/* Real Camera View */}
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
        torch={torchMode}
        onError={(error) => {
          console.error('Camera error:', error);
          setAlertConfig({ title: 'Camera Error', message: 'Failed to initialize camera' });
          alertBottomSheetRef.current?.present();
        }}
      />

      <View style={styles.overlay}>
        <Text style={styles.overlayText}>Position the skin lesion</Text>
        <Text style={styles.instructionText}>
          Center the lesion within the guide circle for best results
        </Text>
        <View style={styles.guideCircle} />
      </View>

      {/* Camera Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.controlsRow}>
          <Button
            mode="outlined"
            onPress={toggleFlash}
            style={styles.controlButton}
            textColor="#FFFFFF"
            icon={FlashButtonIcon}
          >
            {''}
          </Button>
          <Button
            mode="outlined"
            onPress={toggleFocus}
            style={styles.controlButton}
            textColor="#FFFFFF"
            icon={FocusButtonIcon}
          >
            {focusMode.toUpperCase()}
          </Button>
        </View>
      </View>

      {/* Capture Button */}
      <View style={styles.captureContainer}>
        <FAB
          icon={ShutterButtonIcon}
          size="medium"
          onPress={handleCapture}
          loading={capturing}
          style={styles.captureButton}
        />
      </View>

      <AlertBottomSheet
        ref={alertBottomSheetRef}
        title={alertConfig?.title || ''}
        message={alertConfig?.message || ''}
        buttons={alertConfig?.buttons}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  navbar: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    elevation: 0,
    zIndex: 20,
  },
  headerActions: {
    flexDirection: 'row',
  },
  previewContainer: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    zIndex: 15,
    paddingHorizontal: 16,
  },
  previewScroll: {
    marginBottom: 8,
  },
  previewItem: {
    marginRight: 12,
    position: 'relative',
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#F44336',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewLabel: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#FFFFFF',
    fontSize: 10,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  photoCountChip: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 191, 255, 0.9)',
  },
  camera: {
    flex: 1,
  },
  permissionText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 120, // Leave space for controls at bottom
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  overlayText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  guideCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderStyle: 'dashed',
    position: 'absolute',
    zIndex: 2,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlButton: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  captureContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  captureButton: {
    backgroundColor: '#FFFFFF',
  },
});

export default CameraScreen;