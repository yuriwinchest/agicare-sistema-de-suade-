// Script para testar a conexão MCP com o Supabase
const { spawn } = require('child_process');

// Função para executar um comando MCP
function executeMcpCommand(args) {
  return new Promise((resolve, reject) => {
    console.log(`Executando comando MCP: npx -y @supabase/mcp-server-supabase ${args.join(' ')}`);

    const mcp = spawn('npx', [
      '-y',
      '@supabase/mcp-server-supabase',
      ...args,
      '--access-token',
      'sbp_v0_d631951ba033dd61c73092421d14982d3ff3fd5b'
    ]);

    let output = '';
    let errorOutput = '';

    mcp.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      console.log(text);
    });

    mcp.stderr.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;
      console.error(text);
    });

    mcp.on('close', (code) => {
      if (code === 0) {
        console.log('Comando executado com sucesso!');
        resolve(output);
      } else {
        console.error(`Erro ao executar comando. Código de saída: ${code}`);
        reject(new Error(`Erro ao executar comando: ${errorOutput}`));
      }
    });
  });
}

// Função principal para testar a conexão
async function testMcpConnection() {
  try {
    console.log('Testando conexão direta com o Supabase via MCP...');

    // Testar a execução de um SQL simples
    console.log('\nTestando execução de SQL simples...');
    await executeMcpCommand([
      'sql',
      '--command',
      'SELECT current_timestamp as now;'
    ]);

    // Testar listagem de tabelas
    console.log('\nListando tabelas existentes...');
    await executeMcpCommand([
      'sql',
      '--command',
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
    ]);

    console.log('\n✅ Teste de conexão MCP concluído com sucesso!');

  } catch (error) {
    console.error('\n❌ Erro no teste de conexão MCP:', error.message);
    console.log('\nVerifique se:');
    console.log('1. O token de acesso do Supabase é válido');
    console.log('2. Você tem acesso à internet para baixar o pacote @supabase/mcp-server-supabase');
  }
}

// Executar o teste
testMcpConnection();