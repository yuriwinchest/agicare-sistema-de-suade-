// Script para listar as tabelas do Supabase
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase (usando as credenciais fornecidas)
const SUPABASE_URL = "https://xspmibkhtmnetivtnjox.supabase.co";
// Usando a chave de serviço para acesso administrativo
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzcG1pYmtodG1uZXRpdnRuam94Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDY2NzAzNSwiZXhwIjoyMDYwMjQzMDM1fQ.0wI6OP_6vFvIisC-jer0MMa94MdMah57WbtLeYMiB5I";

// Criar cliente Supabase com a chave de serviço
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function listarTabelas() {
  console.log("=== LISTAGEM DE TABELAS DO SUPABASE ===");
  console.log(`URL: ${SUPABASE_URL}`);
  console.log("\nUtilizando chave de serviço para acesso administrativo...");

  try {
    // Verificar se estamos autenticados
    const { data: sessionData } = await supabase.auth.getSession();
    
    // Listar tabelas via consulta SQL
    const { data: tabelas, error } = await supabase
      .from('pg_catalog.pg_tables')
      .select('tablename, schemaname')
      .eq('schemaname', 'public');
    
    if (error) {
      console.error("Erro ao consultar tabelas:", error.message);
      
      // Tentar abordagem alternativa - listar via rpc
      console.log("Tentando abordagem alternativa...");
      
      // Executar consulta SQL para listar tabelas
      const { data, error: sqlError } = await supabase.rpc('execute_sql', {
        sql_query: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
      });
      
      if (sqlError || !data) {
        // Usar método de inspeção do Postgres diretamente
        const { data: pgData, error: pgError } = await supabase
          .from('_tables')
          .select('*');
          
        if (pgError) {
          console.log("Extraindo tabelas a partir dos tipos TypeScript encontrados no projeto...");
          
          // Baseado no arquivo types.ts, listar as tabelas conhecidas
          const tabelasConhecidas = [
            'appointments',
            'categories',
            'collaborators',
            'comments',
            'departments',
            'exam_results',
            'health_professionals',
            'healthcare_units',
            'medical_records',
            'nursing_records',
            'offline_sync_queue',
            'patient_logs',
            'patient_notes',
            'patients',
            'post_categories',
            'posts',
            'schedules',
            'user_profiles',
            'users',
            'vital_signs'
          ];
          
          console.log("\n=== TABELAS ENCONTRADAS (a partir do arquivo types.ts) ===");
          tabelasConhecidas.forEach((tabela, index) => {
            console.log(`${index + 1}. ${tabela}`);
          });
          
          // Verificar quais tabelas são acessíveis com a chave de serviço
          console.log("\nVerificando acesso às tabelas (usando service role)...");
          
          const resultados = [];
          
          for (const tabela of tabelasConhecidas) {
            const { data, error } = await supabase
              .from(tabela)
              .select('*')
              .limit(1);
            
            const contagem = { data: null, error: null };
            
            if (!error) {
              // Se conseguiu acessar, contar registros
              const { count, error: countError } = await supabase
                .from(tabela)
                .select('*', { count: 'exact', head: true });
                
              contagem.data = countError ? null : count;
              contagem.error = countError;
            }
            
            resultados.push({
              tabela,
              acessivel: !error,
              contagem: contagem.data
            });
            
            console.log(`- ${tabela}: ${!error ? '✅ Acessível' : '❌ Acesso negado ou não existe'}${!error && contagem.data !== null ? ` (${contagem.data} registros)` : ''}`);
          }
          
          // Mostrar resumo
          console.log("\n=== RESUMO ===");
          console.log(`Total de tabelas: ${tabelasConhecidas.length}`);
          console.log(`Tabelas acessíveis: ${resultados.filter(r => r.acessivel).length}`);
          console.log(`Tabelas inacessíveis: ${resultados.filter(r => !r.acessivel).length}`);
        } else {
          // Exibir as tabelas encontradas via _tables
          console.log("\n=== TABELAS ENCONTRADAS ===");
          pgData.forEach((tabela, index) => {
            console.log(`${index + 1}. ${tabela.name}`);
          });
        }
      } else {
        // Exibir as tabelas encontradas via SQL
        console.log("\n=== TABELAS ENCONTRADAS ===");
        data.forEach((item, index) => {
          console.log(`${index + 1}. ${item.table_name}`);
        });
      }
    } else {
      // Exibir as tabelas encontradas
      console.log("\n=== TABELAS ENCONTRADAS ===");
      tabelas.forEach((tabela, index) => {
        console.log(`${index + 1}. ${tabela.tablename}`);
      });
    }
  } catch (error) {
    console.error("\n❌ Erro ao listar tabelas:", error.message);
  }
}

// Executar a função
listarTabelas(); 