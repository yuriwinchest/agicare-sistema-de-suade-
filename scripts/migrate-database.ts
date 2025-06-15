import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/integrations/supabase/types';

// Configuração do banco de dados de origem (antigo)
const SOURCE_SUPABASE_URL = "https://xspmibkhtmnetivtnjox.supabase.co";
const SOURCE_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzcG1pYmtodG1uZXRpdnRuam94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NjcwMzUsImV4cCI6MjA2MDI0MzAzNX0.eOILz9zyxyM8i0ZJ3AHrjlWK1AFbf_MX2i62m3KNYsA";

// Configuração do banco de dados de destino (novo)
const TARGET_SUPABASE_URL = "https://xspmibkhtmnetivtnjox.supabase.co"; // Atualize com a URL correta
const TARGET_SUPABASE_KEY = "sbp_3bdcf0c2ccc8c0f86ee5d98202953e543c348f2b";

// Criando os clientes Supabase
const sourceClient = createClient<Database>(SOURCE_SUPABASE_URL, SOURCE_SUPABASE_KEY);
const targetClient = createClient<Database>(TARGET_SUPABASE_URL, TARGET_SUPABASE_KEY);

// Lista de tabelas para migrar
const tables = [
  'appointments',
  'categories',
  'collaborators',
  'comments',
  'departments',
  'health_professionals',
  'healthcare_units',
  'offline_sync_queue',
  'patient_logs',
  'patient_notes',
  'post_categories',
  'posts',
  'user_profiles',
  'users',
  'vital_signs'
];

async function migrateTable(tableName: string) {
  console.log(`\nMigrando tabela: ${tableName}`);
  try {
    // Buscar dados da tabela de origem
    const { data: sourceData, error: sourceError } = await sourceClient
      .from(tableName)
      .select('*');

    if (sourceError) {
      throw new Error(`Erro ao buscar dados da tabela ${tableName}: ${sourceError.message}`);
    }

    if (!sourceData || sourceData.length === 0) {
      console.log(`Tabela ${tableName} está vazia, pulando...`);
      return;
    }

    console.log(`Encontrados ${sourceData.length} registros para migrar`);

    // Inserir dados na tabela de destino
    const { error: insertError } = await targetClient
      .from(tableName)
      .insert(sourceData);

    if (insertError) {
      throw new Error(`Erro ao inserir dados na tabela ${tableName}: ${insertError.message}`);
    }

    console.log(`✅ Migração concluída para ${tableName}`);
  } catch (error) {
    console.error(`❌ Erro na migração da tabela ${tableName}:`, error);
  }
}

async function migrateTables() {
  console.log('Iniciando migração do banco de dados...');

  for (const table of tables) {
    await migrateTable(table);
  }

  console.log('\nMigração concluída!');
}

// Executar a migração
migrateTables()
  .catch(console.error)
  .finally(() => {
    console.log('Processo de migração finalizado');
    process.exit(0);
  });