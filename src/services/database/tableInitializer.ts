
import { supabase } from '../supabaseClient';

const createPatientsTable = async () => {
  const { error } = await supabase.rpc('run_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS patients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        cpf TEXT,
        phone TEXT,
        date TEXT,
        time TEXT,
        status TEXT,
        reception TEXT,
        specialty TEXT,
        professional TEXT,
        observations TEXT,
        redirected BOOLEAN DEFAULT FALSE,
        redirection_time TEXT,
        allergies TEXT[],
        nursing_data JSONB
      );
    `
  });
  
  if (error) console.error("Erro ao criar tabela de pacientes:", error);
};

const createVitalSignsTable = async () => {
  const { error } = await supabase.rpc('run_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS vital_signs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        patient_id TEXT NOT NULL REFERENCES patients(id),
        temperature TEXT,
        pressure TEXT,
        pulse TEXT,
        respiratory TEXT,
        oxygen TEXT,
        pain_scale TEXT,
        weight TEXT,
        height TEXT,
        bmi TEXT,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });
  
  if (error) console.error("Erro ao criar tabela de sinais vitais:", error);
};

// ... Additional table creation functions following the same pattern

export const initializeTables = async (): Promise<boolean> => {
  try {
    // Create tables in sequence to maintain dependencies
    await createPatientsTable();
    await createVitalSignsTable();
    // ... Add other table creation calls
    
    return true;
  } catch (error) {
    console.error("Erro ao inicializar tabelas:", error);
    return false;
  }
};
