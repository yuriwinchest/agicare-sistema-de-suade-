const { createClient } = require('@supabase/supabase-js');

// Nova chave de acesso do Supabase
const SUPABASE_URL = 'https://xspmibkhtmnetivtnjox.supabase.co';
const SUPABASE_KEY = 'sbp_v0_d631951ba033dd61c73092421d14982d3ff3fd5b';

async function testConnection() {
  console.log('Testando conexão com o Supabase...');
  console.log('URL:', SUPABASE_URL);
  console.log('Chave:', SUPABASE_KEY.substring(0, 10) + '...');

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Teste simples - tentar buscar a versão do PostgreSQL
    const { data, error } = await supabase
      .from('users')
      .select('count(*)', { count: 'exact' });

    if (error) {
      throw new Error(`Erro ao consultar tabela: ${error.message}`);
    }

    console.log('✅ Conexão com Supabase estabelecida com sucesso!');
    console.log('Dados retornados:', data);

  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
  }
}

testConnection();