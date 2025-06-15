-- Script para adicionar exames médicos de exemplo ao sistema SaludoCare
-- Execute este script no Editor SQL do Supabase para popular o banco de dados

-- Primeiro, vamos garantir que as categorias de exames existam
INSERT INTO "ServiceCategory" (id, name, description)
VALUES
  ('exm-img', 'Exames de Imagem', 'Raio-X, Tomografia, Ressonância, Ultrassonografia'),
  ('exm-lab', 'Exames Laboratoriais', 'Análises clínicas, exames de sangue, urina e outros'),
  ('exm-car', 'Exames Cardiológicos', 'ECG, Holter, MAPA, Teste Ergométrico'),
  ('exm-neu', 'Exames Neurológicos', 'EEG, EMG, Potencial Evocado'),
  ('exm-end', 'Exames Endoscópicos', 'Colonoscopia, Endoscopia Digestiva, Broncoscopia'),
  ('exm-oft', 'Exames Oftalmológicos', 'Mapeamento de Retina, Tonometria, Campimetria'),
  ('exm-aud', 'Exames Audiológicos', 'Audiometria, Impedanciometria'),
  ('exm-out', 'Outros Exames', 'Demais exames não classificados nas outras categorias')
ON CONFLICT (id) DO UPDATE 
SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Agora, vamos adicionar exames comuns para cada categoria
-- 1. Exames de Imagem
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Raio-X de Tórax', 'Radiografia para avaliação pulmonar e cardíaca', 120.00, 'EXAM', true, 'exm-img'),
  ('Raio-X de Coluna Lombar', 'Radiografia para avaliação da coluna lombar', 150.00, 'EXAM', true, 'exm-img'),
  ('Raio-X de Crânio', 'Radiografia para avaliação do crânio', 130.00, 'EXAM', true, 'exm-img'),
  ('Raio-X de Membros Superiores', 'Radiografia de braços e mãos', 120.00, 'EXAM', true, 'exm-img'),
  ('Raio-X de Membros Inferiores', 'Radiografia de pernas e pés', 120.00, 'EXAM', true, 'exm-img'),
  ('Ultrassonografia Abdominal Total', 'Exame de ultrassom dos órgãos abdominais', 250.00, 'EXAM', true, 'exm-img'),
  ('Ultrassonografia Pélvica', 'Exame de ultrassom da região pélvica', 220.00, 'EXAM', true, 'exm-img'),
  ('Ultrassonografia de Tireoide', 'Exame de ultrassom da glândula tireoide', 200.00, 'EXAM', true, 'exm-img'),
  ('Ultrassonografia Transvaginal', 'Exame de ultrassom via transvaginal', 230.00, 'EXAM', true, 'exm-img'),
  ('Ultrassonografia Mamária', 'Exame de ultrassom das mamas', 230.00, 'EXAM', true, 'exm-img'),
  ('Ultrassonografia Obstétrica', 'Exame de ultrassom para gestantes', 240.00, 'EXAM', true, 'exm-img'),
  ('Tomografia de Crânio', 'Tomografia computadorizada do crânio', 450.00, 'EXAM', true, 'exm-img'),
  ('Tomografia de Tórax', 'Tomografia computadorizada do tórax', 480.00, 'EXAM', true, 'exm-img'),
  ('Tomografia de Abdome', 'Tomografia computadorizada do abdome', 500.00, 'EXAM', true, 'exm-img'),
  ('Ressonância Magnética de Crânio', 'Ressonância magnética do crânio', 800.00, 'EXAM', true, 'exm-img'),
  ('Ressonância Magnética de Coluna', 'Ressonância magnética da coluna vertebral', 850.00, 'EXAM', true, 'exm-img'),
  ('Ressonância Magnética de Joelho', 'Ressonância magnética da articulação do joelho', 750.00, 'EXAM', true, 'exm-img'),
  ('Densitometria Óssea', 'Exame para avaliação da densidade óssea', 180.00, 'EXAM', true, 'exm-img'),
  ('Mamografia', 'Exame radiológico das mamas', 220.00, 'EXAM', true, 'exm-img')
ON CONFLICT (name, type) DO NOTHING;

