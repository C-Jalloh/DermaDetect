import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Switch, Button, Appbar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../store';
import { theme } from '../../utils/theme';
import {
  BackIcon,
  SecurityIcon,
  BellIcon,
  AutoSaveIcon,
  OfflineModeIcon,
  HighQualityImagesIcon,
  BiometricOnIcon,
  BiometricOffIcon,
  ClearCacheIcon,
  ResetToDefaultsIcon,
  StethoscopeIcon,
  DatabaseIcon,
  CameraIcon,
  UserIcon,
  ShieldIcon
} from '../../assets/icons';
import AlertBottomSheet, { AlertBottomSheetRef } from '../../components/AlertBottomSheet';

// Icon wrapper components to avoid defining during render
const UserTabIcon = () => <UserIcon width={24} height={24} fill={theme.colors.primary} />;
const StethoscopeTabIcon = () => <StethoscopeIcon width={24} height={24} fill={theme.colors.primary} />;
const DatabaseTabIcon = () => <DatabaseIcon width={24} height={24} fill={theme.colors.primary} />;
const CameraTabIcon = () => <CameraIcon width={24} height={24} fill={theme.colors.primary} />;
const SecurityTabIcon = () => <SecurityIcon size={24} color={theme.colors.primary} />;
const ClearCacheTabIcon = () => <ClearCacheIcon size={20} color={theme.colors.error} />;
const ResetToDefaultsIconComponent = () => <ResetToDefaultsIcon size={20} color={theme.colors.error} />;
const BackActionIcon = ({ color, size }: { color: string; size: number }) => <BackIcon width={size} height={size} fill={color} />;

