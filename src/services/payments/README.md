# Sistema de Serviços, Exames e Procedimentos

Este diretório contém a implementação do sistema de gerenciamento de serviços, exames e procedimentos do SaludoCare Manager.

## Funcionalidades

- **Busca Avançada**: Filtros dinâmicos por tipo, categoria, preço, e outros atributos
- **Categorização**: Sistema de categorias para organizar melhor os serviços
- **Metadados Flexíveis**: Suporte a observações e informações adicionais como região do corpo
- **Interface Visual Aprimorada**: Ícones específicos para cada tipo de serviço, tags e tooltips

## Arquivos Principais

- `advanced-search.ts`: Implementação das funções de busca avançada e gerenciamento de metadados
- `setup-services.ts`: Script para configuração inicial das tabelas e estruturas de banco de dados
- Arquivos SQL de exemplo:
  - `consultas-sample.sql`: Exemplos de consultas médicas
  - `exames-sample.sql`: Exemplos de exames médicos
  - `procedimentos-sample.sql`: Exemplos de procedimentos médicos
  - `outros-sample.sql`: Exemplos de outros serviços

## Componentes React

- `AdvancedServiceSearch.tsx`: Componente para busca avançada de serviços
- `ServiceDetailsEditor.tsx`: Componente para edição de detalhes específicos de cada serviço

## Estrutura de Dados

### Tipos de Serviço

O sistema suporta quatro tipos principais de serviços:

1. `EXAM`: Exames médicos e diagnósticos
2. `PROCEDURE`: Procedimentos médicos e tratamentos
3. `CONSULTATION`: Consultas e avaliações médicas
4. `OTHER`: Outros serviços (pacotes, documentos, etc.)

### Categorias

As categorias são organizadas com prefixos específicos:

- `exm-*`: Categorias de exames
- `prc-*`: Categorias de procedimentos
- `con-*`: Categorias de consultas
- `out-*`: Categorias de outros serviços

### Metadados

Os serviços podem armazenar metadados flexíveis em formato JSON, incluindo:

- `observations`: Observações específicas sobre o serviço
- `bodyRegion`: Região do corpo aplicável (para exames e procedimentos)
- `lastUpdated`: Data da última atualização dos metadados

## Configuração Inicial

Para configurar o sistema pela primeira vez, siga os passos:

1. Execute a função `setupServicesSystem()` do arquivo `setup-services.ts`
2. Importe e execute os scripts SQL de exemplo para popular o banco de dados:
   - `consultas-sample.sql`
   - `exames-sample.sql`
   - `procedimentos-sample.sql`
   - `outros-sample.sql`

## Uso Básico

```typescript
// Exemplo de busca avançada
import { searchServices } from '@/services/payments/advanced-search'

const results = await searchServices({
  query: 'ultrassom',
  type: 'EXAM',
  priceRange: { min: 100, max: 300 }
})

// Exemplo de atualização de metadados
import { updateServiceMetadata } from '@/services/payments/advanced-search'

await updateServiceMetadata(
  serviceId,
  'Paciente alérgico a contraste',
  'Abdome superior'
)
```

## Integração com o Formulário

Este sistema se integra com o formulário de recepção de pacientes, permitindo a seleção e personalização dos serviços a serem prestados.

## Melhorias Futuras

- Implementação de sistema de favoritos por usuário
- Histórico de uso por profissional/especialidade
- Pacotes personalizados de serviços
- Integração com sistema de agendamento para pré-seleção de serviços 