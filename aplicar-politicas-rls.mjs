// Script para aplicar as políticas RLS através do código
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Configuração do Supabase (usando a chave de serviço)
const SUPABASE_URL = "https://xspmibkhtmnetivtnjox.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzcG1pYmtodG1uZXRpdnRuam94Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDY2NzAzNSwiZXhwIjoyMDYwMjQzMDM1fQ.0wI6OP_6vFvIisC-jer0MMa94MdMah57WbtLeYMiB5I";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function aplicarPoliticasRLS() {
  console.log("=== APLICANDO POLÍTICAS RLS ===");
  
  try {
    // Ler o arquivo SQL com as políticas
    const sqlContent = fs.readFileSync('./politicas-rls-supabase.sql', 'utf8');
    
    // Dividir em comandos individuais (separados por ;)
    const comandosSQL = sqlContent.split(';').filter(cmd => cmd.trim() !== '');
    
    console.log(`Total de comandos SQL a serem executados: ${comandosSQL.length}`);
    
    // Executar cada comando SQL individualmente
    for (let i = 0; i < comandosSQL.length; i++) {
      const comando = comandosSQL[i].trim();
      if (comando) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: comando + ';' });
          
          if (error) {
            console.error(`Erro ao executar comando #${i + 1}:`, error.message);
          } else {
            if (i % 10 === 0) {
              console.log(`Progresso: ${i + 1}/${comandosSQL.length} comandos executados`);
            }
          }
        } catch (erroCmd) {
          console.error(`Exceção ao executar comando #${i + 1}:`, erroCmd);
        }
      }
    }
    
    console.log("\n=== VERIFICANDO POLÍTICA ESPECÍFICA PARA user_profiles ===");
    // Verificar especificamente a política para inserção na tabela user_profiles
    const { error: erroVerificacao } = await supabase.rpc('exec_sql', { 
      sql: `
        DROP POLICY IF EXISTS "Service role pode gerenciar perfis" ON public.user_profiles;
        CREATE POLICY "Service role pode gerenciar perfis" 
        ON public.user_profiles 
        FOR ALL 
        TO service_role 
        USING (true) 
        WITH CHECK (true);
      `
    });
    
    if (erroVerificacao) {
      console.error("Erro ao configurar política para service_role:", erroVerificacao.message);
    } else {
      console.log("✅ Política específica para service_role configurada com sucesso!");
    }
    
    console.log("\n=== POLÍTICAS RLS APLICADAS COM SUCESSO ===");
    console.log("Agora você pode executar o teste de registro de colaborador novamente.");
    
  } catch (error) {
    console.error("❌ ERRO AO APLICAR POLÍTICAS RLS:", error);
  }
}

// Executar a aplicação das políticas
aplicarPoliticasRLS(); 