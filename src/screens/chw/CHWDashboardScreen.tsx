import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { theme } from '../../utils/theme';
import { PersonIcon, SearchIcon } from '../../assets/icons';
import { apiService } from '../../services/api';

const SearchBarIcon = ({ color, size }: { color: string; size: number }) => (
  <SearchIcon width={size} height={size} fill={color} />
);

type CHWDashboardNavigationProp = StackNavigationProp<RootStackParamList>;

interface Patient {
  id: string;
  demographics: any; // Can be string or object
  last_modified_at: string;
}

const CHWDashboardScreen: React.FC = () => {
  const navigation = useNavigation<CHWDashboardNavigationProp>();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await apiService.getPatients();
        setPatients(data);
      } catch (error) {
        console.error('Failed to fetch patients:', error);
        // For now, keep empty or show error
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(patient => {
    const demographics = typeof patient.demographics === 'string' 
      ? JSON.parse(patient.demographics) 
      : patient.demographics;
    const name = demographics.name || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const renderPatientItem = ({ item }: { item: Patient }) => {
    const demographics = typeof item.demographics === 'string' 
      ? JSON.parse(item.demographics) 
      : item.demographics;
    
    return (
      <Card style={styles.patientCard}>
        <Card.Content>
          <View style={styles.patientHeader}>
            <PersonIcon width={24} height={24} fill={theme.colors.primary} />
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>
                {demographics.name || 'Unknown Patient'}
              </Text>
              <Text style={styles.patientDetails}>
                Patient ID: {item.id.slice(0, 8)}...
              </Text>
              <Text style={styles.lastVisit}>Last visit: {new Date(item.last_modified_at).toLocaleDateString()}</Text>
            </View>
          </View>
          <View style={styles.patientActions}>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('PatientProfileCHW', { patientId: item.id })}
              style={styles.actionButton}
            >
              View Profile
            </Button>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('PatientProfileCHW', { patientId: item.id })}
              style={styles.actionButton}
            >
              Start Triage
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading patients...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community Health Worker</Text>
        <Text style={styles.subtitle}>Patient Management</Text>
      </View>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate('PatientRegistration')}
      >
        <PersonIcon width={24} height={24} fill={theme.colors.background} />
        <Text style={styles.registerButtonText}>Register New Patient</Text>
      </TouchableOpacity>

      <Searchbar
        placeholder="Search patients..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        icon={SearchBarIcon}
      />

      <FlatList
        data={filteredPatients}
        renderItem={renderPatientItem}
        keyExtractor={(item) => item.id}
        style={styles.patientList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No patients found</Text>
        }
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
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  registerButtonText: {
    color: theme.colors.background,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  searchBar: {
    marginBottom: 16,
    backgroundColor: theme.colors.cardBackground,
  },
  patientList: {
    flex: 1,
  },
  patientCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  patientInfo: {
    marginLeft: 12,
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  patientDetails: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  lastVisit: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  patientActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 48,
  },
});

export default CHWDashboardScreen;