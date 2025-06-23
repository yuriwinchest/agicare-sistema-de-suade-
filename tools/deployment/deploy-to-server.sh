#!/bin/bash

# Script para deploy do SaludoCare Manager
# Para usar: ./deploy-to-server.sh

SERVER_IP="46.202.151.186"
SERVER_USER="root"
PROJECT_DIR="/var/www/agicaresistemas"

echo "🚀 Iniciando processo de deploy para agicaresistemas.com.br"

# Verificar se o dist existe
if [ ! -d "dist" ]; then
    echo "📦 Gerando build de produção..."
    npm run build
    
    if [ $? -ne 0 ]; then
        echo "❌ Erro ao gerar build. Verifique os erros acima."
        exit 1
    fi
else
    echo "✅ Pasta dist encontrada"
fi

# Criar arquivo temporário com a build
echo "📤 Compactando arquivos para upload..."
tar -czf dist.tar.gz dist/

# Enviar para o servidor
echo "🌐 Enviando arquivos para o servidor..."
scp dist.tar.gz $SERVER_USER@$SERVER_IP:/tmp/

# Executar deploy no servidor
echo "🔄 Executando deploy no servidor..."
ssh $SERVER_USER@$SERVER_IP << 'EOF'
cd /tmp
tar -xzf dist.tar.gz
rm -rf /var/www/agicaresistemas/dist
mv dist /var/www/agicaresistemas/
chown -R www-data:www-data /var/www/agicaresistemas/dist
chmod -R 755 /var/www/agicaresistemas/dist
systemctl reload nginx
echo "✅ Deploy concluído com sucesso!"
echo "🌐 Site disponível em: http://agicaresistemas.com.br"
rm -f /tmp/dist.tar.gz
EOF

# Limpar arquivo temporário local
rm -f dist.tar.gz

echo "🎉 Deploy finalizado!"
echo "🌐 Acesse: http://agicaresistemas.com.br" 