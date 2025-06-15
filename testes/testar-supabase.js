// Importando o cliente Supabase
import { createClient } from '@supabase/supabase-js';

// Definir as mesmas credenciais que estão no cliente
const SUPABASE_URL = "https://xspmibkhtmnetivtnjox.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhzc
G1pYmtodG1uZXRpdnRuam94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NjcwMzUsImV4cCI6MjA2MDI0MzAzNX0.eOILz9zyxyM8i0ZJ3
AHrjlWK1AFbf_MX2i62m3KNYsA";

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
    
    // Tenta fazer uma consulta simples (substitua 'profiles' pela tabela que você tem)
    // Profiles é uma tabela comum criada pelo Supabase ao configurar autenticação
    console.log('\n4. Testando consulta à tabela...');
    const { data: tabelas, error: erroTabelas } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1);
    
    if (erroTabelas) {
      if (erroTabelas.code === 'PGRST116') {
        console.error('❌ Tabela não encontrada. Tente substituir "profiles" por uma tabela que exista no seu banco.');
      } else {
        console.error('❌ Erro ao consultar tabela:', erroTabelas.message);
      }
    } else {
      console.log('✅ Consulta realizada com sucesso!');
      console.log('Resultado:', tabelas);
    }
    
    console.log('\n=== RESULTADO DO TESTE ===');
    console.log('Conexão básica com Supabase: ✅ Funcionando');
    console.log(`Autenticação: ${autenticado ? '✅ Disponível' : '⚠️ Não há usuário autenticado (normal se não fez login)'}`);
    console.log('Consulta à tabela: ' + (erroTabelas ? '❌ Falhou (verifique nome da tabela)' : '✅ Funcionando'));
    
    return !error && !erroTabelas;
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
    }
  }); 