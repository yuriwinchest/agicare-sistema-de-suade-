-- Script para adicionar outros serviços médicos de exemplo ao sistema SaludoCare
-- Execute este script no Editor SQL do Supabase para popular o banco de dados

-- Primeiro, vamos garantir que existam categorias para outros serviços
INSERT INTO "ServiceCategory" (id, name, description)
VALUES
  ('out-pac', 'Pacotes', 'Pacotes de serviços combinados'),
  ('out-cer', 'Documentos e Certificados', 'Emissão de documentos médicos'),
  ('out-vac', 'Vacinas', 'Serviços de imunização'),
  ('out-est', 'Estética', 'Procedimentos estéticos não cirúrgicos'),
  ('out-tes', 'Testes Rápidos', 'Testes diagnósticos rápidos'),
  ('out-ger', 'Gerais', 'Outros serviços diversos')
ON CONFLICT (id) DO UPDATE 
SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Agora, vamos adicionar outros serviços
-- 1. Pacotes
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Check-up Básico', 'Consulta clínica, exames básicos de sangue e ECG', 350.00, 'OTHER', true, 'out-pac'),
  ('Check-up Completo', 'Consulta, exames de sangue, ECG, raio-x de tórax e ultrassom abdominal', 750.00, 'OTHER', true, 'out-pac'),
  ('Pacote Gestante', 'Consultas pré-natal e exames de acompanhamento', 1200.00, 'OTHER', true, 'out-pac'),
  ('Pacote Pós-Operatório', '3 consultas e curativos pós-cirúrgicos', 500.00, 'OTHER', true, 'out-pac'),
  ('Pacote Fisioterapia', '10 sessões de fisioterapia', 800.00, 'OTHER', true, 'out-pac')
ON CONFLICT (name, type) DO NOTHING;

-- 2. Documentos e Certificados
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Atestado Médico', 'Emissão de atestado médico', 50.00, 'OTHER', true, 'out-cer'),
  ('Laudo Médico', 'Elaboração de laudo médico detalhado', 120.00, 'OTHER', true, 'out-cer'),
  ('Relatório Médico', 'Relatório médico completo', 150.00, 'OTHER', true, 'out-cer'),
  ('Receita Médica', 'Emissão de receita médica sem consulta', 40.00, 'OTHER', true, 'out-cer'),
  ('Certificado de Aptidão Física', 'Avaliação e emissão de certificado', 150.00, 'OTHER', true, 'out-cer'),
  ('Certificado Internacional de Vacinação', 'Emissão de certificado internacional', 80.00, 'OTHER', true, 'out-cer')
ON CONFLICT (name, type) DO NOTHING;

-- 3. Vacinas
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Vacina Gripe', 'Imunização contra influenza sazonal', 120.00, 'OTHER', true, 'out-vac'),
  ('Vacina Hepatite A', 'Imunização contra hepatite A', 180.00, 'OTHER', true, 'out-vac'),
  ('Vacina Hepatite B', 'Imunização contra hepatite B', 150.00, 'OTHER', true, 'out-vac'),
  ('Vacina HPV', 'Imunização contra papilomavírus', 450.00, 'OTHER', true, 'out-vac'),
  ('Vacina Pneumocócica', 'Imunização contra pneumonia', 250.00, 'OTHER', true, 'out-vac'),
  ('Vacina Meningocócica', 'Imunização contra meningite', 280.00, 'OTHER', true, 'out-vac'),
  ('Vacina Febre Amarela', 'Imunização contra febre amarela', 120.00, 'OTHER', true, 'out-vac'),
  ('Vacina Antitetânica', 'Imunização contra tétano', 90.00, 'OTHER', true, 'out-vac')
ON CONFLICT (name, type) DO NOTHING;

-- 4. Estética
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Peeling Facial', 'Tratamento de renovação da pele', 220.00, 'OTHER', true, 'out-est'),
  ('Drenagem Linfática', 'Massagem para estimular o sistema linfático', 150.00, 'OTHER', true, 'out-est'),
  ('Tratamento de Manchas', 'Procedimento para clarear manchas na pele', 280.00, 'OTHER', true, 'out-est'),
  ('Tratamento para Acne', 'Procedimentos específicos para acne', 200.00, 'OTHER', true, 'out-est'),
  ('Hidratação Facial Profunda', 'Tratamento intensivo para hidratação da pele', 180.00, 'OTHER', true, 'out-est'),
  ('Rejuvenescimento Facial', 'Tratamento para redução de rugas e linhas de expressão', 350.00, 'OTHER', true, 'out-est')
ON CONFLICT (name, type) DO NOTHING;

-- 5. Testes Rápidos
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Teste Rápido COVID-19', 'Teste de antígeno para detecção de coronavírus', 120.00, 'OTHER', true, 'out-tes'),
  ('Teste Rápido HIV', 'Teste rápido para detecção de HIV', 80.00, 'OTHER', true, 'out-tes'),
  ('Teste Rápido Dengue', 'Teste para detecção de dengue', 90.00, 'OTHER', true, 'out-tes'),
  ('Teste de Gravidez', 'Teste rápido para detecção de gravidez', 50.00, 'OTHER', true, 'out-tes'),
  ('Teste de Intolerância Alimentar', 'Avaliação de intolerâncias alimentares', 280.00, 'OTHER', true, 'out-tes'),
  ('Teste Alérgico Cutâneo', 'Avaliação de alergias por teste cutâneo', 250.00, 'OTHER', true, 'out-tes')
ON CONFLICT (name, type) DO NOTHING;

-- 6. Gerais
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Segunda Via de Resultados', 'Emissão de nova via de resultados de exames', 30.00, 'OTHER', true, 'out-ger'),
  ('Locação de Muletas', 'Aluguel de muletas por 30 dias', 80.00, 'OTHER', true, 'out-ger'),
  ('Locação de Cadeira de Rodas', 'Aluguel de cadeira de rodas por 30 dias', 150.00, 'OTHER', true, 'out-ger'),
  ('Troca de Gesso', 'Substituição de imobilização com gesso', 120.00, 'OTHER', true, 'out-ger'),
  ('Remoção de Pontos', 'Procedimento para retirada de pontos cirúrgicos', 60.00, 'OTHER', true, 'out-ger'),
  ('Orientação Nutricional', 'Sessão de orientação sem consulta completa', 80.00, 'OTHER', true, 'out-ger'),
  ('Ajuste de Medicação', 'Consulta rápida para ajuste medicamentoso', 100.00, 'OTHER', true, 'out-ger')
ON CONFLICT (name, type) DO NOTHING;

-- Mensagem de conclusão
DO $$
BEGIN
  RAISE NOTICE 'Todos os outros serviços foram adicionados com sucesso!';
  RAISE NOTICE 'Total de outros serviços inseridos: 38 serviços em 6 categorias';
END $$; 