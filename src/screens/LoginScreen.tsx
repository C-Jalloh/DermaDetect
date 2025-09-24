import React, { useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Card, Title } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { theme } from '../utils/theme';
import AlertBottomSheet, { AlertBottomSheetRef } from '../components/AlertBottomSheet';

// Mock users for demonstration
const mockUsers = [
  { id: '1', username: 'chw1', password: 'password', role: 'CHW' as const },
  { id: '2', username: 'doctor1', password: 'password', role: 'Doctor' as const },
];

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const alertBottomSheetRef = useRef<AlertBottomSheetRef>(null);
  const [alertConfig, setAlertConfig] = useState<{title: string, message: string} | null>(null);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setAlertConfig({ title: 'Error', message: 'Please enter both username and password' });
      alertBottomSheetRef.current?.present();
      return;
    }

    dispatch(loginStart());

    // Simulate API call
    setTimeout(() => {
      const user = mockUsers.find(u => u.username === username && u.password === password);
      console.log('Login attempt:', { username, password, foundUser: !!user, user });
      if (user) {
        const userWithToken = {
          ...user,
          token: `token_${user.id}_${Date.now()}`, // Mock token
        };
        console.log('Dispatching loginSuccess with:', userWithToken);
        dispatch(loginSuccess(userWithToken));
        setAlertConfig({ title: 'Success', message: `Logged in as ${userWithToken.role}` });
        alertBottomSheetRef.current?.present();
      } else {
        console.log('Dispatching loginFailure');
        dispatch(loginFailure('Invalid username or password'));
        setAlertConfig({ title: 'Failed', message: 'Invalid credentials' });
        alertBottomSheetRef.current?.present();
      }
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.titleContainer}>
            <FontAwesome5 name="hospital" size={28} color={theme.colors.textPrimary} solid />
            <Title style={styles.title}>DermaDetect</Title>
          </View>
          <Text style={styles.subtitle}>Healthcare Professional Portal</Text>

          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
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