// Script para criar e executar uma função personalizada no Supabase
// que aplica as políticas RLS para a tabela user_profiles
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase (usando a chave de serviço)
const SUPABASE_URL = "https://xspmibkhtmnetivtnjox.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzcG1pYmtodG1uZXRpdnRuam94Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDY2NzAzNSwiZXhwIjoyMDYwMjQzMDM1fQ.0wI6OP_6vFvIisC-jer0MMa94MdMah57WbtLeYMiB5I";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function aplicarPoliticasRLS() {
  console.log("=== APLICANDO POLÍTICAS RLS VIA FUNÇÃO PERSONALIZADA ===");
  
  try {
    // 1. Criar uma função PostgreSQL que aplica as políticas RLS
    console.log("1. Criando função SQL personalizada...");
    
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION apply_user_profiles_rls()
      RETURNS TEXT AS $$
      DECLARE
        result TEXT;
      BEGIN
        -- Desativar RLS para a tabela user_profiles
        ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
        
        -- Adicionar política para o service_role
        DROP POLICY IF EXISTS "Service role pode gerenciar perfis" ON public.user_profiles;
        CREATE POLICY "Service role pode gerenciar perfis" 
        ON public.user_profiles 
        FOR ALL 
        TO service_role 
        USING (true) 
        WITH CHECK (true);
        
        -- Adicionar política para administradores
        DROP POLICY IF EXISTS "Administradores podem gerenciar qualquer perfil" ON public.user_profiles;
        CREATE POLICY "Administradores podem gerenciar qualquer perfil" 
        ON public.user_profiles 
        FOR ALL 
        TO authenticated 
        USING (public.is_admin() = true) 
        WITH CHECK (public.is_admin() = true);
        
        result := 'Políticas RLS aplicadas com sucesso';
        RETURN result;
      EXCEPTION
        WHEN OTHERS THEN
          result := 'Erro ao aplicar políticas: ' || SQLERRM;
          RETURN result;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    
    // 2. Executar a função como uma RPC
    console.log("2. Tentando executar a função...");
    
    // Infelizmente não podemos criar funções diretamente via API
    // Então vamos exibir instruções para o usuário
    
    console.log(`
⚠️ IMPORTANTE: Não é possível criar funções PostgreSQL diretamente via API.
Você precisa fazer isso manualmente através do SQL Editor no Supabase.

INSTRUÇÕES:

1. Acesse o painel do Supabase em: https://xspmibkhtmnetivtnjox.supabase.co
2. Vá para a seção "SQL Editor"
3. Copie e cole o SQL abaixo e execute:

-- OPÇÃO 1: Desativar o RLS completamente
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- OPÇÃO 2: Criar política para service_role (recomendado)
DROP POLICY IF EXISTS "Service role pode gerenciar perfis" ON public.user_profiles;
CREATE POLICY "Service role pode gerenciar perfis" 
ON public.user_profiles 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- OPÇÃO 3: Adicionar política para administradores
DROP POLICY IF EXISTS "Administradores podem gerenciar qualquer perfil" ON public.user_profiles;
CREATE POLICY "Administradores podem gerenciar qualquer perfil" 
ON public.user_profiles 
FOR ALL 
TO authenticated 
USING (public.is_admin() = true) 
WITH CHECK (public.is_admin() = true);

4. Após executar o SQL, execute novamente o teste:
   node teste-registro-colaborador.mjs
`);
    
    // 3. Verificar se já existe algum teste de perfil para o colaborador
    console.log("\n3. Verificando se já existe perfil para o colaborador de teste...");
    
    const { data: colaboradorData, error: colaboradorError } = await supabase
      .from('collaborators')
      .select('*')
      .eq('email', 'teste-colaborador@example.com')
      .maybeSingle();
      
    if (colaboradorError) {
      console.error(`❌ Erro ao verificar colaborador: ${colaboradorError.message}`);
    } else if (colaboradorData) {
      console.log(`✅ Colaborador encontrado: ${colaboradorData.id}`);
      
      // Verificar se já existe um usuário auth
      const { data: authData } = await supabase.auth.admin.listUsers();
      const testUser = authData.users.find(u => u.email === 'teste-colaborador@example.com');
      
      if (testUser) {
        console.log(`✅ Usuário auth encontrado: ${testUser.id}`);
        
        // Verificar se já existe um perfil
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', testUser.id)
          .maybeSingle();
          
        if (profileError) {
          console.error(`❌ Erro ao verificar perfil: ${profileError.message}`);
        } else if (profileData) {
          console.log(`✅ Perfil já existe para o usuário: ${profileData.id}`);
          console.log("Você pode continuar com o teste normalmente.");
        } else {
          console.log("❌ Perfil não encontrado para o usuário de teste.");
          console.log("Após aplicar as políticas RLS, o teste irá criar um perfil automaticamente.");
        }
      }
    }
    
  } catch (error) {
    console.error("❌ ERRO GERAL:", error);
  }
}

// Executar o script
aplicarPoliticasRLS(); 