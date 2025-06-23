# CHANGELOG - SaludoCare Manager

Este arquivo documenta todas as modificações significativas feitas ao projeto SaludoCare Manager.

## [Não lançado]

### Adicionado
- Sistema de cache inteligente para dados de pacientes 
- Botão de atualização manual na tela de recepção
- Indicador de última atualização de dados
- Funções de mapeamento de IDs para nomes descritivos
- Novo módulo centralizado de API

### Corrigido
- Problema onde os dados não carregavam ao navegar entre páginas
- Conversão de IDs para nomes descritivos nas tabelas (especialidades, profissionais, convênios)
- Atrasos no carregamento da página de recepção
- Múltiplas requisições desnecessárias ao banco de dados

### Alterado
- Refatoração do Reception.tsx para usar API centralizada
- Implementada detecção de mudança de rota
- Adicionada atualização automática a cada minuto
- Melhorada a arquitetura para suportar cache e reduzir chamadas ao banco de dados

## [1.0.0] - 2024-09-XX

### Adicionado
- Versão inicial do SaludoCare Manager
- Sistema básico de gestão de pacientes
- Funcionalidades de agendamento
- Módulo de enfermagem
- Integração com Supabase 