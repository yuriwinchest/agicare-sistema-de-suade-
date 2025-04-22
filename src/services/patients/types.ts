
export interface Patient {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  address: string;
  birth_date: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface PatientDraft {
  id?: string;
  name: string;
  cpf?: string;
  phone?: string;
  email?: string;
  address?: string;
  birth_date?: string;
  status?: string;
}
