import { supabase } from '@/integrations/supabase/supabaseClient'
import type { ServicePrice, ServiceCategory } from '@/types/services'

export type SearchFilter = {
  query: string
  type?: 'EXAM' | 'PROCEDURE' | 'CONSULTATION' | 'OTHER'
  categoryId?: string
  priceRange?: { min?: number; max?: number }
  active?: boolean
  sortBy?: 'name' | 'price' | 'category'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  bodyRegion?: string
  hasObservations?: boolean
}

export type SearchResults = {
  items: ServicePrice[]
  totalCount: number
  categories: ServiceCategory[]
}

/**
 * Realiza busca avançada de serviços, exames e procedimentos
 * 
 * @param filter Parâmetros para filtrar a busca
 * @returns Os resultados da busca e contagem total
 */
export async function searchServices(filter: SearchFilter): Promise<SearchResults> {
  let query = supabase
    .from('ServicePrice')
    .select(`
      *,
      category:categoryId(id, name, description)
    `, { count: 'exact' })

  // Aplicar filtro por tipo
  if (filter.type) {
    query = query.eq('type', filter.type)
  }

  // Aplicar filtro por categoria
  if (filter.categoryId) {
    query = query.eq('categoryId', filter.categoryId)
  }

  // Aplicar filtro por status (ativo/inativo)
  if (filter.active !== undefined) {
    query = query.eq('active', filter.active)
  }

  // Aplicar filtro por texto (nome e descrição)
  if (filter.query) {
    query = query.or(`name.ilike.%${filter.query}%,description.ilike.%${filter.query}%`)
  }

  // Aplicar filtro por faixa de preço
  if (filter.priceRange) {
    if (filter.priceRange.min !== undefined) {
      query = query.gte('price', filter.priceRange.min)
    }
    if (filter.priceRange.max !== undefined) {
      query = query.lte('price', filter.priceRange.max)
    }
  }

  // Aplicar filtro por região do corpo
  if (filter.bodyRegion) {
    query = query.or(`
      metadata->>'bodyRegion'.ilike.%${filter.bodyRegion}%,
      name.ilike.%${filter.bodyRegion}%,
      description.ilike.%${filter.bodyRegion}%
    `)
  }

  // Filtrar por presença de observações
  if (filter.hasObservations) {
    query = query.not('metadata->observations', 'is', null)
  }

  // Aplicar ordenação
  if (filter.sortBy) {
    const column = filter.sortBy === 'category' ? 'categoryId' : filter.sortBy
    const order = filter.sortOrder || 'asc'
    query = query.order(column, { ascending: order === 'asc' })
  } else {
    // Ordenação padrão
    query = query.order('name', { ascending: true })
  }

  // Aplicar limite de resultados
  if (filter.limit) {
    query = query.limit(filter.limit)
  }

  const { data, count, error } = await query

  if (error) {
    console.error('Erro ao buscar serviços:', error)
    throw new Error('Falha ao buscar serviços')
  }

  // Buscar as categorias disponíveis para os filtros
  const { data: categories } = await supabase
    .from('ServiceCategory')
    .select('*')
    .order('name')

  return {
    items: data as ServicePrice[],
    totalCount: count || 0,
    categories: categories as ServiceCategory[] || []
  }
}

/**
 * Obtém as categorias de serviços disponíveis
 * 
 * @param type Opcional: filtrar categorias por tipo de serviço
 * @returns Lista de categorias
 */
export async function getServiceCategories(type?: 'EXAM' | 'PROCEDURE' | 'CONSULTATION' | 'OTHER'): Promise<ServiceCategory[]> {
  try {
    let query = supabase
      .from('ServiceCategory')
      .select('*')
      .order('name')

    // Se tivermos um tipo específico, filtramos as categorias
    if (type) {
      // Baseado nas convenções de nomenclatura usadas nos exemplos:
      const prefixMap = {
        'EXAM': 'exm-',
        'PROCEDURE': 'prc-',
        'CONSULTATION': 'con-',
        'OTHER': 'out-'
      }
      
      const prefix = prefixMap[type]
      if (prefix) {
        query = query.like('id', `${prefix}%`)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error('Erro ao buscar categorias:', error)
      throw error
    }

    return data as ServiceCategory[]
  } catch (error) {
    console.error('Falha ao buscar categorias de serviços:', error)
    return []
  }
}

/**
 * Busca rápida de serviços pelo nome
 * 
 * @param query Texto para busca
 * @param type Opcional: filtrar por tipo de serviço
 * @param limit Limite de resultados
 * @returns Lista de serviços
 */
export async function quickSearchServices(
  query: string, 
  type?: 'EXAM' | 'PROCEDURE' | 'CONSULTATION' | 'OTHER',
  limit = 10
): Promise<ServicePrice[]> {
  try {
    let queryBuilder = supabase
      .from('ServicePrice')
      .select(`
        *,
        category:categoryId(id, name, description)
      `)
      .ilike('name', `%${query}%`)
      .eq('active', true)
      .limit(limit)

    if (type) {
      queryBuilder = queryBuilder.eq('type', type)
    }

    const { data, error } = await queryBuilder

    if (error) {
      console.error('Erro na busca rápida:', error)
      throw error
    }

    return data as ServicePrice[]
  } catch (error) {
    console.error('Falha na busca rápida de serviços:', error)
    return []
  }
}

/**
 * Atualiza as observações e região do corpo de um serviço
 * 
 * @param serviceId ID do serviço a ser atualizado
 * @param observations Observações sobre o serviço
 * @param bodyRegion Região do corpo aplicável (opcional)
 */
export async function updateServiceMetadata(
  serviceId: string,
  observations?: string,
  bodyRegion?: string
): Promise<void> {
  try {
    // Recupera os metadados existentes primeiro
    const { data: currentService } = await supabase
      .from('ServicePrice')
      .select('metadata')
      .eq('id', serviceId)
      .single()

    // Mescla os metadados existentes com os novos
    const updatedMetadata = {
      ...(currentService?.metadata || {}),
      observations: observations || null,
      bodyRegion: bodyRegion || null,
      lastUpdated: new Date().toISOString()
    }

    // Atualiza o registro
    const { error } = await supabase
      .from('ServicePrice')
      .update({ metadata: updatedMetadata })
      .eq('id', serviceId)

    if (error) {
      console.error('Erro ao atualizar metadados do serviço:', error)
      throw error
    }
  } catch (error) {
    console.error('Falha ao atualizar metadados do serviço:', error)
    throw new Error('Não foi possível atualizar as informações do serviço')
  }
}

/**
 * Obtém serviços mais utilizados ou recomendados
 * 
 * @param type Tipo de serviço
 * @param limit Número máximo de resultados
 * @returns Lista de serviços recomendados
 */
export async function getRecommendedServices(
  type: 'EXAM' | 'PROCEDURE' | 'CONSULTATION' | 'OTHER',
  limit = 5
): Promise<ServicePrice[]> {
  try {
    // Em uma implementação real, isso poderia ser baseado em estatísticas de uso
    // Por enquanto, retornamos apenas alguns serviços ativos daquele tipo
    const { data, error } = await supabase
      .from('ServicePrice')
      .select(`
        *,
        category:categoryId(id, name, description)
      `)
      .eq('type', type)
      .eq('active', true)
      .order('name')
      .limit(limit)

    if (error) {
      console.error('Erro ao buscar serviços recomendados:', error)
      throw error
    }

    return data as ServicePrice[]
  } catch (error) {
    console.error('Falha ao buscar serviços recomendados:', error)
    return []
  }
} 