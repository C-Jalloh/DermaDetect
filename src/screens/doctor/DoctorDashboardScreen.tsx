import React, { useRef } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button, Searchbar, Chip } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { theme } from '../../utils/theme';
import BaseBottomSheet from '../../components/BaseBottomSheet';
import PatientProfileDoctorBottomSheet from '../bottomSheets/PatientProfileDoctorBottomSheet';

// Mock patients requiring diagnosis
const patientsRequiringDiagnosis = [
  {
    id: '1',
    patientName: 'John Doe',
    triageDate: '2024-09-20',
    riskLevel: 'high',
    imageUri: 'mock_uri',
    aiResult: { confidence: 0.92, diagnosis: 'Potential malignant lesion' },
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    triageDate: '2024-09-19',
    riskLevel: 'medium',
    imageUri: 'mock_uri',
    aiResult: { confidence: 0.78, diagnosis: 'Suspicious lesion requiring review' },
  },
  {
    id: '3',
    patientName: 'Bob Johnson',
    triageDate: '2024-09-18',
    riskLevel: 'low',
    imageUri: 'mock_uri',
    aiResult: { confidence: 0.45, diagnosis: 'Benign lesion, routine follow-up recommended' },
  },
  {
    id: '4',
    patientName: 'Alice Brown',
    triageDate: '2024-09-17',
    riskLevel: 'high',
    imageUri: 'mock_uri',
    aiResult: { confidence: 0.88, diagnosis: 'High suspicion of malignancy' },
  },
  {
    id: '5',
    patientName: 'Charlie Wilson',
    triageDate: '2024-09-16',
    riskLevel: 'medium',
    imageUri: 'mock_uri',
    aiResult: { confidence: 0.65, diagnosis: 'Moderate risk lesion' },
  },
];

const DoctorDashboardScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showFilters, setShowFilters] = React.useState(false);
  const [selectedRiskFilter, setSelectedRiskFilter] = React.useState<string | null>(null);
  const patientProfileSheetRef = useRef<BottomSheetModal>(null);
  const [selectedPatientId, setSelectedPatientId] = React.useState<string | null>(null);

  const filteredPatients = patientsRequiringDiagnosis.filter(patient => {
    const matchesSearch = patient.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = selectedRiskFilter ? patient.riskLevel === selectedRiskFilter : true;
    return matchesSearch && matchesRisk;
  });

  const handlePatientPress = (patientId: string) => {
    setSelectedPatientId(patientId);
    patientProfileSheetRef.current?.present();
  };

  const handleFilterPress = (riskLevel: string | null) => {
    setSelectedRiskFilter(riskLevel);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSelectedRiskFilter(null);
    setShowFilters(false);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return theme.colors.riskHigh;
      case 'medium': return theme.colors.riskMedium;
      case 'low': return theme.colors.riskLow;
      default: return theme.colors.textSecondary;
    }
  };

  const renderPatientItem = ({ item }: { item: typeof patientsRequiringDiagnosis[0] }) => (
    <Card style={styles.patientCard}>
      <Card.Content>
        <View style={styles.patientHeader}>
          <FontAwesome5 name="user-md" size={24} color={theme.colors.primary} />
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{item.patientName}</Text>
            <Text style={styles.triageDate}>Triage: {item.triageDate}</Text>
          </View>
          <Chip
            style={[styles.riskChip, { backgroundColor: getRiskColor(item.riskLevel) }]}
            textStyle={{ color: theme.colors.textPrimary }}
          >
            {item.riskLevel.toUpperCase()} RISK
          </Chip>
        </View>

        <Text style={styles.aiDiagnosis}>{item.aiResult.diagnosis}</Text>
        <Text style={styles.confidence}>AI Confidence: {(item.aiResult.confidence * 100).toFixed(1)}%</Text>

        <View style={styles.patientActions}>
          <Button
            mode="outlined"
            onPress={() => handlePatientPress(item.id)}
            style={styles.actionButton}
          >
            View Details
          </Button>
          <Button
            mode="contained"
            onPress={() => handlePatientPress(item.id)}
            style={styles.actionButton}
          >
            Create Diagnosis
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Doctor Dashboard</Text>
        <Text style={styles.subtitle}>Patients Requiring Diagnosis</Text>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search patients..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        <Button
          mode="outlined"
          onPress={() => setShowFilters(!showFilters)}
          style={styles.filterButton}
          icon="filter-variant"
        >
          Filter
        </Button>
      </View>

      {showFilters && (
        <View style={styles.filterOptions}>
          <Text style={styles.filterTitle}>Filter by Risk Level:</Text>
          <View style={styles.filterButtons}>
            <Button
              mode={selectedRiskFilter === 'high' ? 'contained' : 'outlined'}
              onPress={() => handleFilterPress('high')}
              style={[styles.riskFilterButton, { borderColor: theme.colors.riskHigh }]}
              textColor={selectedRiskFilter === 'high' ? theme.colors.textPrimary : theme.colors.riskHigh}
              buttonColor={selectedRiskFilter === 'high' ? theme.colors.riskHigh : undefined}
            >
              High Risk
            </Button>
            <Button
              mode={selectedRiskFilter === 'medium' ? 'contained' : 'outlined'}
              onPress={() => handleFilterPress('medium')}
              style={[styles.riskFilterButton, { borderColor: theme.colors.riskMedium }]}
              textColor={selectedRiskFilter === 'medium' ? theme.colors.textPrimary : theme.colors.riskMedium}
              buttonColor={selectedRiskFilter === 'medium' ? theme.colors.riskMedium : undefined}
            >
              Medium Risk
            </Button>
            <Button
              mode={selectedRiskFilter === 'low' ? 'contained' : 'outlined'}
              onPress={() => handleFilterPress('low')}
              style={[styles.riskFilterButton, { borderColor: theme.colors.riskLow }]}
              textColor={selectedRiskFilter === 'low' ? theme.colors.textPrimary : theme.colors.riskLow}
              buttonColor={selectedRiskFilter === 'low' ? theme.colors.riskLow : undefined}
            >
              Low Risk
            </Button>
          </View>
          {selectedRiskFilter && (
            <Button
              mode="text"
              onPress={clearFilters}
              style={styles.clearFilterButton}
              textColor={theme.colors.primary}
            >
              Clear Filter
            </Button>
          )}
        </View>
      )}

      <FlatList
        data={filteredPatients}
        renderItem={renderPatientItem}
        keyExtractor={(item) => item.id}
        style={styles.patientList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome5 name="check-circle" size={48} color={theme.colors.textSecondary} />
            <Text style={styles.emptyText}>No patients requiring diagnosis</Text>
          </View>
        }
      />

      <BaseBottomSheet
        ref={patientProfileSheetRef}
        title="Patient Profile"
        snapPoints={['70%', '90%']}
      >
        <PatientProfileDoctorBottomSheet
          patientId={selectedPatientId}
          onDismiss={() => patientProfileSheetRef.current?.dismiss()}
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
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterButton: {
    marginLeft: 12,
    backgroundColor: theme.colors.cardBackground,
  },
  filterOptions: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  riskFilterButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  clearFilterButton: {
    alignSelf: 'center',
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
  triageDate: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  riskChip: {
    alignSelf: 'flex-start',
  },
  aiDiagnosis: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  confidence: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  patientActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default DoctorDashboardScreen;