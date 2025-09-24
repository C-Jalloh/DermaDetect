import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const userSchema = tableSchema({
  name: 'users',
  columns: [
    { name: 'username', type: 'string' },
    { name: 'hashed_password', type: 'string' },
    { name: 'role', type: 'string' },
  ],
});

export const patientSchema = tableSchema({
  name: 'patients',
  columns: [
    { name: 'first_name', type: 'string' },
    { name: 'last_name', type: 'string' },
    { name: 'dob', type: 'string' },
    { name: 'gender', type: 'string' },
    { name: 'contact_info', type: 'string' },
  ],
});

export const visitSchema = tableSchema({
  name: 'visits',
  columns: [
    { name: 'patient_id', type: 'string', isIndexed: true },
    { name: 'created_at', type: 'number' },
    { name: 'vitals', type: 'string' }, // JSON string
    { name: 'notes', type: 'string' },
  ],
});

export const triageSchema = tableSchema({
  name: 'triages',
  columns: [
    { name: 'visit_id', type: 'string', isIndexed: true },
    { name: 'image_uri', type: 'string' },
    { name: 'ai_result', type: 'string' }, // JSON string
    { name: 'status', type: 'string' },
  ],
});

export const diagnosisSchema = tableSchema({
  name: 'diagnoses',
  columns: [
    { name: 'triage_id', type: 'string', isIndexed: true },
    { name: 'doctor_id', type: 'string', isIndexed: true },
    { name: 'diagnosis_text', type: 'string' },
    { name: 'prescription_text', type: 'string' },
    { name: 'created_at', type: 'number' },
  ],
});

export const schema = appSchema({
  version: 1,
  tables: [
    userSchema,
    patientSchema,
    visitSchema,
    triageSchema,
    diagnosisSchema,
  ],
});