-- 2. Exames Laboratoriais
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Hemograma Completo', 'Análise dos componentes sanguíneos', 45.00, 'EXAM', true, 'exm-lab'),
  ('Glicemia de Jejum', 'Medição de glicose sanguínea em jejum', 25.00, 'EXAM', true, 'exm-lab'),
  ('Colesterol Total e Frações', 'Perfil lipídico completo', 60.00, 'EXAM', true, 'exm-lab'),
  ('Triglicerídeos', 'Dosagem de triglicerídeos no sangue', 30.00, 'EXAM', true, 'exm-lab'),
  ('Ureia e Creatinina', 'Avaliação da função renal', 40.00, 'EXAM', true, 'exm-lab'),
  ('TGO e TGP', 'Avaliação da função hepática', 40.00, 'EXAM', true, 'exm-lab'),
  ('TSH e T4 Livre', 'Avaliação da função da tireoide', 70.00, 'EXAM', true, 'exm-lab'),
  ('Ácido Úrico', 'Dosagem de ácido úrico no sangue', 25.00, 'EXAM', true, 'exm-lab'),
  ('Hemoglobina Glicada', 'Controle glicêmico de longo prazo', 50.00, 'EXAM', true, 'exm-lab'),
  ('PSA Total e Livre', 'Exame preventivo para câncer de próstata', 80.00, 'EXAM', true, 'exm-lab'),
  ('Beta HCG', 'Teste de gravidez sanguíneo', 55.00, 'EXAM', true, 'exm-lab'),
  ('Coagulograma', 'Avaliação da coagulação sanguínea', 60.00, 'EXAM', true, 'exm-lab'),
  ('Vitamina D', 'Dosagem de vitamina D no sangue', 90.00, 'EXAM', true, 'exm-lab'),
  ('Vitamina B12', 'Dosagem de vitamina B12 no sangue', 70.00, 'EXAM', true, 'exm-lab'),
  ('Ferritina', 'Avaliação das reservas de ferro', 60.00, 'EXAM', true, 'exm-lab'),
  ('PCR Ultrassensível', 'Proteína C Reativa como marcador inflamatório', 45.00, 'EXAM', true, 'exm-lab'),
  ('Urina Tipo I', 'Exame de urina para avaliação básica', 30.00, 'EXAM', true, 'exm-lab'),
  ('Urocultura', 'Cultura de urina para identificação de infecções', 60.00, 'EXAM', true, 'exm-lab'),
  ('Parasitológico de Fezes', 'Pesquisa de parasitas intestinais', 35.00, 'EXAM', true, 'exm-lab'),
  ('VDRL', 'Teste para sífilis', 30.00, 'EXAM', true, 'exm-lab'),
  ('Anti-HIV', 'Teste para HIV', 45.00, 'EXAM', true, 'exm-lab'),
  ('Hepatite B e C', 'Sorologia para hepatites virais', 120.00, 'EXAM', true, 'exm-lab'),
  ('Hemograma + Plaquetas', 'Contagem completa de células sanguíneas', 55.00, 'EXAM', true, 'exm-lab')
ON CONFLICT (name, type) DO NOTHING;

-- 3. Exames Cardiológicos
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Eletrocardiograma (ECG)', 'Registro da atividade elétrica do coração', 80.00, 'EXAM', true, 'exm-car'),
  ('Teste Ergométrico', 'Avaliação cardíaca durante exercício físico', 250.00, 'EXAM', true, 'exm-car'),
  ('Ecocardiograma', 'Ultrassom do coração', 320.00, 'EXAM', true, 'exm-car'),
  ('Holter 24h', 'Monitoramento cardíaco por 24 horas', 280.00, 'EXAM', true, 'exm-car'),
  ('MAPA', 'Monitoramento ambulatorial da pressão arterial', 270.00, 'EXAM', true, 'exm-car'),
  ('Ecocardiograma com Doppler', 'Ultrassom cardíaco com avaliação do fluxo sanguíneo', 380.00, 'EXAM', true, 'exm-car'),
  ('Ecocardiograma Transesofágico', 'Ultrassom do coração via esôfago', 650.00, 'EXAM', true, 'exm-car')
ON CONFLICT (name, type) DO NOTHING;

-- 4. Exames Neurológicos
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Eletroencefalograma (EEG)', 'Registro da atividade elétrica cerebral', 250.00, 'EXAM', true, 'exm-neu'),
  ('Eletroneuromiografia', 'Avaliação da função nervosa e muscular', 350.00, 'EXAM', true, 'exm-neu'),
  ('Potencial Evocado Visual', 'Avaliação da via visual', 300.00, 'EXAM', true, 'exm-neu'),
  ('Potencial Evocado Auditivo', 'Avaliação da via auditiva', 300.00, 'EXAM', true, 'exm-neu'),
  ('EEG com Mapeamento Cerebral', 'Eletroencefalograma com mapeamento', 380.00, 'EXAM', true, 'exm-neu'),
  ('Polissonografia', 'Estudo do sono', 650.00, 'EXAM', true, 'exm-neu')
