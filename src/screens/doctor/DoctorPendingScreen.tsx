import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Button, Searchbar, ActivityIndicator } from 'react-native-paper';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { theme } from '../../utils/theme';
import BaseBottomSheet from '../../components/BaseBottomSheet';
import PatientCard from '../../components/PatientCard';
import PatientProfileDoctorBottomSheet from '../bottomSheets/PatientProfileDoctorBottomSheet';
import { SuccessIcon, SearchIcon } from '../../assets/icons';
import { apiService } from '../../services/api';

// Icon wrapper component to avoid defining during render
const SearchBarIcon = () => (
  <SearchIcon width={20} height={20} fill={theme.colors.textSecondary} />
);

interface PendingCase {
  id: string;
  patient_id: string;
  chw_id: string;
  triage_data: string;
  ai_analysis: string | null;
  status: string;
  risk_level: string;
  image_urls: string;
  created_at: string;
  updated_at: string;
  last_modified_at: string;
  patient?: {
    demographics: string;
  };
  chw?: {
    name: string;
  };
}

const DoctorPendingScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingCases, setPendingCases] = useState<PendingCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const patientProfileSheetRef = useRef<BottomSheetModal>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedCaseData, setSelectedCaseData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

    const loadPendingCases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const cases = await apiService.getPendingCases();
      setPendingCases(cases);
    } catch (fetchError) {
      console.error('Error fetching pending cases:', fetchError);
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to load pending cases');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPendingCases();
  }, [loadPendingCases]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPendingCases();
    setRefreshing(false);
  }, [loadPendingCases]);

  const filteredCases = pendingCases.filter(caseItem => {
    if (!searchQuery) return true;
    try {
      const demographics = JSON.parse(caseItem.patient?.demographics || '{}');
      const patientName = demographics.name || 'Unknown Patient';
      return patientName.toLowerCase().includes(searchQuery.toLowerCase());
    } catch {
      return false;
    }
  });

  const handlePatientPress = (caseId: string) => {
    // Find the case by ID and get the patient ID
    const caseItem = pendingCases.find(c => c.id === caseId);
    if (caseItem) {
      setSelectedPatientId(caseItem.patient_id);
      setSelectedCaseData(caseItem); // Store the full case data
      patientProfileSheetRef.current?.present();
    }
  };

  const renderPatientItem = ({ item }: { item: PendingCase }) => (
    <PatientCard
      caseItem={item}
      onViewDetails={handlePatientPress}
      onCreateDiagnosis={handlePatientPress}
      buttonMode="both"
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pending Diagnoses</Text>
        <Text style={styles.subtitle}>Patients awaiting your review</Text>
      </View>

      <Searchbar
        placeholder="Search pending patients..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        icon={SearchBarIcon}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading pending cases...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button mode="outlined" onPress={loadPendingCases}>
            Retry
          </Button>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={filteredCases}
          renderItem={renderPatientItem}
          keyExtractor={(item) => item.id}
          style={styles.patientList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <SuccessIcon width={48} height={48} fill={theme.colors.textSecondary} />
              <Text style={styles.emptyText}>No pending diagnoses</Text>
            </View>
          }
        />
      )}

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
  triageDate: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  chipsContainer: {
    alignItems: 'flex-end',
  },
  riskChip: {
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  statusChip: {
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default DoctorPendingScreen;