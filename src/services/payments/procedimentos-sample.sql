-- Script para adicionar procedimentos médicos de exemplo ao sistema SaludoCare
-- Execute este script no Editor SQL do Supabase para popular o banco de dados

-- Primeiro, vamos garantir que as categorias de procedimentos existam
INSERT INTO "ServiceCategory" (id, name, description)
VALUES
  ('prc-crg', 'Cirurgias Ambulatoriais', 'Pequenas cirurgias realizadas em ambiente ambulatorial'),
  ('prc-cur', 'Curativos', 'Diferentes tipos de curativos médicos'),
  ('prc-apl', 'Aplicações', 'Aplicação de medicamentos, vacinas e outros injetáveis'),
  ('prc-fis', 'Fisioterapia', 'Procedimentos fisioterápicos diversos'),
  ('prc-ina', 'Inalações', 'Procedimentos de inaloterapia'),
  ('prc-est', 'Procedimentos Estéticos', 'Procedimentos estéticos diversos'),
  ('prc-out', 'Outros Procedimentos', 'Procedimentos não classificados nas outras categorias')
ON CONFLICT (id) DO UPDATE 
SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Agora, vamos adicionar procedimentos comuns para cada categoria
-- 1. Cirurgias Ambulatoriais
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Drenagem de Abscesso', 'Remoção de conteúdo purulento de abscesso superficial', 180.00, 'PROCEDURE', true, 'prc-crg'),
  ('Sutura Simples', 'Sutura de ferimentos superficiais com até 10 pontos', 150.00, 'PROCEDURE', true, 'prc-crg'),
  ('Exérese de Lesão Cutânea', 'Remoção cirúrgica de lesões cutâneas benignas', 250.00, 'PROCEDURE', true, 'prc-crg'),
  ('Cantoplastia', 'Cirurgia plástica nas pálpebras', 350.00, 'PROCEDURE', true, 'prc-crg'),
  ('Retirada de Corpo Estranho', 'Remoção de corpo estranho superficial', 120.00, 'PROCEDURE', true, 'prc-crg'),
  ('Incisão e Drenagem de Hematoma', 'Drenagem de coleção sanguínea', 180.00, 'PROCEDURE', true, 'prc-crg'),
  ('Biópsia de Pele', 'Coleta de fragmento de pele para análise', 220.00, 'PROCEDURE', true, 'prc-crg'),
  ('Retirada de Unha', 'Procedimento para retirada de unha', 200.00, 'PROCEDURE', true, 'prc-crg'),
  ('Cauterização Química', 'Aplicação de substâncias químicas para cauterização', 150.00, 'PROCEDURE', true, 'prc-crg')
ON CONFLICT (name, type) DO NOTHING;

-- 2. Curativos
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Curativo Simples', 'Limpeza e oclusão de ferida sem complicações', 60.00, 'PROCEDURE', true, 'prc-cur'),
  ('Curativo Médio', 'Limpeza e oclusão de feridas de média complexidade', 90.00, 'PROCEDURE', true, 'prc-cur'),
  ('Curativo Especial', 'Tratamento de feridas complexas com curativos especiais', 150.00, 'PROCEDURE', true, 'prc-cur'),
  ('Curativo de Úlcera', 'Tratamento específico para úlceras de pressão ou vasculares', 120.00, 'PROCEDURE', true, 'prc-cur'),
  ('Desbridamento de Ferida', 'Remoção de tecido necrosado ou desvitalizado', 180.00, 'PROCEDURE', true, 'prc-cur'),
  ('Troca de Dreno', 'Substituição de dreno cirúrgico', 100.00, 'PROCEDURE', true, 'prc-cur'),
  ('Curativo de Queimadura', 'Tratamento específico para lesões por queimadura', 130.00, 'PROCEDURE', true, 'prc-cur'),
  ('Aplicação de Bandagem Compressiva', 'Colocação de bandagens para tratamento vascular', 90.00, 'PROCEDURE', true, 'prc-cur')
ON CONFLICT (name, type) DO NOTHING;

-- 3. Aplicações
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Aplicação de Injeção IM', 'Administração de medicação intramuscular', 40.00, 'PROCEDURE', true, 'prc-apl'),
  ('Aplicação de Injeção EV', 'Administração de medicação endovenosa', 60.00, 'PROCEDURE', true, 'prc-apl'),
  ('Aplicação de Injeção SC', 'Administração de medicação subcutânea', 40.00, 'PROCEDURE', true, 'prc-apl'),
  ('Aplicação de Vacina', 'Administração de imunobiológicos', 50.00, 'PROCEDURE', true, 'prc-apl'),
  ('Hidratação Venosa', 'Reposição de fluidos por via endovenosa', 120.00, 'PROCEDURE', true, 'prc-apl'),
  ('Soroterapia', 'Administração de soro para hidratação ou medicação', 100.00, 'PROCEDURE', true, 'prc-apl'),
  ('Instilação Vesical', 'Administração de medicação diretamente na bexiga', 90.00, 'PROCEDURE', true, 'prc-apl'),
  ('Aplicação de Colírio', 'Administração de medicação oftálmica', 30.00, 'PROCEDURE', true, 'prc-apl')
