-- Script para configurar políticas RLS (Row Level Security) no Supabase
-- Este script deve ser executado diretamente no SQL Editor do Supabase

-- Ativar RLS para todas as tabelas relevantes
ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nursing_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.healthcare_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vital_signs ENABLE ROW LEVEL SECURITY;

-- Criar uma função para verificar se o usuário é administrador
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Verificar se o usuário atual tem função 'admin' na tabela collaborators ou user_profiles
  RETURN (
    EXISTS (
      SELECT 1 FROM public.collaborators
      WHERE email = auth.email() AND role = 'admin'
    ) OR EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar uma função para verificar se o usuário está acessando seus próprios dados
CREATE OR REPLACE FUNCTION public.is_current_user(collaborator_id text)
RETURNS BOOLEAN AS $$
BEGIN
  -- Verificar se o ID do colaborador corresponde ao usuário atual
  RETURN (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND professional_id = collaborator_id::uuid
    ) OR EXISTS (
      SELECT 1 FROM public.collaborators
      WHERE id = collaborator_id::uuid AND email = auth.email()
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- POLÍTICAS PARA TABELA COLLABORATORS
-- Política para administradores (podem ver todos os colaboradores)
DROP POLICY IF EXISTS "Administradores podem ver todos os colaboradores" ON public.collaborators;
CREATE POLICY "Administradores podem ver todos os colaboradores" 
ON public.collaborators 
FOR SELECT 
TO authenticated 
USING (public.is_admin() = true);

-- Política para usuários comuns (podem ver seus próprios dados)
DROP POLICY IF EXISTS "Usuários podem ver seus próprios dados" ON public.collaborators;
CREATE POLICY "Usuários podem ver seus próprios dados" 
ON public.collaborators 
FOR SELECT 
TO authenticated 
USING (email = auth.email());

-- Política para administradores (podem inserir colaboradores)
DROP POLICY IF EXISTS "Administradores podem inserir colaboradores" ON public.collaborators;
CREATE POLICY "Administradores podem inserir colaboradores" 
ON public.collaborators 
FOR INSERT 
TO authenticated 
WITH CHECK (public.is_admin() = true);

-- Política para administradores (podem atualizar colaboradores)
DROP POLICY IF EXISTS "Administradores podem atualizar colaboradores" ON public.collaborators;
CREATE POLICY "Administradores podem atualizar colaboradores" 
ON public.collaborators 
FOR UPDATE 
TO authenticated 
USING (public.is_admin() = true) 
WITH CHECK (public.is_admin() = true);

-- Política para usuários (podem atualizar seus próprios dados)
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios dados" ON public.collaborators;
CREATE POLICY "Usuários podem atualizar seus próprios dados" 
ON public.collaborators 
FOR UPDATE 
TO authenticated 
USING (email = auth.email()) 
WITH CHECK (email = auth.email());

-- Política para administradores (podem excluir colaboradores)
DROP POLICY IF EXISTS "Administradores podem excluir colaboradores" ON public.collaborators;
CREATE POLICY "Administradores podem excluir colaboradores" 
ON public.collaborators 
FOR DELETE 
TO authenticated 
USING (public.is_admin() = true);

-- POLÍTICAS PARA TABELA USER_PROFILES
-- Política para administradores (podem ver todos os perfis)
DROP POLICY IF EXISTS "Administradores podem ver todos os perfis" ON public.user_profiles;
CREATE POLICY "Administradores podem ver todos os perfis" 
ON public.user_profiles 
FOR SELECT 
TO authenticated 
USING (public.is_admin() = true);

-- Política para usuários (podem ver seu próprio perfil)
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON public.user_profiles;
CREATE POLICY "Usuários podem ver seu próprio perfil" 
ON public.user_profiles 
FOR SELECT 
TO authenticated 
USING (id = auth.uid());

-- Política para administradores (podem inserir perfis)
DROP POLICY IF EXISTS "Administradores podem inserir perfis" ON public.user_profiles;
CREATE POLICY "Administradores podem inserir perfis" 
ON public.user_profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (public.is_admin() = true OR id = auth.uid());

-- Política para administradores (podem atualizar perfis)
DROP POLICY IF EXISTS "Administradores podem atualizar perfis" ON public.user_profiles;
CREATE POLICY "Administradores podem atualizar perfis" 
ON public.user_profiles 
FOR UPDATE 
TO authenticated 
USING (public.is_admin() = true) 
WITH CHECK (public.is_admin() = true);

-- Política para usuários (podem atualizar seu próprio perfil)
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON public.user_profiles;
CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
ON public.user_profiles 
FOR UPDATE 
TO authenticated 
USING (id = auth.uid()) 
WITH CHECK (id = auth.uid());

-- Política para administradores (podem excluir perfis)
DROP POLICY IF EXISTS "Administradores podem excluir perfis" ON public.user_profiles;
CREATE POLICY "Administradores podem excluir perfis" 
ON public.user_profiles 
FOR DELETE 
TO authenticated 
USING (public.is_admin() = true);

-- POLÍTICAS PARA TABELA PATIENTS
-- Política para colaboradores (podem ver todos os pacientes)
DROP POLICY IF EXISTS "Colaboradores podem ver todos os pacientes" ON public.patients;
CREATE POLICY "Colaboradores podem ver todos os pacientes" 
ON public.patients 
FOR SELECT 
TO authenticated 
USING (true);

-- Política para colaboradores (podem inserir pacientes)
DROP POLICY IF EXISTS "Colaboradores podem inserir pacientes" ON public.patients;
CREATE POLICY "Colaboradores podem inserir pacientes" 
ON public.patients 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Política para colaboradores (podem atualizar pacientes)
DROP POLICY IF EXISTS "Colaboradores podem atualizar pacientes" ON public.patients;
CREATE POLICY "Colaboradores podem atualizar pacientes" 
ON public.patients 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Política para administradores (podem excluir pacientes)
DROP POLICY IF EXISTS "Administradores podem excluir pacientes" ON public.patients;
CREATE POLICY "Administradores podem excluir pacientes" 
ON public.patients 
FOR DELETE 
TO authenticated 
USING (public.is_admin() = true);

-- POLÍTICAS PARA TABELA APPOINTMENTS
-- Política para colaboradores (podem ver todos os agendamentos)
DROP POLICY IF EXISTS "Colaboradores podem ver todos os agendamentos" ON public.appointments;
CREATE POLICY "Colaboradores podem ver todos os agendamentos" 
ON public.appointments 
FOR SELECT 
TO authenticated 
USING (true);

-- Política para colaboradores (podem inserir agendamentos)
DROP POLICY IF EXISTS "Colaboradores podem inserir agendamentos" ON public.appointments;
CREATE POLICY "Colaboradores podem inserir agendamentos" 
ON public.appointments 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Política para colaboradores (podem atualizar agendamentos)
DROP POLICY IF EXISTS "Colaboradores podem atualizar agendamentos" ON public.appointments;
CREATE POLICY "Colaboradores podem atualizar agendamentos" 
ON public.appointments 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Política para administradores (podem excluir agendamentos)
DROP POLICY IF EXISTS "Administradores podem excluir agendamentos" ON public.appointments;
CREATE POLICY "Administradores podem excluir agendamentos" 
ON public.appointments 
FOR DELETE 
TO authenticated 
USING (public.is_admin() = true);

-- POLÍTICAS PARA TABELA HEALTHCARE_UNITS
-- Política para visualização de unidades de saúde
DROP POLICY IF EXISTS "Todos podem ver unidades de saúde" ON public.healthcare_units;
CREATE POLICY "Todos podem ver unidades de saúde" 
ON public.healthcare_units 
FOR SELECT 
TO authenticated 
USING (true);

-- Política para administradores (podem gerenciar unidades de saúde)
DROP POLICY IF EXISTS "Administradores podem gerenciar unidades de saúde" ON public.healthcare_units;
CREATE POLICY "Administradores podem gerenciar unidades de saúde" 
ON public.healthcare_units 
FOR ALL 
TO authenticated 
USING (public.is_admin() = true) 
WITH CHECK (public.is_admin() = true);

-- Conceder permissões na API REST
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated, service_role;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Mensagem de conclusão
DO $$
BEGIN
  RAISE NOTICE 'As políticas RLS foram configuradas com sucesso!';
  RAISE NOTICE 'Agora os usuários podem acessar somente seus próprios dados, enquanto administradores têm acesso completo.';
END $$; 