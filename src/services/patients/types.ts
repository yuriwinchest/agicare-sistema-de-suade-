
export interface Patient {
  id: string;
  name: string;
  cpf?: string;
  phone?: string;
  email?: string;
  address?: string | object;
  birth_date?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  person_type?: string;
  gender?: string;
  mother_name?: string;
  father_name?: string;
  cns?: string;
  marital_status?: string;
  protocol_number?: number;
  reception?: string;
  specialty?: string;
  professional?: string;
  health_plan?: string;
  date?: string;
  appointmentTime?: string;
}

export interface PatientDraft {
  id?: string;
  name: string;
  cpf?: string;
  phone?: string;
  email?: string;
  address?: string | object;
  birth_date?: string;
  status?: string;
}

export interface PatientAdditionalData {
  id: string;
  health_plan?: string;
  specialty?: string;
  reception?: string;
  professional?: string;
}

export interface PatientDocument {
  patient_id: string;
  document_type: string;
  document_number: string;
}