ON CONFLICT (name, type) DO NOTHING;

-- 4. Fisioterapia
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Sessão de Fisioterapia Ortopédica', 'Tratamento para lesões musculoesqueléticas', 100.00, 'PROCEDURE', true, 'prc-fis'),
  ('Fisioterapia Respiratória', 'Tratamento para condições respiratórias', 110.00, 'PROCEDURE', true, 'prc-fis'),
  ('Drenagem Linfática', 'Técnica de massagem para estimular o sistema linfático', 120.00, 'PROCEDURE', true, 'prc-fis'),
  ('Fisioterapia Neurológica', 'Tratamento para distúrbios neurológicos', 130.00, 'PROCEDURE', true, 'prc-fis'),
  ('Eletroterapia', 'Uso de correntes elétricas para tratamento', 90.00, 'PROCEDURE', true, 'prc-fis'),
  ('Ultrassom Terapêutico', 'Aplicação de ultrassom para tratamento de lesões', 80.00, 'PROCEDURE', true, 'prc-fis'),
  ('Kinesiotaping', 'Aplicação de bandagem elástica terapêutica', 70.00, 'PROCEDURE', true, 'prc-fis'),
  ('RPG - Reeducação Postural Global', 'Método para correção postural', 150.00, 'PROCEDURE', true, 'prc-fis'),
  ('Pilates Terapêutico', 'Exercícios específicos para reabilitação', 120.00, 'PROCEDURE', true, 'prc-fis')
ON CONFLICT (name, type) DO NOTHING;

-- 5. Inalações
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Nebulização Simples', 'Inalação de medicamento com soro fisiológico', 40.00, 'PROCEDURE', true, 'prc-ina'),
  ('Nebulização com Medicação', 'Inalação com medicamentos broncodilatadores', 60.00, 'PROCEDURE', true, 'prc-ina'),
  ('Inalação com O2', 'Nebulização com oxigênio suplementar', 70.00, 'PROCEDURE', true, 'prc-ina'),
  ('Aerossolterapia', 'Inalação com aerossol dosimetrado', 50.00, 'PROCEDURE', true, 'prc-ina'),
  ('Inalação com Corticoide', 'Nebulização com corticosteroide inalatório', 75.00, 'PROCEDURE', true, 'prc-ina')
ON CONFLICT (name, type) DO NOTHING;

-- 6. Procedimentos Estéticos
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Aplicação de Toxina Botulínica', 'Aplicação para minimizar rugas e linhas de expressão', 600.00, 'PROCEDURE', true, 'prc-est'),
  ('Preenchimento Facial', 'Aplicação de ácido hialurônico para volumização', 800.00, 'PROCEDURE', true, 'prc-est'),
  ('Peeling Químico', 'Esfoliação química para renovação celular', 300.00, 'PROCEDURE', true, 'prc-est'),
  ('Microagulhamento', 'Indução de colágeno com microagulhas', 350.00, 'PROCEDURE', true, 'prc-est'),
  ('Radiofrequência', 'Tratamento para flacidez da pele', 250.00, 'PROCEDURE', true, 'prc-est'),
  ('Drenagem Linfática Facial', 'Massagem específica para redução de edema facial', 120.00, 'PROCEDURE', true, 'prc-est'),
  ('Limpeza de Pele Profunda', 'Remoção de impurezas e comedões', 180.00, 'PROCEDURE', true, 'prc-est')
ON CONFLICT (name, type) DO NOTHING;

-- 7. Outros Procedimentos
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Aferição de Pressão Arterial', 'Medição da pressão arterial', 20.00, 'PROCEDURE', true, 'prc-out'),
  ('Teste de Glicemia Capilar', 'Medição de glicose sanguínea', 25.00, 'PROCEDURE', true, 'prc-out'),
  ('Retirada de Pontos', 'Remoção de pontos de sutura', 60.00, 'PROCEDURE', true, 'prc-out'),
  ('Lavagem Auricular', 'Remoção de cerúmen do conduto auditivo', 80.00, 'PROCEDURE', true, 'prc-out'),
  ('Oxigenoterapia', 'Administração de oxigênio suplementar', 70.00, 'PROCEDURE', true, 'prc-out'),
  ('Sondagem Gástrica', 'Passagem de sonda nasogástrica', 100.00, 'PROCEDURE', true, 'prc-out'),
  ('Sondagem Vesical', 'Cateterismo vesical para drenagem de urina', 100.00, 'PROCEDURE', true, 'prc-out'),
  ('Eletrocardiograma', 'Exame para avaliação elétrica do coração', 120.00, 'PROCEDURE', true, 'prc-out'),
  ('Troca de Bolsa de Colostomia', 'Substituição de dispositivo para ostomizados', 80.00, 'PROCEDURE', true, 'prc-out')
ON CONFLICT (name, type) DO NOTHING;

-- Mensagem de conclusão
DO $$
BEGIN
  RAISE NOTICE 'Todos os procedimentos foram adicionados com sucesso!';
  RAISE NOTICE 'Total de procedimentos inseridos: 56 procedimentos em 7 categorias';
END $$; 