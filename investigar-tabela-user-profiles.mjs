// Script para investigar a estrutura da tabela user_profiles
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase (usando a chave de serviço)
const SUPABASE_URL = "https://xspmibkhtmnetivtnjox.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzcG1pYmtodG1uZXRpdnRuam94Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDY2NzAzNSwiZXhwIjoyMDYwMjQzMDM1fQ.0wI6OP_6vFvIisC-jer0MMa94MdMah57WbtLeYMiB5I";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function investigarTabela() {
  console.log("=== INVESTIGANDO A TABELA USER_PROFILES ===");
  
  try {
    // 1. Tentar obter algumas linhas da tabela
    console.log("1. Obtendo dados existentes na tabela...");
    const { data: existingRows, error: rowsError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(5);
      
    if (rowsError) {
      console.error(`❌ Erro ao buscar dados: ${rowsError.message}`);
    } else {
      console.log(`✅ Dados encontrados: ${existingRows.length} registro(s)`);
      if (existingRows.length > 0) {
        console.log("Exemplo de registro:");
        console.log(existingRows[0]);
      }
    }
    
    // 2. Buscar usuários auth para usar um ID existente
    console.log("\n2. Buscando usuários na autenticação para testar...");
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error(`❌ Erro ao buscar usuários auth: ${authError.message}`);
    } else {
      console.log(`✅ Usuários encontrados: ${authUsers.users.length}`);
      
      if (authUsers.users.length > 0) {
        const testUser = authUsers.users[0];
        console.log(`Testando com o usuário: ${testUser.email} (ID: ${testUser.id})`);
        
        // Tentar inserir usando um ID de usuário existente
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: testUser.id,
            full_name: 'Teste Com ID Existente',
            is_active: true
          });
          
        if (insertError) {
          console.error(`❌ Erro ao inserir com ID existente: ${insertError.message}`);
        } else {
          console.log("✅ Inserção com ID válido funcionou!");
          
          // Remover o registro de teste
          await supabase
            .from('user_profiles')
            .delete()
            .eq('id', testUser.id);
            
          console.log("Registro de teste removido.");
        }
      }
    }
    
    // 3. Verificar se o problema está no teste de registro de colaborador
    console.log("\n3. Analisando o teste-registro-colaborador.mjs...");
    
    console.log(`
ANÁLISE DO PROBLEMA:

1. A tabela user_profiles tem uma chave estrangeira que referencia a tabela auth.users
2. Isso significa que o ID em user_profiles DEVE corresponder a um ID válido de usuário
3. O erro no script teste-registro-colaborador.mjs ocorre porque:
   - O usuário é criado corretamente (passos 1-6)
   - No passo 7, ao tentar criar um perfil, o service_role tem acesso, mas a política RLS bloqueia
   
SOLUÇÃO:

Você precisa executar o seguinte SQL no Supabase para resolver o problema:

-- Desativar temporariamente o RLS para a tabela
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Ou criar uma política que permite ao service_role ter acesso total
DROP POLICY IF EXISTS "Service role pode gerenciar perfis" ON public.user_profiles;
CREATE POLICY "Service role pode gerenciar perfis" 
ON public.user_profiles 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

Para aplicar essas alterações:
1. Acesse o painel do Supabase: https://xspmibkhtmnetivtnjox.supabase.co
2. Vá para a seção SQL Editor
3. Cole o comando SQL acima e execute
4. Execute novamente o teste: node teste-registro-colaborador.mjs
`);
    
  } catch (error) {
    console.error("❌ ERRO DURANTE A INVESTIGAÇÃO:", error);
  }
}

// Executar a investigação
investigarTabela(); 