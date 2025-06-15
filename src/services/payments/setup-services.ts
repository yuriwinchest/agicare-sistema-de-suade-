import { supabase } from '@/integrations/supabase/supabaseClient'

/**
 * Script para inicializar o sistema de serviços e valores
 * 
 * Este script cria as tabelas necessárias e aplica as alterações no banco de dados
 * para suportar os recursos de busca avançada, categorização e metadados.
 */
export async function setupServicesSystem() {
  try {
    console.log('Iniciando configuração do sistema de serviços...')
    
    // 1. Verificar se a tabela de categorias existe
    const { data: checkCategoryTable, error: checkCategoryError } = await supabase
      .from('ServiceCategory')
      .select('count(*)', { count: 'exact', head: true })
    
    if (checkCategoryError && checkCategoryError.code === '42P01') {
      // Tabela não existe, criar a tabela de categorias
      console.log('Criando tabela de categorias...')
      await createCategoryTable()
    } else {
      console.log('Tabela de categorias já existe.')
    }
    
    // 2. Verificar se a tabela de serviços existe
    const { data: checkServiceTable, error: checkServiceError } = await supabase
      .from('ServicePrice')
      .select('count(*)', { count: 'exact', head: true })
    
    if (checkServiceError && checkServiceError.code === '42P01') {
      // Tabela não existe, criar a tabela de serviços
      console.log('Criando tabela de serviços...')
      await createServiceTable()
    } else {
      console.log('Tabela de serviços já existe.')
      
      // Verificar se a coluna de categoria existe
      const { data: checkCategoryColumn, error: checkColumnError } = await supabase
        .rpc('has_column', { table_name: 'ServicePrice', column_name: 'categoryId' })
      
      if (checkColumnError) {
        console.error('Erro ao verificar coluna de categoria:', checkColumnError)
      } else if (!checkCategoryColumn) {
        // Adicionar coluna de categoria
        console.log('Adicionando coluna de categoria à tabela de serviços...')
        await addCategoryColumn()
      } else {
        console.log('Coluna de categoria já existe.')
      }
      
      // Verificar se a coluna de metadados existe
      const { data: checkMetadataColumn, error: checkMetadataError } = await supabase
        .rpc('has_column', { table_name: 'ServicePrice', column_name: 'metadata' })
      
      if (checkMetadataError) {
        console.error('Erro ao verificar coluna de metadados:', checkMetadataError)
      } else if (!checkMetadataColumn) {
        // Adicionar coluna de metadados
        console.log('Adicionando coluna de metadados à tabela de serviços...')
        await addMetadataColumn()
      } else {
        console.log('Coluna de metadados já existe.')
      }
    }
    
    // 3. Verificar se a função has_column existe
    const { data: checkFunction, error: checkFunctionError } = await supabase
      .rpc('function_exists', { function_name: 'has_column' })
    
    if (checkFunctionError) {
      if (checkFunctionError.message.includes('function_exists')) {
        // Função function_exists não existe, criar
        console.log('Criando função auxiliar function_exists...')
        await createFunctionExistsFunction()
        
        // Agora criar a função has_column
        console.log('Criando função auxiliar has_column...')
        await createHasColumnFunction()
      } else {
        console.error('Erro ao verificar função has_column:', checkFunctionError)
      }
    } else if (!checkFunction) {
      // Função não existe, criar
      console.log('Criando função auxiliar has_column...')
      await createHasColumnFunction()
    } else {
      console.log('Função has_column já existe.')
    }
    
    // 4. Criar índices para melhorar o desempenho das consultas
    console.log('Criando índices para melhorar o desempenho...')
    await createIndices()
    
    console.log('Configuração do sistema de serviços concluída com sucesso!')
    return true
  } catch (error) {
    console.error('Erro durante a configuração do sistema de serviços:', error)
    return false
  }
}

