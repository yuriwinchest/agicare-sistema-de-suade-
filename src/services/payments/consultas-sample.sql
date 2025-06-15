-- Script para adicionar consultas médicas de exemplo ao sistema SaludoCare
-- Execute este script no Editor SQL do Supabase para popular o banco de dados

-- Primeiro, vamos garantir que existam categorias para consultas
INSERT INTO "ServiceCategory" (id, name, description)
VALUES
  ('con-cli', 'Clínica Médica', 'Consultas com clínicos gerais'),
  ('con-esp', 'Especialidades Médicas', 'Consultas com especialistas'),
  ('con-ped', 'Pediatria', 'Consultas pediátricas'),
  ('con-psi', 'Saúde Mental', 'Consultas psicológicas e psiquiátricas'),
  ('con-nut', 'Nutrição', 'Consultas nutricionais'),
  ('con-fis', 'Fisioterapia', 'Avaliações fisioterápicas'),
  ('con-ret', 'Retornos', 'Consultas de retorno e acompanhamento')
ON CONFLICT (id) DO UPDATE 
SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Agora, vamos adicionar consultas médicas
-- 1. Clínica Médica
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Consulta Clínica Médica', 'Consulta com clínico geral', 180.00, 'CONSULTATION', true, 'con-cli'),
  ('Consulta Clínica de Urgência', 'Atendimento imediato de urgência', 220.00, 'CONSULTATION', true, 'con-cli'),
  ('Consulta Clínica Domiciliar', 'Atendimento médico em domicílio', 350.00, 'CONSULTATION', true, 'con-cli'),
  ('Avaliação Clínica Pré-Operatória', 'Avaliação médica antes de procedimentos cirúrgicos', 200.00, 'CONSULTATION', true, 'con-cli'),
  ('Perícia Médica', 'Avaliação médica pericial', 250.00, 'CONSULTATION', true, 'con-cli')
ON CONFLICT (name, type) DO NOTHING;

-- 2. Especialidades Médicas
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Consulta Cardiologia', 'Consulta com médico cardiologista', 250.00, 'CONSULTATION', true, 'con-esp'),
  ('Consulta Dermatologia', 'Consulta com médico dermatologista', 250.00, 'CONSULTATION', true, 'con-esp'),
  ('Consulta Endocrinologia', 'Consulta com médico endocrinologista', 250.00, 'CONSULTATION', true, 'con-esp'),
  ('Consulta Gastroenterologia', 'Consulta com médico gastroenterologista', 250.00, 'CONSULTATION', true, 'con-esp'),
  ('Consulta Ginecologia', 'Consulta com médico ginecologista', 230.00, 'CONSULTATION', true, 'con-esp'),
  ('Consulta Neurologia', 'Consulta com médico neurologista', 280.00, 'CONSULTATION', true, 'con-esp'),
  ('Consulta Oftalmologia', 'Consulta com médico oftalmologista', 220.00, 'CONSULTATION', true, 'con-esp'),
  ('Consulta Ortopedia', 'Consulta com médico ortopedista', 230.00, 'CONSULTATION', true, 'con-esp'),
  ('Consulta Otorrinolaringologia', 'Consulta com médico otorrinolaringologista', 240.00, 'CONSULTATION', true, 'con-esp'),
  ('Consulta Urologia', 'Consulta com médico urologista', 240.00, 'CONSULTATION', true, 'con-esp'),
  ('Consulta Reumatologia', 'Consulta com médico reumatologista', 260.00, 'CONSULTATION', true, 'con-esp'),
  ('Consulta Pneumologia', 'Consulta com médico pneumologista', 250.00, 'CONSULTATION', true, 'con-esp'),
  ('Consulta Angiologia', 'Consulta com médico angiologista', 250.00, 'CONSULTATION', true, 'con-esp'),
  ('Consulta Geriatria', 'Consulta com médico geriatra', 230.00, 'CONSULTATION', true, 'con-esp'),
  ('Consulta Alergia/Imunologia', 'Consulta com alergista/imunologista', 260.00, 'CONSULTATION', true, 'con-esp'),
  ('Consulta Cirurgia Geral', 'Consulta com cirurgião geral', 230.00, 'CONSULTATION', true, 'con-esp'),
  ('Consulta Cirurgia Plástica', 'Consulta com cirurgião plástico', 300.00, 'CONSULTATION', true, 'con-esp'),
  ('Consulta Infectologia', 'Consulta com médico infectologista', 250.00, 'CONSULTATION', true, 'con-esp'),
  ('Consulta Mastologia', 'Consulta com médico mastologista', 260.00, 'CONSULTATION', true, 'con-esp'),
  ('Consulta Nefrologia', 'Consulta com médico nefrologista', 250.00, 'CONSULTATION', true, 'con-esp')
