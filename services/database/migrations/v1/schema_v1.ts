export interface User {
  id: string;
  name: string;
  email: string;
};

export interface Patient {
  id: number;
  user_id: string;
  name: string;
  age?: number;
  relationship?: string;
  weight?: number;
  height?: number;
  gender?: string;
  birthdate?: Date;
  profile_picture?: string;
}

export interface PatientSnapshot {
  id: number;
  patient_id: number;
  summary: string;
  health_issues: string;
  created_at: Date;
  updated_at: Date;
}

export interface MedicalCondition {
  id: number;
  patient_id: number;
  condition_name: string;
  diagnosed_at: Date;
  created_at: Date;
  updated_at: Date;
  linked_health_system: boolean;
}

export interface MedicalEquipment {
  id: number;
  patient_id: number;
  equipment_name: string;
  description: string;
  linked_health_system: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface HighLevelGoal {
  id: number;
  patient_id: number;
  goal_description: string;
  target_date: Date;
  created_at: Date;
  updated_at: Date;
}

export const tables = {
  USER: 'users',
  PATIENT: 'patients',
  PATIENT_SNAPSHOT: 'patient_snapshots',
  MEDICAL_CONDITION: 'medical_conditions',
  MEDICAL_EQUIPMENT: 'medical_equipment',
  HIGH_LEVEL_GOAL: 'high_level_goals'
}