export interface User {
  id: string;
  name: string;
  email: string;
  profile_picture_url: string;
};

export interface Medication {
  id: number;
  patient_id: number;
  linked_health_system: boolean;
  name: string;
  details: string;
  dosage: string;
  active: boolean;
  administration_route?: string;
  flaggedForReview: boolean;
  created_date: Date;
  updated_date: Date;
}

export interface Allergies {
  id: number;
  patient_id: number;
  linked_health_system: boolean;
  topic: string;
  details: string;
  active: boolean;
  severity: 'Mild' | 'Moderate' | 'Severe';
  onset_date: Date;
  created_date: Date;
  updated_date: Date;
}

export interface EmergencyCare {
  id: number;
  patient_id: number;
  linked_health_system: boolean;
  topic: string;
  details: string;
  created_date: Date;
  updated_date: Date;
}

export interface Patient {
  id: number;
  user_id: string;
  blood_type?: string;
  date_of_birth?: Date;
  first_name: string;
  gender?: string;
  height?: number;
  height_unit?: string;
  last_name: string;
  middle_name?: string;
  profile_image_data?: string;
  relationship?: string;
  weight?: number;
  weight_unit?: string;
  created_date: Date;
  updated_date: Date;
}

export interface PatientSnapshot {
  id: number;
  patient_id: number;
  summary: string;
  health_issues: string;
  created_date: Date;
  updated_date: Date;
}

export interface MedicalCondition {
  id: number;
  patient_id: number;
  condition_name: string;
  diagnosed_date: Date;
  linked_health_system: boolean;
  flagged_for_review: boolean;
  created_date: Date;
  updated_date: Date;
}

export interface MedicalEquipment {
  id: number;
  patient_id: number;
  equipment_name: string;
  equipment_description?: string;
  linked_health_system: boolean;
  created_date: Date;
  updated_date: Date;
}

export interface HighLevelGoal {
  id: number;
  patient_id: number;
  goal_description: string;
  target_date: Date;
  status: 'Active' | 'Completed' | 'On Hold' | 'Cancelled';
  linked_health_system: boolean;
  created_date: Date;
  updated_date: Date;
}

export interface Notes {
  id: number;
  patient_id: number;
  topic: string;
  details: string;
  reminder_date: Date;
  created_date: Date;
  updated_date: Date;
}

export const tables = {
  USER: 'users',
  PATIENT: 'patients',
  PATIENT_SNAPSHOT: 'patient_snapshots',
  MEDICAL_CONDITION: 'medical_conditions',
  MEDICAL_EQUIPMENT: 'medical_equipment',
  HIGH_LEVEL_GOAL: 'high_level_goals',
  EMERGENCY_CARE: 'emergency_care',
  ALLERGIES: 'allergies',
  MEDICATION: 'medications',
  NOTES: 'notes'
}