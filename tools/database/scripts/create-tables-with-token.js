const { createClient } = require('@supabase/supabase-js');

// Nova chave de acesso do Supabase
const SUPABASE_URL = 'https://xspmibkhtmnetivtnjox.supabase.co';
const SUPABASE_KEY = 'sbp_v0_d631951ba033dd61c73092421d14982d3ff3fd5b';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Script SQL para criar as tabelas
const sql = `
-- Departamentos (criando primeiro para evitar problemas de referência)
CREATE TABLE IF NOT EXISTS departments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar NOT NULL,
    description varchar,
    status varchar,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Profissionais de saúde
CREATE TABLE IF NOT EXISTS health_professionals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar NOT NULL,
    crm varchar,
    email varchar,
    phone varchar,
    specialty varchar,
    status varchar,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Usuários
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email varchar NOT NULL UNIQUE,
    name varchar NOT NULL,
    password varchar,
    role varchar NOT NULL,
    active boolean DEFAULT true,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Perfis de usuário
CREATE TABLE IF NOT EXISTS user_profiles (
    id uuid PRIMARY KEY,
    full_name varchar,
    username varchar,
    role varchar,
    department_id uuid REFERENCES departments(id),
    professional_id uuid REFERENCES health_professionals(id),
    is_active boolean,
    last_login timestamp,
    settings json,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Pacientes
CREATE TABLE IF NOT EXISTS patients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_number varchar UNIQUE,
    name varchar NOT NULL,
    cpf varchar UNIQUE,
    date_of_birth date,
    gender varchar,
    address json,
    phone varchar,
    registered_by uuid REFERENCES users(id),
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Unidades de saúde
CREATE TABLE IF NOT EXISTS healthcare_units (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar NOT NULL,
    address varchar,
    phone varchar,
    email varchar,
    type varchar,
    is_active boolean DEFAULT true,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Agendamentos
CREATE TABLE IF NOT EXISTS appointments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id uuid REFERENCES patients(id),
    doctor_id uuid REFERENCES health_professionals(id),
    scheduled_start timestamp,
    scheduled_end timestamp,
    status varchar,
    type varchar,
    reason varchar,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Sinais vitais
CREATE TABLE IF NOT EXISTS vital_signs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id uuid REFERENCES patients(id),
    measured_by uuid REFERENCES health_professionals(id),
    measured_at timestamp,
    blood_pressure varchar,
    heart_rate int,
    respiratory_rate int,
    temperature float,
    oxygen_saturation float,
    pain_level int,
    notes varchar,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Colaboradores
CREATE TABLE IF NOT EXISTS collaborators (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar NOT NULL,
    email varchar,
    phone varchar,
    department varchar,
    role varchar,
    specialty varchar,
    image_url varchar,
    active boolean,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Posts (blog)
CREATE TABLE IF NOT EXISTS posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id),
    title varchar NOT NULL,
    content text,
    published boolean DEFAULT false,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Categorias de post
CREATE TABLE IF NOT EXISTS categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar NOT NULL,
    created_at timestamp DEFAULT now()
);

-- Relacionamento post-categoria
CREATE TABLE IF NOT EXISTS post_categories (
    post_id uuid REFERENCES posts(id),
    category_id uuid REFERENCES categories(id),
    PRIMARY KEY (post_id, category_id)
);

-- Comentários
CREATE TABLE IF NOT EXISTS comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid REFERENCES posts(id),
    user_id uuid REFERENCES users(id),
    content text,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Fila de sincronização offline
CREATE TABLE IF NOT EXISTS offline_sync_queue (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id uuid REFERENCES patients(id),
    data json,
    data_type varchar,
    synced boolean,
    timestamp bigint,
    created_at timestamp DEFAULT now()
);

-- Notas do paciente
CREATE TABLE IF NOT EXISTS patient_notes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id uuid REFERENCES patients(id),
    created_by uuid REFERENCES users(id),
    notes text,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Logs do paciente
CREATE TABLE IF NOT EXISTS patient_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id uuid REFERENCES patients(id),
    action varchar,
    description text,
    performed_by uuid REFERENCES users(id),
    created_at timestamp DEFAULT now()
);

-- Ativar RLS (Row Level Security) nas tabelas sensíveis
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthcare_units ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança básicas
-- Exemplo: Permitir que usuários autenticados leiam todas as tabelas
CREATE POLICY "Permitir leitura para usuários autenticados"
ON patients FOR SELECT
TO authenticated
USING (true);
`;

// Função para criar as tabelas
async function createTables() {
  console.log('Iniciando criação das tabelas no Supabase...');

  try {
    // Tentar usar a API REST do Supabase para executar SQL diretamente
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/execute_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({
        sql_query: sql
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na API: ${response.status} - ${errorText}`);
    }

    console.log('✅ Tabelas criadas com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error.message);
    console.log('\nPor favor, siga estas instruções alternativas:');
    console.log('1. Acesse o painel do Supabase: https://app.supabase.com');
    console.log('2. Selecione seu projeto');
    console.log('3. Vá para "SQL Editor" > "New Query"');
    console.log('4. Cole o conteúdo do arquivo scripts/create-tables-sql.txt');
    console.log('5. Clique em "Run" para executar o script SQL');
  }
}

// Executar a função
createTables();