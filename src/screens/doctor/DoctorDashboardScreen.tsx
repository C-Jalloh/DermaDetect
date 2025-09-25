import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Button, Searchbar } from 'react-native-paper';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { theme } from '../../utils/theme';
import BaseBottomSheet from '../../components/BaseBottomSheet';
import PatientCard from '../../components/PatientCard';
import PatientProfileDoctorBottomSheet from '../bottomSheets/PatientProfileDoctorBottomSheet';
import { SuccessIcon, SearchIcon, FilterIcon } from '../../assets/icons';
import { apiService } from '../../services/api';

// Icon wrapper components to avoid defining during render
const SearchBarIcon = () => (
  <SearchIcon width={20} height={20} fill={theme.colors.textSecondary} />
);

const FilterButtonIcon = () => (
  <FilterIcon width={20} height={20} fill={theme.colors.primary} />
);

const DoctorDashboardScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string | null>(null);
  const [pendingCases, setPendingCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const patientProfileSheetRef = useRef<BottomSheetModal>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedCaseData, setSelectedCaseData] = useState<any>(null);

  useEffect(() => {
    const fetchPendingCases = async () => {
      try {
        const cases = await apiService.getPendingCases();
        setPendingCases(cases);
      } catch (error) {
        console.error('Error fetching pending cases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingCases();
  }, []);

  const filteredPatients = pendingCases.filter(caseItem => {
    let patientName = 'Unknown Patient';
    try {
      let demographics = caseItem.patient?.demographics;
      
      // Handle both string and object formats
      if (typeof demographics === 'string') {
        demographics = JSON.parse(demographics);
      }
      
      patientName = (demographics as any)?.name || 'Unknown Patient';
    } catch (e) {
      console.warn('Failed to parse patient demographics for filtering:', e);
    }
    
    const matchesSearch = patientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = selectedRiskFilter ? caseItem.risk_level === selectedRiskFilter : true;
    return matchesSearch && matchesRisk;
  });

  const handlePatientPress = (patientId: string) => {
    // Find the case data for this patient
    const caseItem = pendingCases.find(c => c.patient_id === patientId || c.id === patientId);
    if (caseItem) {
      setSelectedPatientId(caseItem.patient_id);
      setSelectedCaseData(caseItem);
      patientProfileSheetRef.current?.present();
    }
  };

  const handleFilterPress = (riskLevel: string | null) => {
    setSelectedRiskFilter(riskLevel);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSelectedRiskFilter(null);
    setShowFilters(false);
  };

  const renderPatientItem = ({ item }: { item: any }) => (
    <PatientCard
      caseItem={item}
      onViewDetails={(caseId) => handlePatientPress(caseId)}
      onCreateDiagnosis={(caseId) => handlePatientPress(caseId)}
      buttonMode="view-only"
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading pending cases...</Text>
      </View>
    );
  }

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
          icon={SearchBarIcon}
        />
        <Button
          mode="outlined"
          onPress={() => setShowFilters(!showFilters)}
          style={styles.filterButton}
          icon={FilterButtonIcon}
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
            <SuccessIcon width={48} height={48} fill={theme.colors.textSecondary} />
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
          caseData={selectedCaseData}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
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