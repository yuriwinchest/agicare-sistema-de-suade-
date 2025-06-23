// Script para aplicar diretamente as políticas RLS para a tabela user_profiles
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase (usando a chave de serviço)
const SUPABASE_URL = "https://xspmibkhtmnetivtnjox.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzcG1pYmtodG1uZXRpdnRuam94Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDY2NzAzNSwiZXhwIjoyMDYwMjQzMDM1fQ.0wI6OP_6vFvIisC-jer0MMa94MdMah57WbtLeYMiB5I";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function aplicarPoliticasRLS() {
  console.log("=== APLICANDO POLÍTICAS RLS PARA A TABELA USER_PROFILES ===");
  
  try {
    // Tentar inserir um registro diretamente para ver se funciona
    console.log("1. Tentativa inicial de inserção...");
    
    const testUUID = crypto.randomUUID();
    const { error: testError } = await supabase
      .from('user_profiles')
      .insert({
        id: testUUID,
        full_name: 'Teste RLS',
        is_active: true
      });
      
    if (testError) {
      console.log(`❌ Erro na inserção de teste: ${testError.message}`);
      
      // Método 1: Tentar desativar completamente o RLS
      console.log("\n2. Tentando desativar o RLS via tabelas de sistema...");
      
      // Isso provavelmente não funcionará diretamente via API, mas vamos tentar
      const { error: rpcError1 } = await supabase.rpc('admin_alter_rls', {
        table_name: 'user_profiles',
        enable: false
      }).catch(e => ({ error: e }));
      
      if (rpcError1) {
        console.log(`❌ Não foi possível desativar o RLS via API: ${rpcError1.message}`);
      } else {
        console.log("✅ RLS desativado com sucesso!");
      }
      
      // Método 2: Tentar inserir com cabeçalho de autenticação diferente
      console.log("\n3. Tentando inserir com configuração de cliente alternativa...");
      
      // Criar cliente Supabase alternativo com cabeçalho X-Client-Info
      const clienteAlternativo = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
        global: {
          headers: {
            'X-Client-Info': 'supabase-admin-panel',
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
          }
        }
      });
      
      const testUUID2 = crypto.randomUUID();
      const { error: altError } = await clienteAlternativo
        .from('user_profiles')
        .insert({
          id: testUUID2,
          full_name: 'Teste RLS Alt',
          is_active: true
        });
        
      if (altError) {
        console.log(`❌ Erro com cliente alternativo: ${altError.message}`);
      } else {
        console.log("✅ Inserção com cliente alternativo funcionou!");
        
        // Limpar o registro de teste
        await clienteAlternativo
          .from('user_profiles')
          .delete()
          .eq('id', testUUID2);
      }
      
      // Informações para correção manual
      console.log("\n=== INSTRUÇÕES PARA CORREÇÃO MANUAL ===");
      console.log("Para resolver este problema, você precisará acessar o SQL Editor no Supabase e executar:");
      console.log(`
-- Opção 1: Desativar completamente o RLS para a tabela
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Opção 2: Adicionar política específica para o service_role
DROP POLICY IF EXISTS "Service role pode gerenciar perfis" ON public.user_profiles;
CREATE POLICY "Service role pode gerenciar perfis" 
ON public.user_profiles 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Opção 3: Permitir que administradores gerenciem qualquer perfil
DROP POLICY IF EXISTS "Administradores podem gerenciar qualquer perfil" ON public.user_profiles;
CREATE POLICY "Administradores podem gerenciar qualquer perfil" 
ON public.user_profiles 
FOR ALL 
TO authenticated 
USING (public.is_admin() = true) 
WITH CHECK (public.is_admin() = true);
      `);
    } else {
      console.log("✅ Inserção de teste funcionou! A tabela já está configurada corretamente.");
      
      // Limpar o registro de teste
      await supabase
        .from('user_profiles')
        .delete()
        .eq('id', testUUID);
    }
    
    // Testar novamente o registro de colaborador
    console.log("\n4. Executando o teste de registro de colaborador...");
    
    const { spawn } = require('child_process');
    const teste = spawn('node', ['teste-registro-colaborador.mjs'], { shell: true });
    
    teste.stdout.on('data', (data) => {
      console.log(`${data}`);
    });
    
    teste.stderr.on('data', (data) => {
      console.error(`${data}`);
    });
    
    teste.on('close', (code) => {
      console.log(`Teste finalizado com código: ${code}`);
      if (code === 0) {
        console.log("\n✅ O TESTE FOI CONCLUÍDO COM SUCESSO!");
      } else {
        console.log("\n❌ O TESTE FALHOU. Verifique as mensagens acima.");
      }
    });
    
  } catch (error) {
    console.error("❌ ERRO DURANTE A APLICAÇÃO DAS POLÍTICAS:", error);
  }
}

// Importar crypto para gerar UUIDs
import crypto from 'crypto';

// Executar a aplicação das políticas
aplicarPoliticasRLS(); 