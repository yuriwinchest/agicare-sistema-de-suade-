-- Script para ajustar políticas RLS específicas para a tabela user_profiles
-- Execute este script no Editor SQL do Supabase

-- OPÇÃO 1: Desativar o RLS completamente (a mais simples)
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- OPÇÃO 2: Criar política para service_role (recomendado para produção)
DROP POLICY IF EXISTS "Service role pode gerenciar perfis" ON public.user_profiles;
CREATE POLICY "Service role pode gerenciar perfis"
ON public.user_profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- OPÇÃO 3: Adicionar política para administradores
DROP POLICY IF EXISTS "Administradores podem gerenciar qualquer perfil" ON public.user_profiles;
CREATE POLICY "Administradores podem gerenciar qualquer perfil"
ON public.user_profiles
FOR ALL
TO authenticated
USING (public.is_admin() = true)
WITH CHECK (public.is_admin() = true);

-- Mensagem de conclusão
DO $$
BEGIN
  RAISE NOTICE 'As políticas RLS para a tabela user_profiles foram ajustadas com sucesso!';
  RAISE NOTICE 'Agora o serviço de administração pode gerenciar todos os perfis de usuário.';
END $$;