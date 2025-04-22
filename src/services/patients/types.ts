
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
  // Novos campos
  person_type?: string;
  cns?: string;
  marital_status?: string;
  gender?: string;
  mother_name?: string;
  father_name?: string;
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
  birthDate?: string; // Campo alternativo usado na UI
  gender?: string;
  active?: boolean;
  healthPlan?: string;
  healthCardNumber?: string;
  status?: string;
  // Novos campos
  person_type?: string;
  cns?: string;
  marital_status?: string;
  mother_name?: string;
  father_name?: string;
  // Campos adicionais que estavam faltando na interface
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

export interface HospitalizedPatient extends Patient {
  unit?: string;
  bed?: string;
  age?: number;
  doctor?: string;
  diagnosis?: string;
  admissionDate?: string;
  birth_date: string; // Garante que este é obrigatório para HospitalizedPatient
  medical_records?: {
    doctor: {
      name: string;
    };
    diagnosis: string;
  }[];
}

export interface PatientAdditionalData {
  id: string; // ID do paciente
  nationality?: string;
  place_of_birth?: string;
  place_of_birth_state?: string;
  ethnicity?: string;
  occupation?: string;
  education_level?: string;
  health_plan?: string;
  health_card_number?: string;
}

export interface PatientDocument {
  id?: string;
  patient_id: string;
  document_type: string;
  document_number: string;
  issuing_body?: string;
  issue_date?: string;
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
  notes?: string;
  created_by?: string;
}

export interface PatientLog {
  id?: string;
  patient_id: string;
  action: string;
  description: string;
  performed_by?: string;
}
