// Script para criar tabelas no Supabase usando MCP
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Caminho para os scripts SQL
const mainScriptPath = path.join(__dirname, 'create-tables-sql.txt');
const complementScriptPath = path.join(__dirname, 'create-tables-complemento.sql');

// Token de acesso do Supabase
const SUPABASE_TOKEN = 'sbp_v0_d631951ba033dd61c73092421d14982d3ff3fd5b';

// Função para executar SQL via MCP
async function executeSqlViaMcp(sqlContent) {
  return new Promise((resolve, reject) => {
    // Criar um arquivo temporário para o SQL
    const tempSqlFile = path.join(__dirname, 'temp-mcp-sql.sql');
    fs.writeFileSync(tempSqlFile, sqlContent, 'utf8');

    console.log('Executando SQL via MCP...');

    // Comando para executar o SQL usando o MCP diretamente
    const mcp = spawn('npx', [
      '-y',
      '@supabase/mcp-server-supabase',
      'sql',
      '--file',
      tempSqlFile,
      '--access-token',
      SUPABASE_TOKEN
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
      // Remover o arquivo temporário
      try {
        fs.unlinkSync(tempSqlFile);
      } catch (err) {
        console.warn('Não foi possível remover o arquivo temporário:', err);
      }

      if (code === 0) {
        console.log('SQL executado com sucesso!');
        resolve(output);
      } else {
        console.error(`Erro ao executar SQL. Código de saída: ${code}`);
        reject(new Error(`Erro ao executar SQL: ${errorOutput}`));
      }
    });
  });
}

// Função principal
async function createTables() {
  try {
    console.log('Iniciando criação das tabelas no Supabase via MCP...');

    // Ler os scripts SQL
    console.log('Lendo scripts SQL...');
    const mainScript = fs.readFileSync(mainScriptPath, 'utf8');
    const complementScript = fs.readFileSync(complementScriptPath, 'utf8');

    // Executar o script principal
    console.log('Executando script principal...');
    await executeSqlViaMcp(mainScript);

    // Executar o script complementar
    console.log('Executando script complementar...');
    await executeSqlViaMcp(complementScript);

    console.log('✅ Todas as tabelas foram criadas com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error.message);
    console.log('\nPor favor, siga estas instruções alternativas:');
    console.log('1. Acesse o painel do Supabase: https://app.supabase.com');
    console.log('2. Selecione seu projeto');
    console.log('3. Vá para "SQL Editor" > "New Query"');
    console.log('4. Cole o conteúdo dos arquivos SQL e execute-os manualmente');
  }
}

// Executar a função principal
createTables();
