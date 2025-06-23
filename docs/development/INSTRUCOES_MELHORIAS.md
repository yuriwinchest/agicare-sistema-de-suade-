# Instruções para Melhorias no SaludoCare Manager

Este documento contém instruções para aplicar melhorias no sistema SaludoCare Manager, focando na correção de problemas de salvamento de dados, autenticação e acesso às tabelas.

## 1. Configuração de Políticas RLS no Supabase

As políticas RLS (Row Level Security) são essenciais para controlar o acesso aos dados. Elas permitem que os usuários acessem apenas os dados que têm permissão para ver.

### Como aplicar:

1. Acesse o dashboard do Supabase em: https://app.supabase.com
2. Selecione o projeto SaludoCare
3. Vá para "SQL Editor"
4. Copie e cole o conteúdo do arquivo `politicas-rls-supabase.sql` 
5. Execute o script completo

Isso configurará as políticas RLS necessárias para:
- Permitir que administradores acessem todos os dados
- Permitir que usuários comuns acessem apenas seus próprios dados
- Garantir que pacientes e agendamentos sejam acessíveis para todos os colaboradores

## 2. Melhoria no Processo de Registro de Colaboradores

O arquivo `src/hooks/useCollaboratorForm.ts` foi atualizado para:
- Melhorar a criação de usuários no sistema de autenticação
- Garantir a associação correta entre usuário autenticado e colaborador
- Criar automaticamente um perfil de usuário (user_profile) vinculado ao colaborador

### Como testar:

1. Faça login como administrador (`admin@example.com`, senha: `senha123`)
2. Acesse o painel administrativo
3. Clique em "Registrar Novo Colaborador"
4. Preencha os dados e salve
5. Tente fazer login com o novo colaborador

## 3. Novo Hook para Cliente Supabase Autenticado

Para resolver o problema de "Invalid API key" ao acessar dados, foi criado um novo hook em `src/hooks/useSupabaseClient.ts`. Este hook:
- Fornece um cliente Supabase corretamente autenticado com o token JWT do usuário
- Atualiza automaticamente o cliente quando a autenticação muda
- Permite atualizar o token quando necessário

### Como utilizar o novo hook:

```typescript
import { useSupabaseClient } from '@/hooks/useSupabaseClient';

function MeuComponente() {
  const { client } = useSupabaseClient();
  
  const buscarDados = async () => {
    // Usar o cliente autenticado ao invés do cliente padrão
    const { data, error } = await client
      .from('tabela')
      .select('*');
      
    // Seu código...
  };
  
  return (
    // Seu componente...
  );
}
```

## 4. Script de Teste para Verificar Funcionamento

Um script de teste foi criado para verificar se o registro de colaboradores e o login estão funcionando corretamente:

```bash
node teste-registro-colaborador.mjs
```

Este script:
- Cria um colaborador de teste
- Registra o usuário no sistema de autenticação
- Testa o login
- Verifica o acesso aos dados

## 5. Próximos Passos

Para completar as melhorias:

1. Atualizar todos os componentes para usar o novo hook `useSupabaseClient`
2. Revisar todas as páginas que salvam dados para garantir consistência
3. Implementar funções de redefinição de senha seguras
4. Criar um sistema de auditoria para monitorar alterações em dados importantes

## Conclusão

Essas melhorias resolvem os principais problemas de salvamento de dados e autenticação no sistema SaludoCare Manager. A implementação correta das políticas RLS e a utilização do hook personalizado para o cliente Supabase garantem que os dados sejam acessados e salvos corretamente. 