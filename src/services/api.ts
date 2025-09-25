import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.100.68:5000/api'; // Host machine IP for Android emulator

class ApiService {
  private token: string | null = null;

  async setToken(token: string) {
    this.token = token;
    await AsyncStorage.setItem('auth_token', token);
  }

  async getToken(): Promise<string | null> {
    if (this.token) return this.token;
    this.token = await AsyncStorage.getItem('auth_token');
    return this.token;
  }

  async clearToken() {
    this.token = null;
    await AsyncStorage.removeItem('auth_token');
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = await this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: { ...headers, ...(options.headers as Record<string, string>) },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string, role: 'chw' | 'doctor') {
    const response = await this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
    await this.setToken(response.access_token);
    return response;
  }

  // Patients
  async getPatients() {
    return this.request('/patients');
  }

  async createPatient(patientData: any) {
    return this.request('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  }

  async getPatient(patientId: string) {
    return this.request(`/patients/${patientId}`);
  }

  // Vitals
  async getPatientVitals(patientId: string) {
    return this.request(`/patients/${patientId}/vitals`);
  }

  async createVitals(patientId: string, vitalsData: any) {
    return this.request(`/patients/${patientId}/vitals`, {
      method: 'POST',
      body: JSON.stringify(vitalsData),
    });
  }

  // User Profile
  async getCurrentUser() {
    return this.request('/me');
  }

  // Cases
  async getPendingCases() {
    return this.request('/cases/pending');
  }

  async createCase(caseData: any) {
    return this.request('/cases', {
      method: 'POST',
      body: JSON.stringify(caseData),
    });
  }

  async getCase(caseId: string) {
    return this.request(`/cases/${caseId}`);
  }

  async getCases() {
    return this.request('/cases');
  }

  async createDiagnosis(caseId: string, diagnosisData: any) {
    return this.request(`/cases/${caseId}/diagnosis`, {
      method: 'POST',
      body: JSON.stringify(diagnosisData),
    });
  }

  // Sync
  async sync(syncData: any) {
    return this.request('/sync', {
      method: 'POST',
      body: JSON.stringify(syncData),
    });
  }
}

export const apiService = new ApiService();