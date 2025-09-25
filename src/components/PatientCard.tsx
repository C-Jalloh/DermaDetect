import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, Chip } from 'react-native-paper';
import { PersonIcon } from '../assets/icons';
import { theme } from '../utils/theme';

interface Patient {
  demographics: any; // Can be string or object
}

interface CaseItem {
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
  patient?: Patient;
  chw?: {
    name: string;
  };
}

interface PatientCardProps {
  caseItem: CaseItem;
  onViewDetails: (caseId: string) => void;
  onCreateDiagnosis: (caseId: string) => void;
  showActions?: boolean;
  buttonMode?: 'both' | 'view-only' | 'none';
}

const PatientCard: React.FC<PatientCardProps> = ({
  caseItem,
  onViewDetails,
  onCreateDiagnosis,
  buttonMode = 'both',
}) => {
  // Extract patient name safely
  let patientName = 'Unknown Patient';
  try {
    let demographics = caseItem.patient?.demographics;

    // Handle both string and object formats
    if (typeof demographics === 'string') {
      demographics = JSON.parse(demographics);
    }

    patientName = (demographics as any)?.name || 'Unknown Patient';
  } catch (e) {
    console.warn('Failed to parse patient demographics in PatientCard:', e);
  }

  // Extract triage date
  let triageDate = 'Unknown Date';
  try {
    const createdDate = new Date(caseItem.created_at);
    triageDate = createdDate.toLocaleDateString();
  } catch (e) {
    console.warn('Failed to parse created date:', e);
  }

  // Parse AI analysis
  let aiAnalysis = null;
  try {
    aiAnalysis = caseItem.ai_analysis ? JSON.parse(caseItem.ai_analysis) : null;
  } catch (e) {
    console.warn('Failed to parse AI analysis:', e);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REQUIRES_MEDGEMMA': return theme.colors.warning;
      case 'PENDING_DIAGNOSIS': return theme.colors.primary;
      case 'TRIAGED': return theme.colors.textSecondary;
      default: return theme.colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'REQUIRES_MEDGEMMA': return 'AI Analysis Required';
      case 'PENDING_DIAGNOSIS': return 'Diagnosis Pending';
      case 'TRIAGED': return 'Triaged';
      default: return status;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return theme.colors.riskHigh;
      case 'medium': return theme.colors.riskMedium;
      case 'low': return theme.colors.riskLow;
      default: return theme.colors.textSecondary;
    }
  };

  return (
    <Card style={styles.patientCard}>
      <Card.Content>
        <View style={styles.patientHeader}>
          <PersonIcon width={24} height={24} fill={theme.colors.primary} />
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{patientName}</Text>
            <Text style={styles.triageDate}>Triage: {triageDate}</Text>
            <Text style={[styles.statusText, { color: getStatusColor(caseItem.status) }]}>
              {getStatusText(caseItem.status)}
            </Text>
          </View>
          <View style={styles.chipsContainer}>
            <Chip
              style={[styles.riskChip, { backgroundColor: getRiskColor(caseItem.risk_level) }]}
              textStyle={{ color: theme.colors.textPrimary }}
            >
              {caseItem.risk_level.toUpperCase()} RISK
            </Chip>
            {caseItem.status === 'REQUIRES_MEDGEMMA' && (
              <Chip
                style={[styles.statusChip, { backgroundColor: theme.colors.warning }]}
                textStyle={{ color: theme.colors.textPrimary }}
              >
                AI ANALYZING
              </Chip>
            )}
          </View>
        </View>

        {aiAnalysis && aiAnalysis.analysis ? (
          <>
            <Text style={styles.aiDiagnosis}>{aiAnalysis.analysis.diagnosis || 'Analysis in progress'}</Text>
            {aiAnalysis.analysis.confidence && (
              <Text style={styles.confidence}>
                AI Confidence: {(aiAnalysis.analysis.confidence * 100).toFixed(1)}%
              </Text>
            )}
          </>
        ) : caseItem.status === 'REQUIRES_MEDGEMMA' ? (
          <Text style={styles.aiDiagnosis}>MedGemma AI analysis in progress...</Text>
        ) : (
          <Text style={styles.aiDiagnosis}>Awaiting AI analysis</Text>
        )}

        {buttonMode !== 'none' && (
          <View style={styles.patientActions}>
            {buttonMode === 'both' || buttonMode === 'view-only' ? (
              <Button
                mode="outlined"
                onPress={() => onViewDetails(caseItem.id)}
                style={buttonMode === 'view-only' ? styles.singleActionButton : styles.actionButton}
                disabled={caseItem.status === 'REQUIRES_MEDGEMMA'}
              >
                View Details
              </Button>
            ) : null}
            {buttonMode === 'both' ? (
              <Button
                mode="contained"
                onPress={() => onCreateDiagnosis(caseItem.id)}
                style={styles.actionButton}
                disabled={caseItem.status === 'REQUIRES_MEDGEMMA'}
              >
                {caseItem.status === 'REQUIRES_MEDGEMMA' ? 'Analyzing...' : 'Create Diagnosis'}
              </Button>
            ) : null}
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
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
  singleActionButton: {
    flex: 1,
  },
});

export default PatientCard;