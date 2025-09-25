import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button, Searchbar } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { theme } from '../../utils/theme';
import BaseBottomSheet from '../../components/BaseBottomSheet';
import PatientProfileBottomSheet from '../bottomSheets/PatientProfileBottomSheet';
import { PersonIcon, SearchIcon } from '../../assets/icons';
import { apiService } from '../../services/api';

const SearchBarIcon = ({ color, size }: { color: string; size: number }) => (
  <SearchIcon width={size} height={size} fill={color} />
);

// Mock patients data - will be replaced with API data
const mockPatients = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    dob: '1985-03-15',
    gender: 'Male',
    contactInfo: '+1234567890',
    lastVisit: '2024-09-20',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    dob: '1990-07-22',
    gender: 'Female',
    contactInfo: '+1234567891',
    lastVisit: '2024-09-18',
  },
];

const CHWHomeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const patientProfileSheetRef = useRef<BottomSheetModal>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientData = await apiService.getPatients();
        // Sort patients by last_modified_at in descending order (newest first)
        const sortedPatients = patientData.sort((a: any, b: any) => {
          const dateA = new Date(a.last_modified_at);
          const dateB = new Date(b.last_modified_at);
          return dateB.getTime() - dateA.getTime(); // Descending order
        });
        setPatients(sortedPatients);
      } catch (error) {
        console.error('Error fetching patients:', error);
        // Fallback to mock data if API fails
        setPatients(mockPatients);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Refresh data when screen comes into focus (e.g., after registering a patient)
  useFocusEffect(
    React.useCallback(() => {
      const fetchPatients = async () => {
        try {
          const patientData = await apiService.getPatients();
          // Sort patients by last_modified_at in descending order (newest first)
          const sortedPatients = patientData.sort((a: any, b: any) => {
            const dateA = new Date(a.last_modified_at);
            const dateB = new Date(b.last_modified_at);
            return dateB.getTime() - dateA.getTime(); // Descending order
          });
          setPatients(sortedPatients);
        } catch (error) {
          console.error('Error fetching patients:', error);
          // Fallback to mock data if API fails
          setPatients(mockPatients);
        }
      };

      fetchPatients();
    }, [])
  );

  const filteredPatients = patients.filter(patient => {
    const demographics = typeof patient.demographics === 'string' 
      ? JSON.parse(patient.demographics) 
      : patient.demographics || {};
    const fullName = demographics.name || '';
    return fullName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handlePatientPress = (patientId: string) => {
    setSelectedPatientId(patientId);
    patientProfileSheetRef.current?.present();
  };

  const renderPatientItem = ({ item }: { item: any }) => {
    // Parse demographics data
    let demographics: any = {};
    try {
      demographics = typeof item.demographics === 'string' 
        ? JSON.parse(item.demographics) 
        : item.demographics || {};
    } catch (error) {
      console.error('Error parsing demographics:', error, item.demographics);
    }

    const fullName = demographics.name || 'Unknown Patient';
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || 'Unknown';
    const lastName = nameParts.slice(1).join(' ') || 'Patient';
    const age = demographics.age || 'Unknown';
    const gender = demographics.gender || 'Unknown';

    return (
      <Card style={styles.patientCard}>
        <Card.Content>
          <View style={styles.patientHeader}>
            <PersonIcon width={24} height={24} fill={theme.colors.primary} />
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>{firstName} {lastName}</Text>
              <Text style={styles.patientDetails}>
                {gender} • {age} years old
              </Text>
              <Text style={styles.lastVisit}>Last visit: Not recorded</Text>
            </View>
          </View>
          <View style={styles.patientActions}>
            <Button
              mode="outlined"
              onPress={() => handlePatientPress(item.id)}
              style={styles.actionButton}
            >
              View Profile
            </Button>
            <Button
              mode="contained"
              onPress={() => handlePatientPress(item.id)}
              style={styles.actionButton}
            >
              Start Triage
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community Health Worker</Text>
        <Text style={styles.subtitle}>Patient Management</Text>
      </View>

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
        extraData={patients}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading patients...</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No patients found</Text>
            </View>
          )
        }
      />

      <BaseBottomSheet
        ref={patientProfileSheetRef}
        title="Patient Profile"
        snapPoints={['70%', '90%']}
      >
        <PatientProfileBottomSheet
          patientId={selectedPatientId}
          onDismiss={() => patientProfileSheetRef.current?.dismiss()}
          navigation={navigation}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
});

export default CHWHomeScreen;