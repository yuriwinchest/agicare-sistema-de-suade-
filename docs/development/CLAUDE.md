# SaludoCare Manager - Documentação

Este documento serve como referência principal para o projeto SaludoCare Manager, um sistema de gestão para clínicas e estabelecimentos de saúde.

## Comandos bash comuns

```bash
# Iniciar o servidor de desenvolvimento
npm run dev

# Construir o projeto para produção
npm run build

# Construir o projeto para ambiente de desenvolvimento
npm run build:dev

# Executar o linter no código
npm run lint

# Pré-visualizar a build
npm run preview

# Executar teste de conexão com Supabase
node testes/testar-supabase.mjs
```

## Arquivos principais e funções utilitárias

### Estrutura de pastas principais
- `src/components`: Componentes React reutilizáveis
  - `ui/`: Componentes de UI baseados em shadcn/ui
  - `auth/`: Componentes relacionados à autenticação
  - `layout/`: Componentes de layout (sidebar, header, etc.)
  - Pastas específicas por domínio (nursing, patient-record, etc.)
- `src/hooks`: Hooks personalizados React
- `src/integrations`: Integrações com serviços externos (Supabase)
- `src/pages`: Páginas principais da aplicação
- `src/schemas`: Esquemas de validação Zod
- `src/services`: Serviços para manipulação de dados
- `src/utils`: Funções utilitárias

### Utilitários importantes
- `src/hooks/useAuthSync.ts`: Sincronização da autenticação do usuário
- `src/hooks/useSession.ts`: Gerenciamento de sessão do usuário
- `src/services/storageService.ts`: Gerenciamento de armazenamento de arquivos
- `src/integrations/supabase/client.ts`: Cliente Supabase para acesso à base de dados

## Diretrizes de estilo de código

- **TypeScript**: Use tipagem forte para todas as funções, componentes e variáveis
- **React Hooks**: Prefira hooks funcionais ao invés de classes para componentes React
- **Nomenclatura**:
  - Componentes: PascalCase (ex: `PatientCard.tsx`)
  - Hooks: camelCase começando com "use" (ex: `usePatientData.ts`)
  - Funções utilitárias: camelCase (ex: `formatCurrency.ts`)
- **Importações**: 
  - Use importações absolutas com alias `@/` (ex: `import Button from "@/components/ui/button"`)
  - Organize importações por grupos: React, bibliotecas externas, componentes internos
- **CSS**: Use Tailwind CSS para estilização com classes utilitárias

## Instruções de teste

### Teste da conexão com Supabase
Para verificar se a conexão com o Supabase está funcionando corretamente:

```bash
node testes/testar-supabase.mjs
```

Este script verifica:
1. A conexão básica com o Supabase
2. O status de autenticação
3. O acesso às tabelas do banco de dados

### Credenciais Supabase
- URL: `https://xspmibkhtmnetivtnjox.supabase.co`
- Chave pública: Armazenada no arquivo de cliente Supabase
- ID do projeto: `xspmibkhtmnetivtnjox`

## Etiqueta de repositório

- **Commits**: Use mensagens claras e concisas, especificando a área afetada
  - Exemplo: `feat(auth): adiciona verificação em duas etapas`
  - Exemplo: `fix(patient): corrige problema de validação de CPF`
- **Branches**:
  - `main`: Branch principal, apenas código estável
  - `develop`: Branch de desenvolvimento
  - Feature branches: Use o formato `feature/nome-da-funcionalidade`
  - Bugfix branches: Use o formato `fix/descricao-do-problema`
- **Pull Requests**: 
  - Descreva claramente o que foi alterado
  - Referencie issues relacionadas usando `#123`
  - Solicite revisão de colegas antes de mesclar

## Configuração de ambiente de desenvolvimento

### Requisitos
- Node.js (versão LTS recomendada)
- npm ou Yarn
- Conta no Supabase

### Configuração inicial
1. Clone o repositório: `git clone <URL_DO_REPOSITORIO>`
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente (se necessário)
4. Inicie o servidor: `npm run dev`

### Integração com Supabase
O projeto já está configurado para se conectar ao Supabase utilizando:
- Cliente configurado em `src/integrations/supabase/client.ts`
- Autenticação gerenciada através dos hooks `useAuthSync` e `useSession`
- Para testar a conexão: `node testes/testar-supabase.mjs`

## Comportamentos inesperados ou avisos

- **Erro de autenticação**: Se ocorrer um erro de autenticação inexplicável, verifique se o token JWT expirou ou se as políticas RLS (Row Level Security) estão bloqueando o acesso.
- **Problemas de cache**: Limpar o cache do navegador pode resolver problemas de interface não atualizando após modificações.
- **Erro com date-fns**: Há um conflito potencial entre as versões do date-fns e react-day-picker. Use a flag `--legacy-peer-deps` ao instalar novas dependências.

## Outras informações importantes

### Componentes UI disponíveis
O projeto utiliza shadcn/ui como base para componentes UI. Os principais componentes estão em `src/components/ui`.

### Rotas principais
- `/login`: Página de login
- `/dashboard`: Dashboard principal
- `/patient/:id`: Visualização de paciente específico
- `/patient-registration/:id?`: Formulário de cadastro/edição de paciente
- `/nursing`: Módulo de enfermagem
- `/electronic-medical-record`: Prontuário eletrônico
- `/ambulatory`: Gestão de ambulatório

### Funcionalidades principais
- Cadastro e gestão de pacientes
- Agendamento de consultas
- Registro de atendimentos de enfermagem
- Prontuário eletrônico
- Dashboard administrativo
- Internação hospitalar

### Tecnologias principais
- React 18 com TypeScript
- Vite como bundler
- Tailwind CSS para estilização
- shadcn/ui para componentes base
- React Query para gerenciamento de estado e chamadas API
- Supabase para backend (autenticação, banco de dados e armazenamento)
- React Router para navegação

## CHANGELOG

### 2024-10-19: Melhorias na performance e arquitetura da API

#### Implementação de API centralizada com cache
- Criado novo módulo `src/services/api/index.ts` com implementação de API centralizada
- Implementado sistema de cache inteligente com expiração automática (5 minutos)
- Centralizado o processo de conversão de IDs para nomes descritivos (especialidades, profissionais, convênios)
- Adicionados métodos padronizados para buscar e manipular dados de pacientes

#### Otimizações na tela de recepção (Reception.tsx)
- Corrigido problema onde os dados não carregavam ao mudar de aba
- Implementado detector de mudança de rota para recarregar dados automaticamente
- Adicionada atualização automática periódica a cada 1 minuto
- Criado botão de atualização manual com indicador visual
- Adicionado sistema para evitar múltiplas requisições em curto espaço de tempo (throttling)
- Incluído indicador de horário da última atualização

#### Conversão de IDs para nomes descritivos
- Implementada conversão de IDs para nomes nas colunas de especialidade, profissional e convênio
- Criadas funções auxiliares para mapear IDs para nomes correspondentes
- Aplicada a conversão em todos os endpoints relevantes para consistência na interface

Estas melhorias resultam em:
- Melhor desempenho geral do sistema
- Experiência do usuário aprimorada com dados carregados mais rapidamente
- Arquitetura mais limpa e organizada para futuras expansões
- Redução significativa de chamadas ao banco de dados 