const DoctorSettingsScreen: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigation = useNavigation();
  const alertBottomSheetRef = React.useRef<AlertBottomSheetRef>(null);
  const [alertConfig, setAlertConfig] = useState<{title: string, message: string, buttons?: any[]} | null>(null);

  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [urgentAlertsEnabled, setUrgentAlertsEnabled] = useState(true);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [offlineModeEnabled, setOfflineModeEnabled] = useState(false);
  const [highQualityImages, setHighQualityImages] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [caseReminders, setCaseReminders] = useState(true);

  const handleClearCache = () => {
    setAlertConfig({
      title: 'Clear Cache',
      message: 'This will clear all cached patient data and images. Continue?',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement cache clearing
            setAlertConfig({
              title: 'Success',
              message: 'Cache cleared successfully.'
            });
            alertBottomSheetRef.current?.present();
          }
        }
      ]
    });
    alertBottomSheetRef.current?.present();
  };

  const handleResetSettings = () => {
    setAlertConfig({
      title: 'Reset Settings',
      message: 'This will reset all settings to default. Continue?',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setNotificationsEnabled(true);
            setUrgentAlertsEnabled(true);
            setAutoSaveEnabled(true);
            setOfflineModeEnabled(false);
            setHighQualityImages(true);
            setBiometricAuth(false);
            setCaseReminders(true);
            setAlertConfig({
              title: 'Success',
              message: 'Settings reset to default.'
            });
            alertBottomSheetRef.current?.present();
          }
        }
      ]
    });
    alertBottomSheetRef.current?.present();
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>User not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Appbar.Header style={styles.header}>
        <Appbar.Action icon={BackActionIcon} onPress={() => navigation.goBack()} />
        <Appbar.Content title="Settings" />
      </Appbar.Header>

      <View style={styles.contentHeader}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Configure your medical practice preferences</Text>
      </View>

      {/* Account Information */}
      <Card style={styles.card}>
        <Card.Title
          title="Account Information"
          left={UserTabIcon}
          titleStyle={styles.cardTitle}
        />
        <Card.Content>
          <View style={styles.accountInfo}>
            <Text style={styles.accountLabel}>Name:</Text>
            <Text style={styles.accountValue}>{user.username}</Text>
          </View>
          <View style={styles.accountInfo}>
            <Text style={styles.accountLabel}>Role:</Text>
            <Text style={styles.accountValue}>{user.role}</Text>
          </View>
          <View style={styles.accountInfo}>
            <Text style={styles.accountLabel}>Specialization:</Text>
            <Text style={styles.accountValue}>Dermatology</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Clinical Preferences */}
      <Card style={styles.card}>
        <Card.Title
          title="Clinical Preferences"
          left={StethoscopeTabIcon}
          titleStyle={styles.cardTitle}
        />
        <Card.Content>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <BellIcon size={20} color={theme.colors.textSecondary} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              color={theme.colors.primary}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <ShieldIcon size={20} color={theme.colors.riskHigh} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Urgent Alerts</Text>
              </View>
            </View>
            <Switch
              value={urgentAlertsEnabled}
              onValueChange={setUrgentAlertsEnabled}
              color={theme.colors.primary}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <AutoSaveIcon size={20} color={theme.colors.textSecondary} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Auto-save Diagnoses</Text>
              </View>
            </View>
            <Switch
              value={autoSaveEnabled}
              onValueChange={setAutoSaveEnabled}
              color={theme.colors.primary}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <BellIcon size={20} color={theme.colors.textSecondary} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Case Reminders</Text>
              </View>
            </View>
            <Switch
              value={caseReminders}
              onValueChange={setCaseReminders}
              color={theme.colors.primary}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Data & Privacy */}
      <Card style={styles.card}>
        <Card.Title
          title="Data & Privacy"
          left={DatabaseTabIcon}
          titleStyle={styles.cardTitle}
        />
        <Card.Content>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <OfflineModeIcon size={20} color={theme.colors.textSecondary} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Offline Mode</Text>
              </View>
            </View>
            <Switch
              value={offlineModeEnabled}
              onValueChange={setOfflineModeEnabled}
              color={theme.colors.primary}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Imaging Settings */}
      <Card style={styles.card}>
        <Card.Title
          title="Imaging Settings"
          left={CameraTabIcon}
          titleStyle={styles.cardTitle}
        />
        <Card.Content>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <HighQualityImagesIcon size={20} color={theme.colors.textSecondary} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>High Resolution Images</Text>
              </View>
            </View>
            <Switch
              value={highQualityImages}
              onValueChange={setHighQualityImages}
              color={theme.colors.primary}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Security Settings */}
      <Card style={styles.card}>
        <Card.Title
          title="Security"
          left={SecurityTabIcon}
          titleStyle={styles.cardTitle}
        />
        <Card.Content>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                {biometricAuth ? (
                  <BiometricOnIcon size={20} color={theme.colors.textSecondary} />
                ) : (
                  <BiometricOffIcon size={20} color={theme.colors.textSecondary} />
                )}
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Biometric Authentication</Text>
              </View>
            </View>
            <Switch
              value={biometricAuth}
              onValueChange={setBiometricAuth}
              color={theme.colors.primary}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Data Management */}
      <Card style={styles.card}>
        <Card.Title
          title="Data Management"
          left={ClearCacheTabIcon}
          titleStyle={styles.cardTitle}
        />
        <Card.Content>
          <Button
            mode="outlined"
            onPress={handleClearCache}
            style={styles.managementButton}
            icon={ClearCacheTabIcon}
            textColor={theme.colors.error}
          >
            Clear Cache
          </Button>
          <Text style={styles.buttonDescription}>
            Clear cached patient data and images to free up storage space
          </Text>

          <Button
            mode="outlined"
            onPress={handleResetSettings}
            style={[styles.managementButton, styles.resetButton]}
            icon={ResetToDefaultsIconComponent}
            textColor={theme.colors.error}
          >
            Reset to Defaults
          </Button>
          <Text style={styles.buttonDescription}>
            Reset all settings to their default values
          </Text>
        </Card.Content>
      </Card>

      <AlertBottomSheet
        ref={alertBottomSheetRef}
        title={alertConfig?.title || ''}
        message={alertConfig?.message || ''}
        buttons={alertConfig?.buttons}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    backgroundColor: theme.colors.primary,
  },
  contentHeader: {
    padding: 20,
    backgroundColor: theme.colors.surface,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  card: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  accountInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  accountLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  accountValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  managementButton: {
    marginTop: 16,
    borderColor: theme.colors.error,
  },
  resetButton: {
    marginTop: 8,
  },
  buttonDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
    marginLeft: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default DoctorSettingsScreen;