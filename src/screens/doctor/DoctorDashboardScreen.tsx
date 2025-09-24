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
];

const DoctorDashboardScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const patientProfileSheetRef = useRef<BottomSheetModal>(null);
  const [selectedPatientId, setSelectedPatientId] = React.useState<string | null>(null);

  const filteredPatients = patientsRequiringDiagnosis.filter(patient =>
    patient.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePatientPress = (patientId: string) => {
    setSelectedPatientId(patientId);
    patientProfileSheetRef.current?.present();
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