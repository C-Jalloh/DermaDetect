import React, { useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Card, Title } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { theme } from '../utils/theme';
import AlertBottomSheet, { AlertBottomSheetRef } from '../components/AlertBottomSheet';
import { HospitalIcon } from '../assets/icons';
import { apiService } from '../services/api';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const alertBottomSheetRef = useRef<AlertBottomSheetRef>(null);
  const [alertConfig, setAlertConfig] = useState<{title: string, message: string} | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setAlertConfig({ title: 'Error', message: 'Please enter both email and password' });
      alertBottomSheetRef.current?.present();
      return;
    }

    dispatch(loginStart());

    try {
      // Determine role from email
      const role = email.includes('chw') ? 'chw' : 'doctor';
      const response = await apiService.login(email, password, role);
      
      // Fetch user profile with stats
      const userProfile = await apiService.getCurrentUser();
      
      const userWithToken = {
        id: response.user.id,
        username: response.user.name, // Map name to username for auth slice
        role: (response.user.role === 'chw' ? 'CHW' : 'Doctor') as 'CHW' | 'Doctor', // Convert to uppercase for auth slice
        token: response.access_token,
        stats: userProfile.stats, // Include stats from profile
      };
      
      dispatch(loginSuccess(userWithToken));
      setAlertConfig({ title: 'Success', message: `Logged in as ${userWithToken.role}` });
      alertBottomSheetRef.current?.present();
    } catch (err) {
      console.error('Login error:', err);
      dispatch(loginFailure('Invalid email or password'));
      setAlertConfig({ title: 'Failed', message: 'Invalid credentials' });
      alertBottomSheetRef.current?.present();
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.titleContainer}>
            <HospitalIcon width={28} height={28} fill={theme.colors.textPrimary} />
            <Title style={styles.title}>DermaDetect</Title>
          </View>
          <Text style={styles.subtitle}>Healthcare Professional Portal</Text>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            mode="outlined"
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
        </Card.Content>
      </Card>
      <AlertBottomSheet
        ref={alertBottomSheetRef}
        title={alertConfig?.title || ''}
        message={alertConfig?.message || ''}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  card: {
    elevation: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 0,
    marginLeft: 12,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: theme.colors.textSecondary,
  },
  input: {
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  errorText: {
    color: theme.colors.riskHigh,
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
});

export default LoginScreen;