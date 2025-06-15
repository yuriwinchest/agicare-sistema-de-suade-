// Primeiro, vamos instalar o sharp
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  console.log('Instalando sharp...');
  execSync('npm install sharp');
  console.log('Sharp instalado.');

  // Agora podemos importar o sharp
  const sharp = require('sharp');
  
  // Caminho do SVG
  const svgPath = path.join(__dirname, 'favicon.svg');
  console.log('Processando:', svgPath);
  
  // Verificar se o arquivo existe
  if (!fs.existsSync(svgPath)) {
    console.error('Arquivo SVG não encontrado!');
    process.exit(1);
  }
  
  // Lista de tamanhos a serem gerados
  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 }
  ];
  
  // Converter SVG para cada tamanho
  console.log('Convertendo SVG para PNG em diferentes tamanhos...');
  
  for (const { name, size } of sizes) {
    const outputPath = path.join(__dirname, name);
    console.log(`Gerando ${name}...`);
    
    try {
      const buffer = fs.readFileSync(svgPath);
      sharp(buffer)
        .resize(size, size)
        .png()
        .toFile(outputPath, (err, info) => {
          if (err) {
            console.error(`Erro ao gerar ${name}:`, err);
          } else {
            console.log(`Sucesso: ${name}`);
          }
        });
    } catch (err) {
      console.error(`Erro ao processar ${name}:`, err);
    }
  }
} catch (err) {
  console.error('Ocorreu um erro:', err);
} 