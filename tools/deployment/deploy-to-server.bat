@echo off
echo 🚀 Iniciando processo de deploy para agicaresistemas.com.br

REM Verificar se existe pasta dist
if not exist "dist\" (
    echo 📦 Gerando build de produção...
    npm run build
    if errorlevel 1 (
        echo ❌ Erro ao gerar build. Verifique os erros acima.
        pause
        exit /b 1
    )
) else (
    echo ✅ Pasta dist encontrada
)

echo 📤 Compactando arquivos para upload...
tar -czf dist.tar.gz dist\

echo 🌐 Enviando arquivos para o servidor...
scp dist.tar.gz root@46.202.151.186:/tmp/

echo 🔄 Executando deploy no servidor...
ssh root@46.202.151.186 "cd /tmp && tar -xzf dist.tar.gz && rm -rf /var/www/agicaresistemas/dist && mv dist /var/www/agicaresistemas/ && chown -R www-data:www-data /var/www/agicaresistemas/dist && chmod -R 755 /var/www/agicaresistemas/dist && systemctl reload nginx && echo Deploy concluído! && rm -f /tmp/dist.tar.gz"

REM Limpar arquivo temporário local
del dist.tar.gz

echo 🎉 Deploy finalizado!
echo 🌐 Acesse: http://agicaresistemas.com.br
pause 