// Função para criar a tabela de categorias
async function createCategoryTable() {
  const { error } = await supabase.rpc('execute_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS "ServiceCategory" (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        color TEXT,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
      
      -- Adicionar um gatilho para atualizar o campo updatedAt automaticamente
      CREATE TRIGGER update_servicecategory_updatedat
      BEFORE UPDATE ON "ServiceCategory"
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `
  })
  
  if (error) {
    console.error('Erro ao criar tabela de categorias:', error)
    throw error
  }
}

// Função para criar a tabela de serviços
async function createServiceTable() {
  const { error } = await supabase.rpc('execute_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS "ServicePrice" (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL DEFAULT 0,
        type TEXT NOT NULL,
        active BOOLEAN NOT NULL DEFAULT true,
        "categoryId" TEXT REFERENCES "ServiceCategory"(id),
        metadata JSONB,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        
        -- Restrição para garantir tipos válidos
        CONSTRAINT valid_service_type CHECK (type IN ('EXAM', 'PROCEDURE', 'CONSULTATION', 'OTHER'))
      );
      
      -- Adicionar um gatilho para atualizar o campo updatedAt automaticamente
      CREATE TRIGGER update_serviceprice_updatedat
      BEFORE UPDATE ON "ServicePrice"
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
      
      -- Garantir unicidade para nome e tipo
      CREATE UNIQUE INDEX service_price_name_type_idx ON "ServicePrice" (name, type);
    `
  })
  
  if (error) {
    console.error('Erro ao criar tabela de serviços:', error)
    throw error
  }
}

// Função para adicionar coluna de categoria
async function addCategoryColumn() {
  const { error } = await supabase.rpc('execute_sql', {
    sql: `
      ALTER TABLE "ServicePrice"
      ADD COLUMN IF NOT EXISTS "categoryId" TEXT REFERENCES "ServiceCategory"(id);
    `
  })
  
  if (error) {
    console.error('Erro ao adicionar coluna de categoria:', error)
    throw error
  }
}

// Função para adicionar coluna de metadados
async function addMetadataColumn() {
  const { error } = await supabase.rpc('execute_sql', {
    sql: `
      ALTER TABLE "ServicePrice"
      ADD COLUMN IF NOT EXISTS metadata JSONB;
    `
  })
  
  if (error) {
    console.error('Erro ao adicionar coluna de metadados:', error)
    throw error
  }
}

// Função para criar a função function_exists
async function createFunctionExistsFunction() {
  const { error } = await supabase.rpc('execute_sql', {
    sql: `
      CREATE OR REPLACE FUNCTION function_exists(function_name TEXT) 
      RETURNS BOOLEAN AS $$
      BEGIN
        RETURN EXISTS (
          SELECT 1
          FROM pg_proc p
          JOIN pg_namespace n ON p.pronamespace = n.oid
          WHERE p.proname = function_name
          AND n.nspname = 'public'
        );
      END;
      $$ LANGUAGE plpgsql;
    `
  })
  
  if (error) {
    console.error('Erro ao criar função function_exists:', error)
    throw error
  }
}

// Função para criar a função has_column
async function createHasColumnFunction() {
  const { error } = await supabase.rpc('execute_sql', {
    sql: `
      CREATE OR REPLACE FUNCTION has_column(table_name TEXT, column_name TEXT) 
      RETURNS BOOLEAN AS $$
      BEGIN
        RETURN EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = $1
          AND column_name = $2
        );
      END;
      $$ LANGUAGE plpgsql;
    `
  })
  
  if (error) {
    console.error('Erro ao criar função has_column:', error)
    throw error
  }
}

// Função para criar índices
async function createIndices() {
  const { error } = await supabase.rpc('execute_sql', {
    sql: `
      -- Índice para busca por nome
      CREATE INDEX IF NOT EXISTS service_price_name_idx ON "ServicePrice" (name text_pattern_ops);
      
      -- Índice para busca por tipo
      CREATE INDEX IF NOT EXISTS service_price_type_idx ON "ServicePrice" (type);
      
      -- Índice para busca por categoria
      CREATE INDEX IF NOT EXISTS service_price_category_idx ON "ServicePrice" ("categoryId");
      
      -- Índice para busca por status (ativo/inativo)
      CREATE INDEX IF NOT EXISTS service_price_active_idx ON "ServicePrice" (active);
      
      -- Índice para busca por intervalo de preço
      CREATE INDEX IF NOT EXISTS service_price_price_idx ON "ServicePrice" (price);
      
      -- Índice para busca em JSONB (metadados)
      CREATE INDEX IF NOT EXISTS service_price_metadata_idx ON "ServicePrice" USING GIN (metadata);
    `
  })
  
  if (error) {
    console.error('Erro ao criar índices:', error)
    throw error
  }
}

// Função para atualizar colunas updatedAt
async function createUpdatedAtFunction() {
  const { error } = await supabase.rpc('execute_sql', {
    sql: `
      -- Função para atualizar o campo updatedAt automaticamente
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW."updatedAt" = now();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `
  })
  
  if (error) {
    console.error('Erro ao criar função update_updated_at_column:', error)
    throw error
  }
} 