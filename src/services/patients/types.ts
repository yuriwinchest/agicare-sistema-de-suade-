
export interface Patient {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  address: string | object;
  birth_date: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  allergies?: string[];
  nursingData?: {
    vitalSigns?: any;
    evolution?: any;
    procedures?: any;
    anamnesis?: any;
    hydricBalance?: any;
    medication?: any;
    physicalExam?: any;
    previousEvolutions?: any[];
  };
  // New fields
  person_type?: string;
  cns?: string;
  marital_status?: string;
  gender?: string;
  mother_name?: string;
  father_name?: string;
  protocol_number?: number; 
  reception?: string; // This will be saved in patient_additional_data
  specialty?: string;
  professional?: string; // This will be saved in patient_additional_data
  health_plan?: string; // This will be saved in patient_additional_data
  healthPlan?: string; // Alternative property for health_plan
  date?: string; // Appointment date
  appointmentTime?: string; // Appointment time
}

export interface HospitalizedPatient extends Patient {
  unit?: string;
  bed?: string;
  doctor?: string;
  diagnosis?: string;
  admissionDate?: string;
}

export interface PatientDraft {
  id?: string;
  name: string;
  cpf?: string;
  phone?: string;
  email?: string;
  address?: string | object;
  addressDetails?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  birth_date?: string;
  birthDate?: string; // Alternative field used in UI
  gender?: string;
  active?: boolean;
  healthPlan?: string;
  healthCardNumber?: string;
  status?: string;
  // New fields
  person_type?: string;
  cns?: string;
  marital_status?: string;
  mother_name?: string;
  father_name?: string;
  // Additional fields that were missing in the interface
  additionalData?: {
    nationality?: string;
    place_of_birth?: string;
    place_of_birth_state?: string;
    ethnicity?: string;
    occupation?: string;
    education_level?: string;
    health_plan?: string;
    health_card_number?: string;
  };
  documents?: Array<{
    id?: string;
    document_type: string;
    document_number: string;
    issuing_body?: string;
    issue_date?: string;
  }>;
  allergies?: Array<{
    id?: string;
    allergy_type: string;
    description: string;
    severity?: string;
  }>;
  notes?: string;
}

export interface PatientAdditionalData {
  id: string;
  nationality?: string;
  place_of_birth?: string;
  place_of_birth_state?: string;
  ethnicity?: string;
  occupation?: string;
  education_level?: string;
  health_plan?: string;
  health_card_number?: string;
  city?: string;
  state?: string;
  professional?: string; // Added professional field
  reception?: string; // Added reception field
}

export interface PatientDocument {
  id?: string;
  patient_id: string;
  document_type: string;
  document_number: string;
  issuing_body?: string;
  issue_date?: string | null;
}

export interface PatientAllergy {
  id?: string;
  patient_id: string;
  allergy_type: string;
  description: string;
  severity?: string;
}

export interface PatientNote {
  id?: string;
  patient_id: string;
  notes: string;
  created_by?: string;
}

export interface PatientLog {
  id?: string;
  patient_id: string;
  action: string;
  description: string;
  performed_by?: string;
  created_at?: string;
}
