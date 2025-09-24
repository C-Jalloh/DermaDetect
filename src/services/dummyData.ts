import { PatientCase, User } from '../types';

// Mock user data
export const mockUsers: User[] = [
  {
    id: 'chw-001',
    name: 'Amina Hassan',
    role: 'chw',
    pin: '1234',
  },
];

// Mock patient cases for demonstration
export const mockCases: PatientCase[] = [
  {
    id: 'case-001',
    patientId: 'PAT-2025-001',
    imageUri: 'mock://image-001.jpg',
    triageResult: 'high',
    status: 'synced',
    notes: {
      symptoms: ['Itchy', 'Painful'],
      characteristics: ['Raised', 'Spreading'],
      additionalNotes: 'Patient reports rapid spreading over the last 2 days.',
    },
    createdAt: new Date('2025-09-20T10:30:00Z'),
    syncedAt: new Date('2025-09-20T10:35:00Z'),
  },
  {
    id: 'case-002',
    patientId: 'PAT-2025-002',
    imageUri: 'mock://image-002.jpg',
    triageResult: 'low',
    status: 'pending_sync',
    notes: {
      symptoms: ['None'],
      characteristics: ['Flaky'],
      additionalNotes: 'Mild scaling, no other symptoms.',
    },
    createdAt: new Date('2025-09-22T14:15:00Z'),
  },
  {
    id: 'case-003',
    patientId: 'PAT-2025-003',
    imageUri: 'mock://image-003.jpg',
    triageResult: 'medium',
    status: 'uploading',
    notes: {
      symptoms: ['Itchy'],
      characteristics: ['Raised', 'Flaky'],
      additionalNotes: 'Moderate itching, lesion has been present for 1 week.',
    },
    createdAt: new Date('2025-09-23T09:45:00Z'),
  },
];

// Mock AI analysis results
export const mockAnalysisResults = ['low', 'medium', 'high'] as const;

// Temporarily force high-risk result for testing the red triage workflow
export const getRandomAnalysisResult = (): 'low' | 'medium' | 'high' => {
  return 'high'; // Force high-risk result for testing
  // return mockAnalysisResults[Math.floor(Math.random() * mockAnalysisResults.length)]; // Original random logic
};

// Simulate AI analysis delay
export const simulateAIAnalysis = (_imageUri: string): Promise<'low' | 'medium' | 'high'> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getRandomAnalysisResult());
    }, 2000); // 2 second delay to simulate processing
  });
};

// Generate unique patient ID
export const generatePatientId = (): string => {
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `PAT-${new Date().getFullYear()}-${random}`;
}

// Generate unique case ID
export const generateCaseId = (): string => {
  return `case-${Date.now()}`;
};