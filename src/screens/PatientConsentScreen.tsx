import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, Checkbox, Title } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { theme } from '../utils/theme';

type PatientConsentScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PatientConsent'>;
type PatientConsentScreenRouteProp = RouteProp<RootStackParamList, 'PatientConsent'>;

interface Props {
  route: PatientConsentScreenRouteProp;
}

const PatientConsentScreen: React.FC<Props> = ({ route }) => {
  const patientId = route?.params?.patientId;
  const [consentGiven, setConsentGiven] = useState(false);
  const navigation = useNavigation<PatientConsentScreenNavigationProp>();

  const handleContinue = () => {
    if (consentGiven) {
      if (patientId) {
        navigation.navigate('Camera', { patientId });
      } else {
        // No patient selected, navigate to patient selection or registration
        navigation.navigate('CHWMain');
      }
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.titleContainer}>
              <MaterialIcons name="local-hospital" size={24} color={theme.colors.textPrimary} />
              <Title style={styles.title}>Patient Consent</Title>
            </View>

            <Text style={styles.consentText}>
              I understand that a photo of my skin condition will be taken for analysis by the DermaDetect system.
              This image may be used to improve the AI system for better diagnosis of skin conditions.
              {'\n\n'}
              My privacy will be protected, and the image will be anonymized before any analysis or research use.
              {'\n\n'}
              I give my verbal consent for this procedure.
            </Text>

            <View style={styles.checkboxContainer}>
              <Checkbox
                status={consentGiven ? 'checked' : 'unchecked'}
                onPress={() => setConsentGiven(!consentGiven)}
              />
              <Text style={styles.checkboxText}>
                Patient has given verbal consent for image capture and analysis
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={handleCancel}
          style={[styles.button, styles.cancelButton]}
          contentStyle={styles.buttonContent}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleContinue}
          disabled={!consentGiven}
          style={[styles.button, styles.continueButton]}
          contentStyle={styles.buttonContent}
        >
          Continue
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    elevation: 0,
    shadowOpacity: 0,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 0,
    marginLeft: 12,
    color: theme.colors.textPrimary,
  },
  consentText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
    color: theme.colors.textPrimary,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checkboxText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 8,
    color: theme.colors.textPrimary,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 40,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    borderColor: theme.colors.textSecondary,
  },
  continueButton: {
    backgroundColor: theme.colors.primary,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default PatientConsentScreen;