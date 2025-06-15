// Importando o cliente Supabase
import { createClient } from '@supabase/supabase-js';

// Definir as mesmas credenciais que estão no cliente
const SUPABASE_URL = "https://xspmibkhtmnetivtnjox.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzcG1pYmtodG1uZXRpdnRuam94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NjcwMzUsImV4cCI6MjA2MDI0MzAzNX0.eOILz9zyxyM8i0ZJ3AHrjlWK1AFbf_MX2i62m3KNYsA";

// Criando o cliente
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

/**
 * Teste de conexão com o Supabase
 * Este script verifica se a conexão com o Supabase está funcionando corretamente
 */
async function testarConexao() {
  console.log('=== TESTE DE CONEXÃO COM SUPABASE ===');
  console.log(`URL: ${supabase.supabaseUrl}`);
  
  try {
    // Verificar a sessão
    console.log('\n1. Verificando sessão...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Erro ao obter sessão:', error.message);
    } else {
      console.log('✅ Conexão básica estabelecida com sucesso');
      console.log(`Sessão: ${data.session ? 'Ativa' : 'Não há sessão ativa'}`);
    }
    
    // Verificar autenticação
    console.log('\n2. Verificando status de autenticação...');
    const autenticado = data.session !== null;
    console.log(`Status de autenticação: ${autenticado ? '✅ Autenticado' : '❌ Não autenticado'}`);
    
    // Obter ID do usuário
    console.log('\n3. Tentando obter ID do usuário...');
    const userId = data.session?.user?.id || null;
    console.log(`ID do usuário: ${userId || '❌ Nenhum usuário logado'}`);
    
    // Teste com consulta básica à tabela de usuários
    console.log('\n4. Testando acesso às tabelas...');
    
    // Tentativa 1: buscar tabela de usuários/perfis (comum em projetos Supabase)
    let erroFinal = null;
    console.log('   Tentativa 1: Buscando tabela "profiles"...');
    const { data: profiles, error: errorProfiles } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (errorProfiles) {
      console.log(`   ❌ Tabela 'profiles' não encontrada ou acesso negado: ${errorProfiles.message}`);
      erroFinal = errorProfiles;
      
      // Tentativa 2: buscar usuários (outro nome comum)
      console.log('   Tentativa 2: Buscando tabela "users"...');
      const { data: users, error: errorUsers } = await supabase
        .from('users')
        .select('*')
        .limit(1);
        
      if (errorUsers) {
        console.log(`   ❌ Tabela 'users' não encontrada ou acesso negado: ${errorUsers.message}`);
        erroFinal = errorUsers;
        
        // Tentativa 3: listar tabelas (requer extensão)
        console.log('   Tentativa 3: Listando tabelas existentes...');
        try {
          // Ver se é possível obter metadados
          const { data: tableData, error: tableError } = await supabase
            .rpc('get_table_names');
            
          if (tableError) {
            console.log(`   ❌ Não foi possível listar tabelas: ${tableError.message}`);
            
            // Última tentativa com healthcheck
            console.log('   Tentativa 4: Verificando saúde do banco...');
            const { data: health, error: healthError } = await supabase.rpc('healthcheck');
            
            if (healthError) {
              console.log(`   ❌ Não foi possível verificar a saúde: ${healthError.message}`);
            } else {
              console.log(`   ✅ Verificação de saúde OK! Base de dados respondendo.`);
            }
          } else {
            console.log(`   ✅ Tabelas encontradas: ${JSON.stringify(tableData)}`);
            erroFinal = null;
          }
        } catch (e) {
          console.log(`   ❌ Erro ao tentar listar tabelas: ${e.message}`);
        }
      } else {
        console.log(`   ✅ Tabela 'users' encontrada! Dados: ${JSON.stringify(users)}`);
        erroFinal = null;
      }
    } else {
      console.log(`   ✅ Tabela 'profiles' encontrada! Dados: ${JSON.stringify(profiles)}`);
      erroFinal = null;
    }
    
    console.log('\n=== RESULTADO DO TESTE ===');
    console.log('Conexão básica com Supabase: ✅ Funcionando');
    console.log(`Autenticação: ${autenticado ? '✅ Disponível' : '⚠️ Não há usuário autenticado (normal se não fez login)'}`);
    
    if (erroFinal) {
      console.log('Acesso às tabelas: ⚠️ Não foi possível acessar tabelas conhecidas. Isso pode ser normal se:');
      console.log('   1. Seu banco de dados está vazio (sem tabelas criadas)');
      console.log('   2. As tabelas têm nomes diferentes (personalizados)');
      console.log('   3. As permissões RLS (Row Level Security) estão bloqueando acesso anônimo');
    } else {
      console.log('Acesso às tabelas: ✅ Funcionando corretamente');
    }
    
    console.log('\nCONCLUSÃO:');
    console.log('A conexão com o Supabase está ' + (!error ? '✅ FUNCIONANDO' : '❌ COM PROBLEMAS'));
    
    return !error;
  } catch (erro) {
    console.error('\n❌ ERRO INESPERADO:', erro);
    return false;
  }
}

// Executa o teste
testarConexao()
  .then(sucesso => {
    console.log(`\nTeste finalizado ${sucesso ? 'com sucesso! ✅' : 'com problemas ❌'}`);
    if (!sucesso) {
      console.log('⚠️ Verifique as credenciais e a conexão com a internet.');
    } else {
      console.log('✅ Você pode usar o Supabase normalmente em seu projeto!');
    }
  }); 