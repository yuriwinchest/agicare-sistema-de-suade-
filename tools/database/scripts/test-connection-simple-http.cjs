const https = require('https');

// Nova chave de acesso do Supabase
const SUPABASE_URL = 'https://xspmibkhtmnetivtnjox.supabase.co';
const SUPABASE_KEY = 'sbp_v0_d631951ba033dd61c73092421d14982d3ff3fd5b';

function testConnection() {
  console.log('Testando conexão com o Supabase via HTTP nativo...');
  console.log('URL:', SUPABASE_URL);
  console.log('Chave:', SUPABASE_KEY.substring(0, 10) + '...');

  // Opções para a requisição HTTP
  const options = {
    hostname: SUPABASE_URL.replace('https://', ''),
    path: '/rest/v1/health',
    method: 'GET',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  };

  const req = https.request(options, (res) => {
    console.log(`Status da resposta: ${res.statusCode}`);

    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log('✅ Conexão com Supabase estabelecida com sucesso!');
        try {
          const parsedData = JSON.parse(data);
          console.log('Resposta:', parsedData);
        } catch (e) {
          console.log('Resposta (texto):', data);
        }
      } else {
        console.error('❌ Erro na conexão. Status:', res.statusCode);
        console.error('Resposta:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Erro na conexão:', error.message);
  });

  req.end();
}

testConnection();