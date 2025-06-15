-- Script SQL complementar para criar tabelas adicionais no Supabase
-- Copie e cole este script no SQL Editor do Supabase após executar o script principal

-- Categorias de serviços
CREATE TABLE IF NOT EXISTS "service_categories" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar NOT NULL,
    description varchar,
    icon varchar,
    color varchar,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Tabela de preços dos serviços
CREATE TABLE IF NOT EXISTS "service_prices" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar NOT NULL,
    description varchar,
    price decimal(10, 2) NOT NULL DEFAULT 0,
    type varchar NOT NULL CHECK (type IN ('EXAM', 'PROCEDURE', 'CONSULTATION', 'OTHER')),
    active boolean DEFAULT true,
    category_id uuid REFERENCES service_categories(id),
    metadata jsonb,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now(),

    -- Garantir unicidade para nome e tipo
    CONSTRAINT service_price_name_type_unique UNIQUE (name, type)
);

-- Alergias do paciente
CREATE TABLE IF NOT EXISTS "allergies" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id uuid REFERENCES patients(id),
    name varchar NOT NULL,
    description varchar,
    severity varchar,
    diagnosed timestamp,
    notes varchar,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Medicações em uso pelo paciente
CREATE TABLE IF NOT EXISTS "medications" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id uuid REFERENCES patients(id),
    name varchar NOT NULL,
    dosage varchar NOT NULL,
    frequency varchar NOT NULL,
    start_date timestamp NOT NULL,
    end_date timestamp,
    prescribed_by varchar,
    active boolean DEFAULT true,
    notes varchar,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Condições de saúde do paciente
CREATE TABLE IF NOT EXISTS "health_conditions" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id uuid REFERENCES patients(id),
    name varchar NOT NULL,
    description varchar,
    diagnosed timestamp,
    status varchar,
    notes varchar,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Consultas médicas
CREATE TABLE IF NOT EXISTS "consultations" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id uuid REFERENCES patients(id),
    doctor_id uuid REFERENCES health_professionals(id),
    date timestamp NOT NULL,
    chief_complaint varchar,
    symptoms varchar,
    diagnosis varchar,
    treatment varchar,
    prescription varchar,
    notes varchar,
    follow_up timestamp,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Solicitações de exames
CREATE TABLE IF NOT EXISTS "exam_requests" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id uuid REFERENCES patients(id),
    requested_by uuid REFERENCES health_professionals(id),
    consultation_id uuid REFERENCES consultations(id),
    type varchar NOT NULL,
    description varchar,
    urgency varchar,
    requested_at timestamp DEFAULT now(),
    scheduled_for timestamp,
    notes varchar,
    status varchar DEFAULT 'PENDING',
    service_id uuid REFERENCES service_prices(id),
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Resultados de exames
CREATE TABLE IF NOT EXISTS "exam_results" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_request_id uuid REFERENCES exam_requests(id),
    patient_id uuid REFERENCES patients(id),
    performed_at timestamp NOT NULL,
    performed_by varchar,
    results varchar NOT NULL,
    file_url varchar,
    notes varchar,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Prontuário médico
CREATE TABLE IF NOT EXISTS "medical_records" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id uuid REFERENCES patients(id),
    doctor_id uuid REFERENCES health_professionals(id),
    date timestamp DEFAULT now(),
    type varchar NOT NULL,
    content varchar NOT NULL,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Registro de enfermagem
CREATE TABLE IF NOT EXISTS "nursing_records" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id uuid REFERENCES patients(id),
    nurse_id uuid REFERENCES health_professionals(id),
    date timestamp DEFAULT now(),
    type varchar NOT NULL,
    content jsonb NOT NULL,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Ativar RLS (Row Level Security) nas tabelas sensíveis
ALTER TABLE service_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE nursing_records ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança básicas
-- Exemplo: Permitir que usuários autenticados leiam todas as tabelas
CREATE POLICY "Permitir leitura para usuários autenticados em service_prices"
ON service_prices FOR SELECT
TO authenticated
USING (true);

-- Inserir algumas categorias de serviços padrão
INSERT INTO service_categories (id, name, description)
VALUES
  ('exm-img', 'Exames de Imagem', 'Radiografias, ultrassonografias, tomografias e outros exames de imagem'),
  ('exm-lab', 'Exames Laboratoriais', 'Análises clínicas e exames de sangue'),
  ('con-esp', 'Consultas Especializadas', 'Consultas com médicos especialistas'),
  ('con-ger', 'Consultas Gerais', 'Consultas de clínica geral e pronto atendimento'),
  ('proc-amb', 'Procedimentos Ambulatoriais', 'Pequenos procedimentos realizados em ambulatório')
ON CONFLICT DO NOTHING;

-- Confirmação
SELECT 'Tabelas complementares criadas com sucesso!' as resultado;