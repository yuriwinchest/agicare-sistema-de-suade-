
import { createClient } from '@supabase/supabase-js';

// Fornecendo URLs reais para desenvolvimento quando as variáveis de ambiente não estiverem definidas
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jxwnvuuoqmodlucrtijm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4d252dXVvcW1vZGx1Y3J0aWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY5NDY5NTYsImV4cCI6MjAzMjUyMjk1Nn0.ovnEsmQmgN8lbXFBg1U3Dlq1oIYfMrX1jvLF_SQsnt0';

// Criação do cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

// Tipo para consultas médicas
export type MedicalConsultation = {
  id?: string;
  patient_id: string;
  professional_id: string;
  date: string;
  time: string;
  specialty: string;
  main_complaint: string;
  diagnosis: string;
  prescription: string;
  recommendations: string;
  status: 'agendada' | 'em_andamento' | 'concluida' | 'cancelada';
  created_at?: string;
};

// Tipo para definir os profissionais de saúde
export type HealthProfessional = {
  id?: string;
  name: string;
  specialty: string;
  license_number: string;
  email: string;
  phone: string;
  active: boolean;
  created_at?: string;
};

// Tipo para agenda dos profissionais
export type Schedule = {
  id?: string;
  professional_id: string;
  day_of_week: number; // 0-6 (domingo-sábado)
  start_time: string;
  end_time: string;
  break_start?: string;
  break_end?: string;
  appointment_duration: number; // duração em minutos
  created_at?: string;
};

// Tipo para agendamentos
export type Appointment = {
  id?: string;
  patient_id: string;
  professional_id: string;
  date: string;
  time: string;
  duration: number;
  status: 'agendado' | 'confirmado' | 'aguardando' | 'atendido' | 'cancelado';
  notes?: string;
  created_at?: string;
};

// Tipo para unidades de atendimento
export type HealthcareUnit = {
  id?: string;
  name: string;
  address: string;
  phone: string;
  created_at?: string;
};

