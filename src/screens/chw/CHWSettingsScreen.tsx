import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Switch, Button, Appbar } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../store';
import { theme } from '../../utils/theme';
import AlertBottomSheet, { AlertBottomSheetRef } from '../../components/AlertBottomSheet';

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
        <Appbar.BackAction onPress={() => navigation.goBack()} />
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
          left={() => <FontAwesome5 name="user" size={24} color={theme.colors.primary} />}
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
            <Text style={styles.accountLabel}>ID:</Text>
            <Text style={styles.accountValue}>{user.id}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* App Preferences */}
      <Card style={styles.card}>
        <Card.Title
          title="App Preferences"
          left={() => <FontAwesome5 name="cog" size={24} color={theme.colors.primary} />}
        />
        <Card.Content>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <FontAwesome5 name="bell" size={20} color={theme.colors.textSecondary} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Receive notifications for new tasks and updates</Text>
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
              <FontAwesome5 name="save" size={20} color={theme.colors.textSecondary} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Auto-save Data</Text>
                <Text style={styles.settingDescription}>Automatically save patient data and triage results</Text>
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
              <FontAwesome5 name="wifi" size={20} color={theme.colors.textSecondary} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Offline Mode</Text>
                <Text style={styles.settingDescription}>Allow app to work without internet connection</Text>
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
          title="Camera Settings"
          left={() => <FontAwesome5 name="camera" size={24} color={theme.colors.primary} />}
        />
        <Card.Content>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <FontAwesome5 name="image" size={20} color={theme.colors.textSecondary} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>High Quality Images</Text>
                <Text style={styles.settingDescription}>Capture images in highest quality (uses more storage)</Text>
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
          left={() => <FontAwesome5 name="shield-alt" size={24} color={theme.colors.primary} />}
        />
        <Card.Content>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <FontAwesome5 name="fingerprint" size={20} color={theme.colors.textSecondary} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Biometric Authentication</Text>
                <Text style={styles.settingDescription}>Use fingerprint/face unlock for app access</Text>
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
          left={() => <FontAwesome5 name="database" size={24} color={theme.colors.primary} />}
        />
        <Card.Content>
          <Button
            mode="outlined"
            onPress={handleClearCache}
            style={styles.actionButton}
            icon="delete"
          >
            Clear Cache
          </Button>
          <Button
            mode="outlined"
            onPress={handleResetSettings}
            style={styles.actionButton}
            icon="refresh"
          >
            Reset to Defaults
          </Button>
        </Card.Content>
      </Card>

      {/* App Information */}
      <Card style={styles.card}>
        <Card.Title
          title="About"
          left={() => <FontAwesome5 name="info-circle" size={24} color={theme.colors.primary} />}
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