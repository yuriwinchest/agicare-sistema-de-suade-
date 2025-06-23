@echo off
echo ========================================
echo UPLOAD DO SISTEMA SALUDOCARE PARA GITHUB
echo ========================================

echo.
echo 1. Inicializando repositorio Git...
git init

echo.
echo 2. Configurando repositorio remoto...
git remote remove origin 2>nul
git remote add origin https://github.com/yuriwinchest/-SISTEMA-DE-GERENCIAMENTO-DE-CLINICAS.git

echo.
echo 3. Adicionando todos os arquivos...
git add .

echo.
echo 4. Fazendo commit com mensagem descritiva...
git commit -m "feat: Sistema completo SaludoCare - Gestao Medica e Hospitalar

- Sistema completo de gestao medica e hospitalar
- 19 modulos funcionais organizados por categoria
- Interface limpa e profissional
- Recepção, Medico, Enfermagem, Admin e Sistema
- Prontuario eletronico completo
- Gestao de pacientes e agendamentos
- Dashboard com indicadores
- Sistema certificado (ISO, LGPD, CFM, ANVISA)
- Responsivo e otimizado
- React + TypeScript + Tailwind CSS
- Supabase como backend"

echo.
echo 5. Fazendo push para o GitHub...
git branch -M main
git push -u origin main --force

echo.
echo ========================================
echo UPLOAD CONCLUIDO COM SUCESSO!
echo ========================================
echo.
echo O sistema SaludoCare foi enviado para:
echo https://github.com/yuriwinchest/-SISTEMA-DE-GERENCIAMENTO-DE-CLINICAS
echo.
echo Para acessar o repositorio, abra o link acima no navegador.
echo.
pause