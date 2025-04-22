
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
}

export interface HospitalizedPatient extends Patient {
  unit?: string;
  bed?: string;
  age?: number;
  doctor?: string;
  diagnosis?: string;
  admissionDate?: string;
  birth_date: string; // Ensure this is required for HospitalizedPatient
  medical_records?: {
    doctor: {
      name: string;
    };
    diagnosis: string;
  }[];
}
