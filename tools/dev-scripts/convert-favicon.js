const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Caminhos corretos
const publicDir = path.join(__dirname, 'public');
const svgPath = path.join(publicDir, 'favicon.svg');

console.log('Diretório público:', publicDir);
console.log('Caminho do SVG:', svgPath);

// Verificar se o arquivo existe
if (!fs.existsSync(svgPath)) {
  console.error(`Arquivo não encontrado: ${svgPath}`);
  return;
}

// Instalação do sharp
console.log('Instalando sharp...');
exec('npm install sharp', (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro ao instalar sharp: ${error.message}`);
    return;
  }
  
  console.log('Sharp instalado com sucesso.');
  
  // Agora podemos importar o sharp
  const sharp = require('sharp');
  
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
  sizes.forEach(({ name, size }) => {
    const outputPath = path.join(publicDir, name);
    
    sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(outputPath)
      .then(() => {
        console.log(`Gerado: ${name}`);
      })
      .catch(err => {
        console.error(`Erro ao gerar ${name}: ${err.message}`);
      });
  });
}); 