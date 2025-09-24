import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Text, Card, Button, IconButton, ProgressBar } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { simulateAIAnalysis } from '../services/dummyData';
import { theme } from '../utils/theme';
import TriageResultBottomSheet, { TriageResultBottomSheetRef } from '../components/TriageResultBottomSheet';
import DataEnrichmentBottomSheet, { DataEnrichmentBottomSheetRef, DataEnrichmentData } from '../components/DataEnrichmentBottomSheet';
import ConfirmationBottomSheet, { ConfirmationBottomSheetRef } from '../components/ConfirmationBottomSheet';
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType } from 'react-native-image-picker';

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;
type ResultScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Result'>;

interface Props {
  route: ResultScreenRouteProp;
}

const ResultScreen: React.FC<Props> = ({ route }) => {
  const { imageUri, additionalImages = [], patientId } = route.params;
  console.log('ResultScreen opened for patientId:', patientId);
  const allImages = [imageUri, ...additionalImages];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [analyzing, setAnalyzing] = useState(true);
  const [result, setResult] = useState<'low' | 'medium' | 'high' | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const navigation = useNavigation<ResultScreenNavigationProp>();

  // Bottom sheet refs
  const triageResultSheetRef = useRef<TriageResultBottomSheetRef>(null);
  const dataEnrichmentSheetRef = useRef<DataEnrichmentBottomSheetRef>(null);
  const confirmationSheetRef = useRef<ConfirmationBottomSheetRef>(null);

  // Enrichment data state
  const [enrichmentData, setEnrichmentData] = useState<DataEnrichmentData | null>(null);

  useEffect(() => {
    const analyzeImage = async () => {
      try {
        const analysisResult = await simulateAIAnalysis(imageUri);
        setResult(analysisResult);
      } catch (error) {
        console.error('Analysis failed:', error);
        setResult('medium'); // Fallback
      } finally {
        setAnalyzing(false);
      }
    };

    analyzeImage();
  }, [imageUri]);

  const getResultColor = () => {
    switch (result) {
      case 'low': return theme.colors.riskLow;
      case 'medium': return theme.colors.riskMedium;
      case 'high': return theme.colors.riskHigh;
      default: return theme.colors.textSecondary;
    }
  };

  const getResultTitle = () => {
    switch (result) {
      case 'low': return 'Not Serious';
      case 'medium': return 'Needs Attention';
      case 'high': return 'Very Serious';
      default: return 'Analyzing...';
    }
  };

  const getResultSubtitle = () => {
    switch (result) {
      case 'low': return 'Low risk, monitor for changes';
      case 'medium': return 'Moderate risk factors present';
      case 'high': return 'High-risk characteristics detected';
      default: return '';
    }
  };

  const nextImage = () => {
    if (currentImageIndex < allImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const getRecommendations = () => {
    switch (result) {
      case 'low':
        return [
          'Continue regular skin monitoring',
          'Maintain good skin hygiene',
          'Use sunscreen protection',
        ];
      case 'medium':
        return [
          'Schedule follow-up in 2-4 weeks',
          'Monitor for any changes',
          'Keep detailed records',
        ];
      case 'high':
        return [
          'Seek immediate medical attention',
          'Prepare detailed medical history',
          'Bring all previous records',
        ];
      default:
        return [];
    }
  };

  const getConfidenceData = () => {
    // Mock confidence data
    switch (result) {
      case 'low':
        return { confidence: 0.87, probabilities: { low: 0.87, medium: 0.11, high: 0.02 } };
      case 'medium':
        return { confidence: 0.76, probabilities: { low: 0.15, medium: 0.76, high: 0.09 } };
      case 'high':
        return { confidence: 0.92, probabilities: { low: 0.03, medium: 0.05, high: 0.92 } };
      default:
        return { confidence: 0, probabilities: { low: 0, medium: 0, high: 0 } };
    }
  };

  const handleContinue = () => {
    if (result === 'high') {
      // Show triage result bottom sheet for high risk cases
      triageResultSheetRef.current?.present();
    } else {
      // Navigate to CHW home screen for non-high risk cases
      navigation.reset({
        index: 0,
        routes: [{ name: 'CHWMain' }],
      });
    }
  };

  const handleTriageProceed = () => {
    // Dismiss triage result sheet and show data enrichment sheet
    triageResultSheetRef.current?.dismiss();
    setTimeout(() => {
      dataEnrichmentSheetRef.current?.present();
    }, 300); // Small delay for smooth transition
  };

  const handleDataEnrichmentContinue = (data: DataEnrichmentData) => {
    // Store enrichment data and show confirmation sheet
    setEnrichmentData(data);
    dataEnrichmentSheetRef.current?.dismiss();
    setTimeout(() => {
      confirmationSheetRef.current?.present();
    }, 300);
  };

  const handleConfirmationConfirm = () => {
    // TODO: Save case to database with urgent flag
    // For now, just navigate back with success message
    confirmationSheetRef.current?.dismiss();
    // Show success message and navigate to CHW home screen
    setTimeout(() => {
      // Navigate to CHW home screen instead of going back to camera
      navigation.reset({
        index: 0,
        routes: [{ name: 'CHWMain' }],
      });
    }, 500);
  };

  const handleConfirmationEdit = () => {
    // Go back to data enrichment sheet
    confirmationSheetRef.current?.dismiss();
    setTimeout(() => {
      dataEnrichmentSheetRef.current?.present();
    }, 300);
  };

  const handleAddPhoto = () => {
    Alert.alert(
      'Add Photo',
      'Choose how to add a photo',
      [
        {
          text: 'Take Photo',
          onPress: () => {
            const options = {
              mediaType: 'photo' as MediaType,
              quality: 0.8 as any, // PhotoQuality type issue, using any for now
              includeBase64: false,
            };
            launchCamera(options, (response: ImagePickerResponse) => {
              if (response.didCancel) {
                console.log('User cancelled camera');
              } else if (response.errorMessage) {
                console.log('Camera Error: ', response.errorMessage);
                Alert.alert('Error', 'Failed to take photo');
              } else if (response.assets && response.assets[0]) {
                const newImageUri = response.assets[0].uri;
                if (newImageUri) {
                  // Add the new image to the additional images in data enrichment
                  setEnrichmentData(prev => prev ? {
                    ...prev,
                    additionalImages: [...prev.additionalImages, newImageUri]
                  } : {
                    additionalImages: [newImageUri],
                    symptoms: [],
                    lesionCharacteristics: [],
                    urgencyLevel: 'high',
                    notes: ''
                  });
                  Alert.alert('Success', 'Photo added successfully!');
                }
              }
            });
          },
        },
        {
          text: 'Choose from Gallery',
          onPress: () => {
            const options = {
              mediaType: 'photo' as MediaType,
              quality: 0.8 as any, // PhotoQuality type issue, using any for now
              includeBase64: false,
            };
            launchImageLibrary(options, (response: ImagePickerResponse) => {
              if (response.didCancel) {
                console.log('User cancelled image picker');
              } else if (response.errorMessage) {
                console.log('ImagePicker Error: ', response.errorMessage);
                Alert.alert('Error', 'Failed to select photo');
              } else if (response.assets && response.assets[0]) {
                const newImageUri = response.assets[0].uri;
                if (newImageUri) {
                  // Add the new image to the additional images in data enrichment
                  setEnrichmentData(prev => prev ? {
                    ...prev,
                    additionalImages: [...prev.additionalImages, newImageUri]
                  } : {
                    additionalImages: [newImageUri],
                    symptoms: [],
                    lesionCharacteristics: [],
                    urgencyLevel: 'high',
                    notes: ''
                  });
                  Alert.alert('Success', 'Photo added successfully!');
                }
              }
            });
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleRetake = () => {
    navigation.goBack();
  };

  if (analyzing) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require('../assets/loading.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
        <Text style={styles.loadingText}>Analyzing lesion...</Text>
        <Text style={styles.loadingSubtext}>This may take a moment</Text>
      </View>
    );
  }

  const confidenceData = getConfidenceData();

  const getChartData = () => {
    const probabilities = confidenceData.probabilities;
    return [
      {
        value: probabilities.low * 100,
        label: 'Low',
        frontColor: theme.colors.riskLow,
      },
      {
        value: probabilities.medium * 100,
        label: 'Medium',
        frontColor: theme.colors.riskMedium,
      },
      {
        value: probabilities.high * 100,
        label: 'High',
        frontColor: theme.colors.riskHigh,
      },
    ];
  };

  const chartData = getChartData();

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* IMAGE DISPLAY - Show captured image(s) with navigation */}
      <View style={styles.imageContainer}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: allImages[currentImageIndex] }}
            style={styles.capturedImage}
            resizeMode="cover"
          />
          
          {/* Navigation arrows for multiple images */}
          {allImages.length > 1 && (
            <>
              <TouchableOpacity
                style={[styles.navArrow, styles.leftArrow]}
                onPress={prevImage}
                disabled={currentImageIndex === 0}
              >
                <MaterialIcons 
                  name="chevron-left" 
                  size={32} 
                  color={currentImageIndex === 0 ? theme.colors.textSecondary : theme.colors.textPrimary} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.navArrow, styles.rightArrow]}
                onPress={nextImage}
                disabled={currentImageIndex === allImages.length - 1}
              >
                <MaterialIcons 
                  name="chevron-right" 
                  size={32} 
                  color={currentImageIndex === allImages.length - 1 ? theme.colors.textSecondary : theme.colors.textPrimary} 
                />
              </TouchableOpacity>
            </>
          )}
        </View>
        
        {/* Image counter */}
        {allImages.length > 1 && (
          <View style={styles.imageCounter}>
            <Text style={styles.imageCounterText}>
              {currentImageIndex + 1} of {allImages.length}
            </Text>
          </View>
        )}
      </View>

      {/* PRIMARY RESULT - At-a-glance, no scrolling needed */}
      <View>
        <Card style={[styles.primaryResultCard, { backgroundColor: getResultColor() }]}>
          <Card.Content style={styles.primaryResultContent}>
            <View style={styles.resultIcon}>
              <MaterialIcons name="check-circle" size={30} color={theme.colors.textPrimary} />
            </View>
            <View style={styles.resultText}>
              <Text style={styles.primaryResultTitle}>{getResultTitle()}</Text>
              <Text style={styles.primaryResultSubtitle}>{getResultSubtitle()}</Text>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* RECOMMENDATIONS - Actionable advice */}
      <View>
        <Card style={styles.recommendationsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            {getRecommendations().map((recommendation, index) => (
              <View key={index} style={styles.recommendationItem}>
                <MaterialIcons name="arrow-right" size={16} color={theme.colors.primary} />
                <Text style={styles.recommendationText}>{recommendation}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      </View>

      {/* DETAILED ANALYSIS - Collapsible */}
      <Card style={styles.detailsCard}>
        <TouchableOpacity
          style={styles.detailsHeader}
          onPress={() => setShowDetails(!showDetails)}
        >
          <Text style={styles.sectionTitle}>View Detailed Analysis</Text>
          <IconButton
            icon={showDetails ? 'chevron-up' : 'chevron-down'}
            iconColor={theme.colors.textSecondary}
            size={24}
          />
        </TouchableOpacity>

        {showDetails && (
          <Card.Content style={styles.detailsContent}>
            {/* Confidence Level */}
            <Text style={styles.detailSubtitle}>Confidence Level</Text>
            <ProgressBar
              progress={confidenceData.confidence}
              color={getResultColor()}
              style={styles.progressBar}
            />
            <Text style={styles.confidenceText}>
              {(confidenceData.confidence * 100).toFixed(1)}%
            </Text>

            {/* Classification Probabilities */}
            <Text style={styles.detailSubtitleWithMargin}>Classification Probabilities</Text>
            <BarChart
              data={chartData}
              width={300}
              height={200}
              barWidth={40}
              spacing={20}
              barBorderRadius={4}
              yAxisThickness={0}
              xAxisThickness={0}
              hideRules
              hideYAxisText
              showValuesAsTopLabel
              topLabelTextStyle={{ color: theme.colors.textPrimary, fontSize: 12 }}
              xAxisLabelTextStyle={{ color: theme.colors.textSecondary, fontSize: 12 }}
            />
          </Card.Content>
        )}
      </Card>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={handleRetake}
          style={[styles.button, styles.retakeButton]}
          contentStyle={styles.buttonContent}
          textColor={theme.colors.textSecondary}
        >
          Retake Photo
        </Button>
        <Button
          mode="contained"
          onPress={handleContinue}
          style={[styles.button, styles.continueButton]}
          contentStyle={styles.buttonContent}
          buttonColor={theme.colors.primary}
        >
          {result === 'high' ? 'Add Details' : 'Save & Complete'}
        </Button>
      </View>

      {/* DISCLAIMER - Footer */}
      <Text style={styles.disclaimer}>
        This is an AI analysis tool. Please consult a healthcare professional for medical advice.
      </Text>
    </ScrollView>

    {/* Bottom Sheets for Red Triage Workflow */}
    <TriageResultBottomSheet
      ref={triageResultSheetRef}
      onProceed={handleTriageProceed}
    />
    <DataEnrichmentBottomSheet
      ref={dataEnrichmentSheetRef}
      initialImageUri={imageUri}
      additionalImages={enrichmentData?.additionalImages || []}
      onContinue={handleDataEnrichmentContinue}
      onAddPhoto={handleAddPhoto}
    />
    {enrichmentData && (
      <ConfirmationBottomSheet
        ref={confirmationSheetRef}
        initialImageUri={imageUri}
        data={enrichmentData}
        onConfirm={handleConfirmationConfirm}
        onEdit={handleConfirmationEdit}
      />
    )}
  </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  lottie: {
    width: 150,
    height: 150,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: theme.colors.textPrimary,
  },
  loadingSubtext: {
    fontSize: 14,
    marginTop: 8,
    color: theme.colors.textSecondary,
  },
  primaryResultCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 0,
    shadowOpacity: 0,
  },
  primaryResultContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  resultIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  checkmark: {
    fontSize: 30,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  resultText: {
    flex: 1,
  },
  primaryResultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  primaryResultSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  recommendationsCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: 16,
    elevation: 0,
    shadowOpacity: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 16,
    color: theme.colors.primary,
    marginRight: 12,
    marginTop: 2,
  },
  recommendationText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.textPrimary,
    lineHeight: 24,
  },
  detailsCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: 24,
    elevation: 0,
    shadowOpacity: 0,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  detailsContent: {
    padding: 16,
    paddingTop: 0,
  },
  detailSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  detailSubtitleWithMargin: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 12,
    marginTop: 24,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  confidenceText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'right',
  },
  probabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  probabilityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  probabilityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  probabilityLabel: {
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  probabilityValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  retakeButton: {
    borderColor: theme.colors.textSecondary,
  },
  continueButton: {
    backgroundColor: theme.colors.primary,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  disclaimer: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  imageContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    elevation: 4,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  capturedImage: {
    width: '100%',
    height: '100%',
  },
  navArrow: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -16 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftArrow: {
    left: 16,
  },
  rightArrow: {
    right: 16,
  },
  imageCounter: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  imageCounterText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ResultScreen;