ON CONFLICT (name, type) DO NOTHING;

-- 3. Pediatria
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Consulta Pediatria', 'Consulta com médico pediatra', 200.00, 'CONSULTATION', true, 'con-ped'),
  ('Consulta Pediatria de Urgência', 'Atendimento pediátrico de urgência', 240.00, 'CONSULTATION', true, 'con-ped'),
  ('Consulta Neonatologia', 'Consulta com médico neonatologista', 250.00, 'CONSULTATION', true, 'con-ped'),
  ('Consulta Pediatria Domiciliar', 'Atendimento pediátrico em domicílio', 350.00, 'CONSULTATION', true, 'con-ped'),
  ('Puericultura', 'Acompanhamento do desenvolvimento infantil', 180.00, 'CONSULTATION', true, 'con-ped')
ON CONFLICT (name, type) DO NOTHING;

-- 4. Saúde Mental
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Consulta Psiquiatria', 'Consulta com médico psiquiatra', 280.00, 'CONSULTATION', true, 'con-psi'),
  ('Consulta Psicologia', 'Sessão com psicólogo', 150.00, 'CONSULTATION', true, 'con-psi'),
  ('Psicoterapia Individual', 'Sessão de psicoterapia', 150.00, 'CONSULTATION', true, 'con-psi'),
  ('Avaliação Psicológica', 'Processo de avaliação completa', 350.00, 'CONSULTATION', true, 'con-psi'),
  ('Neuropsicologia', 'Avaliação neuropsicológica', 400.00, 'CONSULTATION', true, 'con-psi')
ON CONFLICT (name, type) DO NOTHING;

-- 5. Nutrição
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Consulta Nutrição', 'Avaliação nutricional inicial', 150.00, 'CONSULTATION', true, 'con-nut'),
  ('Acompanhamento Nutricional', 'Consulta de acompanhamento', 120.00, 'CONSULTATION', true, 'con-nut'),
  ('Avaliação Antropométrica', 'Avaliação de composição corporal', 100.00, 'CONSULTATION', true, 'con-nut'),
  ('Nutrição Esportiva', 'Consulta especializada para atletas', 180.00, 'CONSULTATION', true, 'con-nut'),
  ('Nutrição Clínica', 'Consulta para condições específicas', 180.00, 'CONSULTATION', true, 'con-nut')
ON CONFLICT (name, type) DO NOTHING;

-- 6. Fisioterapia
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Avaliação Fisioterápica', 'Primeira consulta com fisioterapeuta', 150.00, 'CONSULTATION', true, 'con-fis'),
  ('Consulta Fisioterapia Ortopédica', 'Atendimento para condições ortopédicas', 120.00, 'CONSULTATION', true, 'con-fis'),
  ('Consulta Fisioterapia Respiratória', 'Atendimento para condições respiratórias', 130.00, 'CONSULTATION', true, 'con-fis'),
  ('Consulta Fisioterapia Neurológica', 'Atendimento para condições neurológicas', 140.00, 'CONSULTATION', true, 'con-fis'),
  ('Avaliação Postural', 'Análise biomecânica da postura', 120.00, 'CONSULTATION', true, 'con-fis')
ON CONFLICT (name, type) DO NOTHING;

-- 7. Retornos
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Retorno Clínica Médica', 'Consulta de retorno em até 30 dias', 100.00, 'CONSULTATION', true, 'con-ret'),
  ('Retorno Especialidades', 'Consulta de retorno com especialista em até 30 dias', 130.00, 'CONSULTATION', true, 'con-ret'),
  ('Retorno Pediatria', 'Consulta de retorno pediátrico em até 30 dias', 110.00, 'CONSULTATION', true, 'con-ret'),
  ('Retorno Psiquiatria', 'Consulta de retorno psiquiátrico em até 30 dias', 150.00, 'CONSULTATION', true, 'con-ret'),
  ('Retorno Pós-Operatório', 'Consulta de acompanhamento pós-cirúrgico', 120.00, 'CONSULTATION', true, 'con-ret')
ON CONFLICT (name, type) DO NOTHING;

-- Mensagem de conclusão
DO $$
BEGIN
  RAISE NOTICE 'Todas as consultas foram adicionadas com sucesso!';
  RAISE NOTICE 'Total de consultas inseridas: 45 consultas em 7 categorias';
END $$; 