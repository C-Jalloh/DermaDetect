import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, Avatar } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { theme } from '../../utils/theme';
import AlertBottomSheet, { AlertBottomSheetRef } from '../../components/AlertBottomSheet';

const CHWProfileScreen: React.FC = () => {
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
        <Text style={styles.subtitle}>Community Health Worker</Text>
      </View>

      <Card style={styles.profileCard}>
        <Card.Content style={styles.cardContent}>
          <Avatar.Text
            size={80}
            label={`${user.username.charAt(0).toUpperCase()}`}
            style={styles.avatar}
          />
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.role}>Community Health Worker</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <FontAwesome5 name="users" size={24} color={theme.colors.primary} />
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Patients</Text>
            </View>
            <View style={styles.statItem}>
              <FontAwesome5 name="clipboard-list" size={24} color={theme.colors.primary} />
              <Text style={styles.statNumber}>18</Text>
              <Text style={styles.statLabel}>Triages</Text>
            </View>
            <View style={styles.statItem}>
              <FontAwesome5 name="calendar-check" size={24} color={theme.colors.primary} />
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.actionsCard}>
        <Card.Content>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('CHWSettings' as never)}
            style={styles.actionButton}
            icon="cog"
          >
            Settings
          </Button>
          <Button
            mode="outlined"
            onPress={() => {/* TODO: Navigate to help */}}
            style={styles.actionButton}
            icon="help-circle"
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
          icon="logout"
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

export default CHWProfileScreen;