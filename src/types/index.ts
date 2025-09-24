// Core data types for DermaDetect
export interface PatientCase {
  id: string;
  patientId: string;
  imageUri: string;
  triageResult: 'low' | 'medium' | 'high';
  status: 'pending_sync' | 'synced' | 'uploading';
  notes: CaseNotes;
  createdAt: Date;
  syncedAt?: Date;
}

export interface CaseNotes {
  symptoms: string[];
  characteristics: string[];
  additionalNotes: string;
}

export interface User {
  id: string;
  name: string;
  role: 'chw';
  pin: string;
}

export interface AppState {
  user: User | null;
  cases: PatientCase[];
  isOnline: boolean;
  isAnalyzing: boolean;
}

export type RiskLevel = 'low' | 'medium' | 'high';

export interface CameraConfig {
  overlayVisible: boolean;
  flashMode: 'off' | 'on' | 'auto';
}