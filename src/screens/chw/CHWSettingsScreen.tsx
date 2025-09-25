import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Switch, Button, Appbar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../store';
import { theme } from '../../utils/theme';
import AlertBottomSheet, { AlertBottomSheetRef } from '../../components/AlertBottomSheet';
import { UserIcon, ShieldIcon, BackIcon, AboutIcon, DataStorageIcon, BellIcon, AutoSaveIcon, OfflineModeIcon, HighQualityImagesIcon, BiometricOnIcon, BiometricOffIcon, ClearCacheIcon, ResetToDefaultsIcon } from '../../assets/icons';

// Icon wrapper components to avoid defining during render
const UserTabIcon = () => <UserIcon width={24} height={24} fill={theme.colors.primary} />;
const BellTabIcon = () => <BellIcon size={24} color={theme.colors.primary} />;
const ShieldTabIcon = () => <ShieldIcon size={24} color={theme.colors.primary} />;
const DatabaseTabIcon = () => <DataStorageIcon width={24} height={24} fill={theme.colors.primary} />;
const InfoTabIcon = () => <AboutIcon width={24} height={24} fill={theme.colors.primary} />;
const ClearCacheIconComponent = () => <ClearCacheIcon size={20} color={theme.colors.error} />;
const ResetToDefaultsIconComponent = () => <ResetToDefaultsIcon size={20} color={theme.colors.error} />;
const BackActionIcon = ({ color, size }: { color: string; size: number }) => <BackIcon width={size} height={size} fill={color} />;

const CHWSettingsScreen: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigation = useNavigation();
  const alertBottomSheetRef = React.useRef<AlertBottomSheetRef>(null);
  const [alertConfig, setAlertConfig] = useState<{title: string, message: string, buttons?: any[]} | null>(null);

  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [offlineModeEnabled, setOfflineModeEnabled] = useState(false);
  const [highQualityImages, setHighQualityImages] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);

  const handleClearCache = () => {
    setAlertConfig({
      title: 'Clear Cache',
      message: 'This will clear all cached data. Continue?',
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
            setAutoSaveEnabled(true);
            setOfflineModeEnabled(false);
            setHighQualityImages(true);
            setBiometricAuth(false);
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
        <Text style={styles.subtitle}>Configure your preferences</Text>
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
        </Card.Content>
      </Card>

      {/* App Preferences */}
      <Card style={styles.card}>
                <Card.Title
          title="Notifications"
          left={BellTabIcon}
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
                <AutoSaveIcon size={20} color={theme.colors.textSecondary} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Auto-save Data</Text>
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

      {/* Camera Settings */}
      <Card style={styles.card}>
                <Card.Title
          title="Data & Storage"
          left={DatabaseTabIcon}
          titleStyle={styles.cardTitle}
        />
        <Card.Content>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <HighQualityImagesIcon size={20} color={theme.colors.textSecondary} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>High Quality Images</Text>
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
          left={ShieldTabIcon}
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
          left={DatabaseTabIcon}
          titleStyle={styles.cardTitle}
        />
        <Card.Content>
          <Button
            mode="outlined"
            onPress={handleClearCache}
            style={styles.actionButton}
            icon={ClearCacheIconComponent}
          >
            Clear Cache
          </Button>
          <Button
            mode="outlined"
            onPress={handleResetSettings}
            style={styles.actionButton}
            icon={ResetToDefaultsIconComponent}
          >
            Reset to Defaults
          </Button>
        </Card.Content>
      </Card>

      {/* App Information */}
      <Card style={styles.card}>
        <Card.Title
          title="About"
          left={InfoTabIcon}
          titleStyle={styles.cardTitle}
        />
        <Card.Content>
          <View style={styles.aboutInfo}>
            <Text style={styles.aboutLabel}>Version:</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          <View style={styles.aboutInfo}>
            <Text style={styles.aboutLabel}>Build:</Text>
            <Text style={styles.aboutValue}>2025.09.24</Text>
          </View>
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
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    backgroundColor: theme.colors.surface,
  },
  contentHeader: {
    marginBottom: 24,
    alignItems: 'center',
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
    marginBottom: 16,
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
    marginBottom: 8,
  },
  accountLabel: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  accountValue: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  actionButton: {
    marginBottom: 12,
  },
  aboutInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aboutLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  aboutValue: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
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
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default CHWSettingsScreen;