import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { theme } from '../../utils/theme';
import BaseBottomSheet from '../../components/BaseBottomSheet';
import RegisterPatientBottomSheet from '../bottomSheets/RegisterPatientBottomSheet';

const CHWRegisterPatientScreen: React.FC = () => {
  const registerSheetRef = useRef<BottomSheetModal>(null);

  const handleRegisterPress = () => {
    registerSheetRef.current?.present();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Register Patient</Text>
        <Text style={styles.subtitle}>Add new patients to the system</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <FontAwesome5 name="user-plus" size={64} color={theme.colors.primary} style={styles.icon} />
          <Text style={styles.description}>
            Register a new patient to begin their medical journey with DermaDetect.
            Collect their basic information and start providing care.
          </Text>
          <Button
            mode="contained"
            onPress={handleRegisterPress}
            style={styles.registerButton}
            contentStyle={styles.buttonContent}
          >
            Register New Patient
          </Button>
        </Card.Content>
      </Card>

      <BaseBottomSheet
        ref={registerSheetRef}
        title="Register Patient"
        snapPoints={['80%', '90%']}
      >
        <RegisterPatientBottomSheet
          onDismiss={() => registerSheetRef.current?.dismiss()}
        />
      </BaseBottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  card: {
    backgroundColor: theme.colors.cardBackground,
    elevation: 4,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  icon: {
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  registerButton: {
    minWidth: 200,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default CHWRegisterPatientScreen;