import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, Avatar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { theme } from '../../utils/theme';
import AlertBottomSheet, { AlertBottomSheetRef } from '../../components/AlertBottomSheet';
import {
  AnalyzeIcon,
  TriageIcon,
  WeekIcon,
  SettingsIcon,
  HelpIcon,
  LogoutIcon
} from '../../assets/icons';

// Icon wrapper components to avoid defining during render
const DiagnosesIcon = () => <AnalyzeIcon width={24} height={24} fill={theme.colors.primary} />;
const PendingIcon = () => <TriageIcon width={24} height={24} fill={theme.colors.primary} />;
const WeekIconComponent = () => <WeekIcon width={24} height={24} fill={theme.colors.primary} />;
const SettingsIconComponent = () => <SettingsIcon width={20} height={20} fill={theme.colors.primary} />;
const HelpIconComponent = () => <HelpIcon width={20} height={20} fill={theme.colors.primary} />;
const LogoutIconComponent = () => <LogoutIcon width={20} height={20} fill={theme.colors.onError} />;

const DoctorProfileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);
  const alertBottomSheetRef = useRef<AlertBottomSheetRef>(null);
  const [alertConfig, setAlertConfig] = React.useState<{title: string, message: string, buttons?: any[]} | null>(null);

  const handleLogout = () => {
    setAlertConfig({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            // Navigation will automatically go to LoginScreen due to auth state change
          },
        },
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Doctor Dashboard</Text>
      </View>

      <Card style={styles.profileCard}>
        <Card.Content style={styles.cardContent}>
          <Avatar.Text
            size={80}
            label={`${user.username.charAt(0).toUpperCase()}`}
            style={styles.avatar}
          />
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.role}>Medical Doctor</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <DiagnosesIcon />
              <Text style={styles.statNumber}>{user?.stats?.diagnoses || 0}</Text>
              <Text style={styles.statLabel}>Diagnoses</Text>
            </View>
            <View style={styles.statItem}>
              <PendingIcon />
              <Text style={styles.statNumber}>{user?.stats?.pending_cases || 0}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statItem}>
              <WeekIconComponent />
              <Text style={styles.statNumber}>{user?.stats?.this_week || 0}</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.actionsCard}>
        <Card.Content>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('DoctorSettings' as never)}
            style={styles.actionButton}
            icon={SettingsIconComponent}
          >
            Settings
          </Button>
          <Button
            mode="outlined"
            onPress={() => {/* TODO: Navigate to help */}}
            style={styles.actionButton}
            icon={HelpIconComponent}
          >
            Help & Support
          </Button>
        </Card.Content>
      </Card>

      <View style={styles.logoutContainer}>
        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          icon={LogoutIconComponent}
          buttonColor={theme.colors.error}
        >
          Log Out
        </Button>
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
  profileCard: {
    backgroundColor: theme.colors.cardBackground,
    marginBottom: 16,
    elevation: 4,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    marginBottom: 16,
    backgroundColor: theme.colors.primary,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  actionsCard: {
    backgroundColor: theme.colors.cardBackground,
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 8,
  },
  logoutContainer: {
    marginTop: 'auto',
    paddingBottom: 16,
  },
  logoutButton: {
    width: '100%',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: theme.colors.error,
    marginTop: 20,
  },
});

export default DoctorProfileScreen;