ON CONFLICT (name, type) DO NOTHING;

-- 5. Exames Endoscópicos
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Endoscopia Digestiva Alta', 'Exame do esôfago, estômago e duodeno', 450.00, 'EXAM', true, 'exm-end'),
  ('Colonoscopia', 'Exame do intestino grosso', 800.00, 'EXAM', true, 'exm-end'),
  ('Broncoscopia', 'Exame das vias aéreas', 700.00, 'EXAM', true, 'exm-end'),
  ('Colangiopancreatografia', 'Exame das vias biliares e pancreáticas', 950.00, 'EXAM', true, 'exm-end'),
  ('Cistoscopia', 'Exame endoscópico da bexiga', 550.00, 'EXAM', true, 'exm-end'),
  ('Histeroscopia', 'Exame endoscópico do útero', 600.00, 'EXAM', true, 'exm-end'),
  ('Retossigmoidoscopia', 'Exame da porção final do intestino', 450.00, 'EXAM', true, 'exm-end')
ON CONFLICT (name, type) DO NOTHING;

-- 6. Exames Oftalmológicos
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Mapeamento de Retina', 'Avaliação da retina ocular', 120.00, 'EXAM', true, 'exm-oft'),
  ('Tonometria', 'Medição da pressão intraocular', 80.00, 'EXAM', true, 'exm-oft'),
  ('Campimetria Computadorizada', 'Avaliação do campo visual', 180.00, 'EXAM', true, 'exm-oft'),
  ('Paquimetria', 'Medição da espessura da córnea', 130.00, 'EXAM', true, 'exm-oft'),
  ('Retinografia', 'Fotografia da retina', 150.00, 'EXAM', true, 'exm-oft'),
  ('Topografia Corneana', 'Mapeamento da córnea', 200.00, 'EXAM', true, 'exm-oft'),
  ('Angiografia Fluoresceínica', 'Avaliação dos vasos da retina', 350.00, 'EXAM', true, 'exm-oft')
ON CONFLICT (name, type) DO NOTHING;

-- 7. Exames Audiológicos
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Audiometria', 'Avaliação da audição', 120.00, 'EXAM', true, 'exm-aud'),
  ('Impedanciometria', 'Avaliação da mobilidade do tímpano', 100.00, 'EXAM', true, 'exm-aud'),
  ('Emissões Otoacústicas', 'Teste da função coclear', 160.00, 'EXAM', true, 'exm-aud'),
  ('BERA', 'Avaliação do tronco cerebral auditivo', 280.00, 'EXAM', true, 'exm-aud'),
  ('Teste Vestibular', 'Avaliação do equilíbrio', 250.00, 'EXAM', true, 'exm-aud')
ON CONFLICT (name, type) DO NOTHING;

-- 8. Outros Exames
INSERT INTO "ServicePrice" (name, description, price, type, active, categoryId)
VALUES
  ('Espirometria', 'Avaliação da função pulmonar', 150.00, 'EXAM', true, 'exm-out'),
  ('Teste Ergométrico', 'Avaliação cardiovascular sob esforço', 250.00, 'EXAM', true, 'exm-out'),
  ('Prova de Função Pulmonar', 'Teste completo da função respiratória', 200.00, 'EXAM', true, 'exm-out'),
  ('Eletronistagmografia', 'Avaliação do labirinto', 220.00, 'EXAM', true, 'exm-out'),
  ('Urofluxometria', 'Avaliação do fluxo urinário', 180.00, 'EXAM', true, 'exm-out'),
  ('Colposcopia', 'Exame do colo do útero', 200.00, 'EXAM', true, 'exm-out'),
  ('Vulvoscopia', 'Exame da vulva', 190.00, 'EXAM', true, 'exm-out'),
  ('Peniscopia', 'Exame do pênis', 200.00, 'EXAM', true, 'exm-out'),
  ('Dermatoscopia', 'Exame detalhado da pele', 120.00, 'EXAM', true, 'exm-out'),
  ('Teste de Alergias', 'Avaliação de sensibilidade alérgica', 250.00, 'EXAM', true, 'exm-out')
ON CONFLICT (name, type) DO NOTHING;

-- Mensagem de conclusão
DO $$
BEGIN
  RAISE NOTICE 'Todos os exames foram adicionados com sucesso!';
  RAISE NOTICE 'Total de exames inseridos: 84 exames em 8 categorias';
END $$; 