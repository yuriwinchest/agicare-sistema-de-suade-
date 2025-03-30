
import { createClient } from '@supabase/supabase-js';

// Estas URLs serão fornecidas pelo Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL ou chave anônima não definidas. Verifique suas variáveis de ambiente.');
}

// Criação do cliente Supabase
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Tipo para definir os dados do paciente
export type Patient = {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  date: string;
  time: string;
  status: string;
  reception?: string;
  specialty?: string;
  professional?: string;
  observations?: string;
  redirected?: boolean;
  redirectionTime?: string;
  allergies?: string[];
  nursingData?: Record<string, any>;
};

// Tipo para definir os sinais vitais
export type VitalSigns = {
  id?: string;
  patient_id: string;
  temperature?: string;
  pressure?: string;
  pulse?: string;
  respiratory?: string;
  oxygen?: string;
  pain_scale?: string;
  weight?: string;
  height?: string;
  bmi?: string;
  date: string;
  time: string;
  created_at?: string;
};

// Tipo para definir a evolução de enfermagem
export type NursingEvolution = {
  id?: string;
  patient_id: string;
  date: string;
  time: string;
  evolution: string;
  created_at?: string;
};

// Tipo para definir os registros de balanço hídrico
export type HydricBalanceRecord = {
  id?: string;
  patient_id: string;
  type: 'intake' | 'output';
  record_type: string;
  volume: string;
  time: string;
  date: string;
  created_at?: string;
};

// Tipo para definir os procedimentos
export type Procedure = {
  id?: string;
  patient_id: string;
  date: string;
  time: string;
  procedure: string;
  notes?: string;
  status: 'planejado' | 'realizado' | 'cancelado';
  created_at?: string;
};

// Tipo para definir as medicações
export type Medication = {
  id?: string;
  patient_id: string;
  name: string;
  dosage: string;
  route: string;
  time: string;
  status: 'pendente' | 'administrado' | 'cancelado';
  administered_by?: string;
  administered_at?: string;
  notes?: string;
  created_at?: string;
};

// Tipo para definir os itens de sincronização offline
export type OfflineSyncItem = {
  id?: string;
  patient_id: string;
  data_type: string;
  data: any;
  timestamp: number;
  synced: boolean;
  created_at?: string;
};
