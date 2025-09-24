import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Searchbar } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { theme } from '../../utils/theme';

type CHWDashboardNavigationProp = StackNavigationProp<RootStackParamList>;

// Mock patients data
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

const CHWDashboardScreen: React.FC = () => {
  const navigation = useNavigation<CHWDashboardNavigationProp>();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredPatients = mockPatients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPatientItem = ({ item }: { item: typeof mockPatients[0] }) => (
    <Card style={styles.patientCard}>
      <Card.Content>
        <View style={styles.patientHeader}>
          <FontAwesome5 name="user" size={24} color={theme.colors.primary} solid />
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{item.firstName} {item.lastName}</Text>
            <Text style={styles.patientDetails}>
              {item.gender} • {new Date().getFullYear() - new Date(item.dob).getFullYear()} years old
            </Text>
            <Text style={styles.lastVisit}>Last visit: {item.lastVisit}</Text>
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
        <FontAwesome5 name="user-plus" size={24} color={theme.colors.background} />
        <Text style={styles.registerButtonText}>Register New Patient</Text>
      </TouchableOpacity>

      <Searchbar
        placeholder="Search patients..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <FlatList
        data={filteredPatients}
        renderItem={renderPatientItem}
        keyExtractor={(item) => item.id}
        style={styles.patientList}
        showsVerticalScrollIndicator={false}
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
});

export default CHWDashboardScreen;