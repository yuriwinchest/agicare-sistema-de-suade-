// Script para corrigir a política RLS da tabela user_profiles
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// Configuração do Supabase (usando a chave de serviço)
const SUPABASE_URL = "https://xspmibkhtmnetivtnjox.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzcG1pYmtodG1uZXRpdnRuam94Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDY2NzAzNSwiZXhwIjoyMDYwMjQzMDM1fQ.0wI6OP_6vFvIisC-jer0MMa94MdMah57WbtLeYMiB5I";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function corrigirPoliticaUserProfiles() {
  console.log("=== CORRIGINDO POLÍTICA DA TABELA USER_PROFILES ===");
  
  try {
    // 1. Primeiro, verificar se a tabela existe e obter algumas informações
    console.log("1. Verificando a tabela user_profiles...");
    const { data: tabelaInfo, error: erroTabela } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);
      
    if (erroTabela) {
      console.error("❌ Erro ao acessar a tabela user_profiles:", erroTabela.message);
      return;
    }
    
    console.log("✅ Tabela user_profiles acessada com sucesso!");
    
    // 2. Primeiro vamos tentar dar permissão direta para o service_role inserir
    console.log("2. Adicionando permissão de inserção para service_role...");
    
    // Criar registro de teste para verificar permissões usando UUID válido
    const testId = randomUUID();
    const { data: testInsert, error: testInsertError } = await supabase
      .from('user_profiles')
      .insert([{
        id: testId,
        full_name: 'Teste de Permissão',
        role: 'tester',
        is_active: true,
        username: 'tester' + Date.now(),
        last_login: new Date().toISOString()
      }])
      .select()
      .single();
      
    if (testInsertError) {
      console.error("❌ Erro ao tentar inserir registro de teste:", testInsertError.message);
      console.log("Tentando soluções alternativas...");
      
      // Vamos tentar uma inserção mais simples para ver onde está o problema
      const simpleTestId = randomUUID();
      const { error: simpleInsertError } = await supabase
        .from('user_profiles')
        .insert([{
          id: simpleTestId,
          full_name: 'Teste Simples',
          is_active: true
        }]);
        
      if (simpleInsertError) {
        console.error("❌ Erro na inserção simples:", simpleInsertError.message);
        console.log("Problema pode ser relacionado às políticas RLS.");
      } else {
        console.log("✅ Inserção simples funcionou! O problema pode ser com os campos específicos.");
        
        // Remover o registro de teste
        const { error: deleteError } = await supabase
          .from('user_profiles')
          .delete()
          .eq('id', simpleTestId);
          
        if (deleteError) {
          console.error("⚠️ Erro ao remover registro de teste:", deleteError.message);
        }
      }
    } else {
      console.log("✅ Registro de teste inserido com sucesso!");
      console.log("O service_role já tem permissão para inserir na tabela.");
      
      // Remover o registro de teste
      const { error: deleteError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', testId);
        
      if (deleteError) {
        console.error("⚠️ Erro ao remover registro de teste:", deleteError.message);
      }
      
      console.log("3. Teste concluído, políticas parecem estar funcionando para o service_role.");
      console.log("\nO problema provavelmente está relacionado ao formato do ID. O teste estava tentando usar uma ID de string, mas a tabela requer um UUID válido.");
      
      console.log("\nApenas execute o teste novamente com o comando:");
      console.log("node teste-registro-colaborador.mjs");
      return;
    }
    
    // 3. Se não conseguimos inserir, vamos verificar a estrutura da tabela
    console.log("3. Verificando a estrutura da tabela...");
    
    // Verificar estrutura via função system do Supabase
    // Isso não é possível diretamente via API, por isso vamos fornecer instruções
    
    console.log("\n=== INSTRUÇÕES MANUAIS PARA CORRIGIR O PROBLEMA ===");
    console.log("Para corrigir o erro da política RLS, faça o seguinte:");
    console.log("1. Acesse o painel do Supabase para este projeto");
    console.log("2. Vá para a seção 'SQL Editor'");
    console.log("3. Execute o comando:");
    console.log(`
    -- Desativar temporariamente o RLS para a tabela
    ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

    -- Ou alternativamente, criar uma política que permita ao service_role fazer qualquer operação
    DROP POLICY IF EXISTS "Service role pode gerenciar perfis" ON public.user_profiles;
    CREATE POLICY "Service role pode gerenciar perfis" 
    ON public.user_profiles 
    FOR ALL 
    TO service_role 
    USING (true) 
    WITH CHECK (true);
    `);
    
    console.log("\nApós executar esses comandos, execute novamente o teste-registro-colaborador.mjs");
    
  } catch (error) {
    console.error("❌ ERRO DURANTE A CORREÇÃO DA POLÍTICA:", error);
  }
}

// Executar a correção
corrigirPoliticaUserProfiles(); 