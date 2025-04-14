
import { supabase } from '../supabaseClient';

const createPatientsTable = async () => {
  const { error } = await supabase
    .from('patients')
    .select('*')
    .limit(1);

  if (error && error.code === '42P01') {
    const { error: createError } = await supabase.rpc('create_table', {
      table_sql: `
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
          nursing_data JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (createError) console.error("Erro ao criar tabela de pacientes:", createError);
  }
};

const createVitalSignsTable = async () => {
  const { error } = await supabase
    .from('vital_signs')
    .select('*')
    .limit(1);

  if (error && error.code === '42P01') {
    const { error: createError } = await supabase.rpc('create_table', {
      table_sql: `
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
    
    if (createError) console.error("Erro ao criar tabela de sinais vitais:", createError);
  }
};

const createHealthProfessionalsTable = async () => {
  const { error } = await supabase
    .from('health_professionals')
    .select('*')
    .limit(1);

  if (error && error.code === '42P01') {
    const { error: createError } = await supabase.rpc('create_table', {
      table_sql: `
        CREATE TABLE IF NOT EXISTS health_professionals (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          specialty TEXT NOT NULL,
          license_number TEXT NOT NULL,
          email TEXT,
          phone TEXT,
          active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (createError) console.error("Erro ao criar tabela de profissionais:", createError);
  }
};

const createHealthcareUnitsTable = async () => {
  const { error } = await supabase
    .from('healthcare_units')
    .select('*')
    .limit(1);

  if (error && error.code === '42P01') {
    const { error: createError } = await supabase.rpc('create_table', {
      table_sql: `
        CREATE TABLE IF NOT EXISTS healthcare_units (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          address TEXT NOT NULL,
          phone TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (createError) console.error("Erro ao criar tabela de unidades:", createError);
  }
};

export const initializeTables = async (): Promise<boolean> => {
  try {
    console.log("Iniciando criação das tabelas...");
    
    // Create tables in sequence
    await createPatientsTable();
    await createVitalSignsTable();
    await createHealthProfessionalsTable();
    await createHealthcareUnitsTable();
    
    console.log("Tabelas criadas com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao inicializar tabelas:", error);
    return false;
  }
};