// Função para inicializar o banco de dados
export const initializeDatabase = async (): Promise<boolean> => {
  try {
    console.log("Verificando e inicializando banco de dados...");
    
    // Verifica se a tabela de pacientes existe
    const { error: patientsCheckError } = await supabase
      .from('patients')
      .select('id')
      .limit(1);
    
    // Se a tabela não existir, cria
    if (patientsCheckError && patientsCheckError.code === '42P01') { // código para "relação não existe"
      console.log("Criando tabela de pacientes...");
      
      const { error: createTableError } = await supabase.rpc('create_patients_table', {});
      
      if (createTableError) {
        console.error("Erro ao criar tabela de pacientes:", createTableError);
        
        // Tenta criar a tabela diretamente com SQL
        const { error: sqlError } = await supabase.rpc('run_sql', {
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
        
        if (sqlError) {
          console.error("Erro ao criar tabela de pacientes com SQL:", sqlError);
          return false;
        }
      }
    }
    
    // Verifica e cria tabela de sinais vitais
    const { error: vitalSignsCheckError } = await supabase
      .from('vital_signs')
      .select('id')
      .limit(1);
    
    if (vitalSignsCheckError && vitalSignsCheckError.code === '42P01') {
      console.log("Criando tabela de sinais vitais...");
      
      const { error: sqlError } = await supabase.rpc('run_sql', {
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
      
      if (sqlError) {
        console.error("Erro ao criar tabela de sinais vitais:", sqlError);
      }
    }
    
    // Verifica e cria tabela de evolução de enfermagem
    const { error: evolutionCheckError } = await supabase
      .from('nursing_evolution')
      .select('id')
      .limit(1);
    
    if (evolutionCheckError && evolutionCheckError.code === '42P01') {
      console.log("Criando tabela de evolução de enfermagem...");
      
      const { error: sqlError } = await supabase.rpc('run_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS nursing_evolution (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            patient_id TEXT NOT NULL REFERENCES patients(id),
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            evolution TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      
      if (sqlError) {
        console.error("Erro ao criar tabela de evolução de enfermagem:", sqlError);
      }
    }
    
    // Verifica e cria tabela de balanço hídrico
    const { error: hydricBalanceCheckError } = await supabase
      .from('hydric_balance_records')
      .select('id')
      .limit(1);
    
    if (hydricBalanceCheckError && hydricBalanceCheckError.code === '42P01') {
      console.log("Criando tabela de balanço hídrico...");
      
      const { error: sqlError } = await supabase.rpc('run_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS hydric_balance_records (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            patient_id TEXT NOT NULL REFERENCES patients(id),
            type TEXT NOT NULL,
            record_type TEXT NOT NULL,
            volume TEXT NOT NULL,
            time TEXT NOT NULL,
            date TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      
      if (sqlError) {
        console.error("Erro ao criar tabela de balanço hídrico:", sqlError);
      }
    }
    
    // Verifica e cria tabela de procedimentos
    const { error: proceduresCheckError } = await supabase
      .from('procedures')
      .select('id')
      .limit(1);
    
    if (proceduresCheckError && proceduresCheckError.code === '42P01') {
      console.log("Criando tabela de procedimentos...");
      
      const { error: sqlError } = await supabase.rpc('run_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS procedures (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            patient_id TEXT NOT NULL REFERENCES patients(id),
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            procedure TEXT NOT NULL,
            notes TEXT,
            status TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      
      if (sqlError) {
        console.error("Erro ao criar tabela de procedimentos:", sqlError);
      }
    }
    
    // Verifica e cria tabela de medicações
    const { error: medicationsCheckError } = await supabase
      .from('medications')
      .select('id')
      .limit(1);
    
    if (medicationsCheckError && medicationsCheckError.code === '42P01') {
      console.log("Criando tabela de medicações...");
      
      const { error: sqlError } = await supabase.rpc('run_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS medications (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            patient_id TEXT NOT NULL REFERENCES patients(id),
            name TEXT NOT NULL,
            dosage TEXT NOT NULL,
            route TEXT NOT NULL,
            time TEXT NOT NULL,
            status TEXT NOT NULL,
            administered_by TEXT,
            administered_at TIMESTAMP WITH TIME ZONE,
            notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      
      if (sqlError) {
        console.error("Erro ao criar tabela de medicações:", sqlError);
      }
    }
    
    // Verifica e cria tabela para sincronização offline
    const { error: offlineSyncCheckError } = await supabase
      .from('offline_sync_queue')
      .select('id')
      .limit(1);
    
    if (offlineSyncCheckError && offlineSyncCheckError.code === '42P01') {
      console.log("Criando tabela de fila de sincronização offline...");
      
      const { error: sqlError } = await supabase.rpc('run_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS offline_sync_queue (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            patient_id TEXT NOT NULL,
            data_type TEXT NOT NULL,
            data JSONB NOT NULL,
            timestamp BIGINT NOT NULL,
            synced BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      
      if (sqlError) {
        console.error("Erro ao criar tabela de fila de sincronização offline:", sqlError);
      }
    }
    
    // Verifica e cria tabela de consultas médicas
    const { error: consultationsCheckError } = await supabase
      .from('medical_consultations')
      .select('id')
      .limit(1);
    
    if (consultationsCheckError && consultationsCheckError.code === '42P01') {
      console.log("Criando tabela de consultas médicas...");
      
      const { error: sqlError } = await supabase.rpc('run_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS medical_consultations (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            patient_id TEXT NOT NULL REFERENCES patients(id),
            professional_id TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            specialty TEXT NOT NULL,
            main_complaint TEXT,
            diagnosis TEXT,
            prescription TEXT,
            recommendations TEXT,
            status TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      
      if (sqlError) {
        console.error("Erro ao criar tabela de consultas médicas:", sqlError);
      }
    }
    
    // Verifica e cria tabela de profissionais de saúde
    const { error: professionalsCheckError } = await supabase
      .from('health_professionals')
      .select('id')
      .limit(1);
    
    if (professionalsCheckError && professionalsCheckError.code === '42P01') {
      console.log("Criando tabela de profissionais de saúde...");
      
      const { error: sqlError } = await supabase.rpc('run_sql', {
        sql: `
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
      
      if (sqlError) {
        console.error("Erro ao criar tabela de profissionais de saúde:", sqlError);
      }
    }
    
    // Verifica e cria tabela de agenda dos profissionais
    const { error: scheduleCheckError } = await supabase
      .from('schedules')
      .select('id')
      .limit(1);
    
    if (scheduleCheckError && scheduleCheckError.code === '42P01') {
      console.log("Criando tabela de agenda dos profissionais...");
      
      const { error: sqlError } = await supabase.rpc('run_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS schedules (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            professional_id TEXT NOT NULL,
            day_of_week INTEGER NOT NULL,
            start_time TEXT NOT NULL,
            end_time TEXT NOT NULL,
            break_start TEXT,
            break_end TEXT,
            appointment_duration INTEGER NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      
      if (sqlError) {
        console.error("Erro ao criar tabela de agenda dos profissionais:", sqlError);
      }
    }
    
    // Verifica e cria tabela de agendamentos
    const { error: appointmentsCheckError } = await supabase
      .from('appointments')
      .select('id')
      .limit(1);
    
    if (appointmentsCheckError && appointmentsCheckError.code === '42P01') {
      console.log("Criando tabela de agendamentos...");
      
      const { error: sqlError } = await supabase.rpc('run_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS appointments (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            patient_id TEXT NOT NULL REFERENCES patients(id),
            professional_id TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            duration INTEGER NOT NULL,
            status TEXT NOT NULL,
            notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      
      if (sqlError) {
        console.error("Erro ao criar tabela de agendamentos:", sqlError);
      }
    }
    
    // Verifica e cria tabela de unidades de atendimento
    const { error: unitsCheckError } = await supabase
      .from('healthcare_units')
      .select('id')
      .limit(1);
    
    if (unitsCheckError && unitsCheckError.code === '42P01') {
      console.log("Criando tabela de unidades de atendimento...");
      
      const { error: sqlError } = await supabase.rpc('run_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS healthcare_units (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            address TEXT NOT NULL,
            phone TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      
      if (sqlError) {
        console.error("Erro ao criar tabela de unidades de atendimento:", sqlError);
      }
    }
    
    console.log("Inicialização do banco de dados concluída");
    
    return true;
  } catch (error) {
    console.error("Erro ao inicializar banco de dados:", error);
    return false;
  }
};

// Inicializar o banco de dados quando o arquivo for carregado
initializeDatabase().catch(error => 
  console.error("Erro ao inicializar banco de dados durante carregamento:", error)
);
