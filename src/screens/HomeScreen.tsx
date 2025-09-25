import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Chip, IconButton } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { MotiView } from 'moti';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { RootState } from '../store';
import { logout, setOnlineStatus } from '../store/slices/appSlice';
import { mockCases } from '../services/dummyData';
import { theme } from '../utils/theme';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CHWMain'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useDispatch();
  const { cases } = useSelector((state: RootState) => (state as any).cases);

  useFocusEffect(
    React.useCallback(() => {
      // Simulate checking online status
      const checkOnlineStatus = () => {
        const online = Math.random() > 0.3; // 70% chance of being online
        dispatch(setOnlineStatus(online));
      };

      checkOnlineStatus();
      const interval = setInterval(checkOnlineStatus, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }, [dispatch])
  );

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return theme.colors.riskLow;
      case 'medium': return theme.colors.riskMedium;
      case 'high': return theme.colors.riskHigh;
      default: return theme.colors.textSecondary;
    }
  };

  const getRiskText = (risk: string) => {
    switch (risk) {
      case 'low': return 'Low Risk';
      case 'medium': return 'Medium Risk';
      case 'high': return 'High Risk';
      default: return risk;
    }
  };

  const renderCaseItem = ({ item, index }: { item: any; index: number }) => (
    <MotiView
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: 'timing', duration: 400, delay: 400 + index * 100 }}
    >
      <Card style={styles.caseCard}>
        <Card.Content style={styles.caseContent}>
          <View style={styles.caseLeft}>
            <View style={[styles.thumbnail, { backgroundColor: getRiskColor(item.triageResult) }]}>
              <Text style={styles.thumbnailText}>{item.patientId.slice(-2)}</Text>
            </View>
          </View>
          <View style={styles.caseRight}>
            <View style={styles.caseHeader}>
              <MaterialIcons name="local-hospital" size={20} color={theme.colors.textPrimary} />
              <Text style={styles.caseId}>Patient {item.patientId}</Text>
            </View>
            <View style={styles.caseDateRow}>
              <MaterialIcons name="event" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.caseDate}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <Chip
              mode="flat"
              style={[styles.riskChip, { backgroundColor: getRiskColor(item.triageResult) }]}
              textStyle={{ color: theme.colors.textPrimary }}
            >
              {getRiskText(item.triageResult)}
            </Chip>
          </View>
        </Card.Content>
      </Card>
    </MotiView>
  );

  // Use mock data if no cases in store
  const displayCases = cases.length > 0 ? cases : mockCases;

  return (
    <View style={styles.container}>
      {/* Header with Logo and Branding */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>DermaDetect</Text>
          <Text style={styles.poweredBy}>Powered by HexAI</Text>
        </View>
        <IconButton
          icon="logout"
          iconColor={theme.colors.textSecondary}
          size={24}
          onPress={() => {
            dispatch(logout());
            navigation.replace('Login');
          }}
        />
      </View>

      {/* Main Triage Button */}
      <View style={styles.mainContent}>
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', delay: 200 }}
        >
          <TouchableOpacity
            style={styles.triageButton}
            onPress={() => navigation.navigate('PatientConsent', {})}
          >
            <View style={styles.buttonIcon}>
              <MaterialIcons name="camera" size={36} color={theme.colors.background} />
            </View>
            <Text style={styles.buttonText}>START NEW TRIAGE</Text>
            <Text style={styles.buttonSubtext}>Tap to begin skin analysis</Text>
          </TouchableOpacity>
        </MotiView>
      </View>

      {/* Recent Cases */}
      <View style={styles.recentCases}>
        <Text style={styles.sectionTitle}>Recent Cases</Text>
        <FlatList
          data={displayCases.slice(0, 5)} // Show only last 5 cases
          renderItem={renderCaseItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.casesList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No cases yet. Start your first triage!</Text>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 20,
  },
  logoContainer: {
    flex: 1,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    letterSpacing: 1,
  },
  poweredBy: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  triageButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    paddingVertical: 40,
    paddingHorizontal: 32,
    width: '100%',
    maxWidth: 320,
  },
  buttonIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonIconText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.colors.background,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  buttonSubtext: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  recentCases: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  casesList: {
    paddingBottom: 20,
  },
  caseCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: 12,
    elevation: 0,
    shadowOpacity: 0,
  },
  caseContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  caseLeft: {
    marginRight: 16,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  caseRight: {
    flex: 1,
  },
  caseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  caseId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginLeft: 8,
  },
  caseDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  caseDate: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  riskChip: {
    alignSelf: 'flex-start',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 40,
  },
});

export default HomeScreen;
