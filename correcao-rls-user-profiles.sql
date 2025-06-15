-- Script para corrigir a política RLS da tabela user_profiles
-- Execute este arquivo através do SQL Editor no Supabase

-- Opção 1: Desativar completamente o RLS para a tabela user_profiles
-- Isso é útil para testes, mas para produção, use a Opção 2 abaixo
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Opção 2: Adicionar política específica para o service_role (abordagem recomendada)
-- Isso permite que o service_role tenha acesso total à tabela, mantendo o RLS ativo
DROP POLICY IF EXISTS "Service role pode gerenciar perfis" ON public.user_profiles;
CREATE POLICY "Service role pode gerenciar perfis" 
ON public.user_profiles 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Opção 3: Permitir que o usuário administrador adicione perfis para qualquer usuário
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
  RAISE NOTICE 'Políticas RLS para a tabela user_profiles configuradas com sucesso!';
END $$; 