// Script para diagnosticar problemas de conexão com o Supabase
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

// Configuração do Supabase
const SUPABASE_URL = "https://xspmibkhtmnetivtnjox.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzcG1pYmtodG1uZXRpdnRuam94Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDY2NzAzNSwiZXhwIjoyMDYwMjQzMDM1fQ.0wI6OP_6vFvIisC-jer0MMa94MdMah57WbtLeYMiB5I";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzcG1pYmtodG1uZXRpdnRuam94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NjcwMzUsImV4cCI6MjA2MDI0MzAzNX0.eOILz9zyxyM8i0ZJ3AHrjlWK1AFbf_MX2i62m3KNYsA";

const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TESTE_EMAIL = "teste-colaborador@example.com";
const TESTE_SENHA = "senha123teste";

async function diagnosticarConexao() {
  console.log("=== DIAGNÓSTICO DE CONEXÃO COM SUPABASE ===");
  console.log(`URL do Supabase: ${SUPABASE_URL}`);
  
  try {
    // Teste 1: Verificar se o servidor está acessível
    console.log("\n1. Verificando se o servidor Supabase está acessível...");
    
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      
      if (response.ok) {
        console.log("✅ Servidor Supabase está acessível");
        console.log(`   Status HTTP: ${response.status} ${response.statusText}`);
        
        // Analisar os cabeçalhos da resposta para possíveis problemas
        const headers = response.headers;
        console.log("   Cabeçalhos importantes da resposta:");
        console.log(`   - Content-Type: ${headers.get('content-type')}`);
        console.log(`   - Server: ${headers.get('server')}`);
        console.log(`   - Access-Control-Allow-Origin: ${headers.get('access-control-allow-origin')}`);
      } else {
        console.error("❌ Servidor Supabase retornou status de erro");
        console.error(`   Status HTTP: ${response.status} ${response.statusText}`);
        try {
          const errorText = await response.text();
          console.error(`   Resposta: ${errorText.substring(0, 200)}...`);
        } catch (e) {
          console.error("   Não foi possível ler a resposta de erro");
        }
      }
    } catch (error) {
      console.error("❌ Erro ao acessar o servidor Supabase:", error.message);
    }
    
    // Teste 2: Verificar autenticação anônima
    console.log("\n2. Verificando autenticação anônima...");
    
    const { data: anonData, error: anonError } = await anonClient
      .from('collaborators')
      .select('count')
      .limit(1)
      .single();
      
    if (anonError) {
      if (anonError.code === 'PGRST301' || anonError.message.includes('permission denied')) {
        console.log("ℹ️ Acesso anônimo restrito por RLS (normal):", anonError.message);
      } else {
        console.error("❌ Erro no acesso anônimo:", anonError.message);
      }
    } else {
      console.log("✅ Acesso anônimo funcionando sem restrições (verifique RLS)");
    }
    
    // Teste 3: Verificar autenticação com usuário de teste
    console.log("\n3. Verificando autenticação com usuário de teste...");
    
    try {
      const { data: authData, error: authError } = await anonClient.auth.signInWithPassword({
        email: TESTE_EMAIL,
        password: TESTE_SENHA
      });
      
      if (authError) {
        console.error("❌ Erro ao autenticar com usuário de teste:", authError.message);
      } else if (authData.session) {
        console.log("✅ Autenticação com usuário de teste bem-sucedida");
        console.log(`   Usuário: ${authData.user.email}`);
        console.log(`   Expiração do token: ${new Date(authData.session.expires_at * 1000).toLocaleString()}`);
        
        // Teste 3.1: Verificar acesso aos dados com usuário autenticado
        const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          global: {
            headers: {
              Authorization: `Bearer ${authData.session.access_token}`
            }
          }
        });
        
        console.log("\n   Verificando acesso aos dados com token de usuário...");
        const { data: userData, error: userError } = await userClient
          .from('collaborators')
          .select('*')
          .eq('email', TESTE_EMAIL)
          .single();
          
        if (userError) {
          console.error("   ❌ Erro ao acessar dados com usuário autenticado:", userError.message);
        } else {
          console.log("   ✅ Acesso aos dados com usuário autenticado funcionando");
        }
      }
    } catch (error) {
      console.error("❌ Erro durante tentativa de autenticação:", error.message);
    }
    
    // Teste 4: Verificar acesso com chave de serviço
    console.log("\n4. Verificando acesso com chave de serviço...");
    
    const { data: adminData, error: adminError } = await adminClient
      .from('collaborators')
      .select('count')
      .limit(1)
      .single();
      
    if (adminError) {
      console.error("❌ Erro no acesso com chave de serviço:", adminError.message);
    } else {
      console.log("✅ Acesso com chave de serviço funcionando corretamente");
    }
    
    // Teste 5: Verificar tabelas críticas
    console.log("\n5. Verificando tabelas críticas...");
    
    const tabelasCriticas = ['collaborators', 'user_profiles', 'patients', 'appointments'];
    
    for (const tabela of tabelasCriticas) {
      try {
        const { data, error } = await adminClient
          .from(tabela)
          .select('count')
          .limit(1)
          .single();
          
        if (error) {
          console.error(`   ❌ Erro ao acessar tabela '${tabela}':`, error.message);
        } else {
          console.log(`   ✅ Tabela '${tabela}' acessível`);
        }
      } catch (error) {
        console.error(`   ❌ Exceção ao acessar tabela '${tabela}':`, error.message);
      }
    }
    
    // Teste 6: Verificar políticas RLS
    console.log("\n6. Verificando políticas RLS...");
    
    try {
      const { data: rlsData, error: rlsError } = await adminClient.rpc('test_rls_policies');
      if (rlsError) {
        console.log("   ⚠️ Função RPC 'test_rls_policies' não disponível. Não foi possível testar políticas RLS automaticamente.");
      } else {
        console.log("   ✅ Teste de políticas RLS bem-sucedido");
        console.log("   Resultado:", rlsData);
      }
    } catch (error) {
      console.log("   ⚠️ Função RPC 'test_rls_policies' não disponível:", error.message);
      console.log("   É recomendável executar o script 'politicas-rls-supabase.sql' para garantir que as políticas estão configuradas corretamente.");
    }
    
    // Conclusão
    console.log("\n=== CONCLUSÃO DO DIAGNÓSTICO ===");
    console.log("O diagnóstico foi concluído. Baseado nos resultados acima, siga uma das recomendações abaixo:");
    console.log("\n1. Se os testes de acesso ao servidor e tabelas críticas passaram, mas há erros de autenticação:");
    console.log("   - Verifique se as chaves de API estão corretas no arquivo src/integrations/supabase/client.ts");
    console.log("   - Execute npm run build e npm run preview para testar a versão de produção");
    
    console.log("\n2. Se houver erros de acesso às tabelas:");
    console.log("   - Execute o script politicas-rls-supabase.sql no Supabase SQL Editor");
    console.log("   - Verifique se as tabelas foram criadas corretamente");
    
    console.log("\n3. Se o servidor estiver indisponível:");
    console.log("   - Verifique sua conexão com a internet");
    console.log("   - Acesse o painel do Supabase em https://supabase.com e verifique o status do projeto");
    console.log("   - O projeto pode estar pausado ou ter atingido limites de uso gratuito");
    
  } catch (error) {
    console.error("❌ ERRO FATAL durante o diagnóstico:", error);
  }
}

// Executar o diagnóstico
diagnosticarConexao(); 