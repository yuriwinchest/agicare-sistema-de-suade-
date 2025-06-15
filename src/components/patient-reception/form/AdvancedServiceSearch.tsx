import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { 
  Search, 
  X, 
  Filter, 
  ChevronRight, 
  Check, 
  Plus, 
  FileText, 
  MapPin,
  Heart, 
  Tag
} from 'lucide-react'

import { searchServices, getServiceCategories, type SearchFilter } from '@/services/payments/advanced-search'
import type { ServicePrice, ServiceCategory } from '@/types/services'

// Componente de tag para os filtros aplicados
const FilterTag = ({ label, onRemove }: { label: string, onRemove: () => void }) => (
  <Badge variant="outline" className="flex items-center gap-1 py-1 pl-2 pr-1 bg-slate-50">
    <span>{label}</span>
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-5 w-5 rounded-full hover:bg-slate-200"
      onClick={onRemove}
    >
      <X className="h-3 w-3" />
    </Button>
  </Badge>
)

// Tipos para as propriedades do componente
interface AdvancedServiceSearchProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (service: ServicePrice) => void
  type?: 'EXAM' | 'PROCEDURE' | 'CONSULTATION' | 'OTHER'
  initialQuery?: string
}

// Componente principal
export default function AdvancedServiceSearch({
  isOpen,
  onClose,
  onSelect,
  type = 'PROCEDURE',
  initialQuery = ''
}: AdvancedServiceSearchProps) {
  // Estados para os filtros de busca
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [sortBy, setSortBy] = useState<string>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [bodyRegion, setBodyRegion] = useState<string>('')
  const [hasObservations, setHasObservations] = useState<boolean>(false)
  const [activeOnly, setActiveOnly] = useState<boolean>(true)
  
  // Estados para os resultados e carregamento
  const [results, setResults] = useState<ServicePrice[]>([])
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [currentTab, setCurrentTab] = useState<string>(type)

  // Estado para controlar os filtros aplicados para exibição visual
  const [appliedFilters, setAppliedFilters] = useState<{id: string, label: string}[]>([])

  // Efeito para carregar categorias quando o tipo muda
  useEffect(() => {
    if (isOpen) {
      loadCategories(currentTab as any)
    }
  }, [isOpen, currentTab])

  // Efeito para executar a busca quando os filtros mudam
  useEffect(() => {
    if (isOpen) {
      performSearch()
    }
  }, [currentTab, isOpen])

  // Carrega as categorias disponíveis para o tipo atual
  const loadCategories = async (type: 'EXAM' | 'PROCEDURE' | 'CONSULTATION' | 'OTHER') => {
    try {
      const categoriesData = await getServiceCategories(type)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  // Executa a busca com os filtros aplicados
  const performSearch = async () => {
    try {
      setIsLoading(true)
      
      // Construir o objeto de filtro
      const filter: SearchFilter = {
        query: searchQuery,
        type: currentTab as any,
        active: activeOnly,
        categoryId: selectedCategory || undefined,
        priceRange: {
          min: priceRange[0],
          max: priceRange[1]
        },
        sortBy: sortBy as any,
        sortOrder: sortOrder,
        bodyRegion: bodyRegion || undefined,
        hasObservations: hasObservations
      }
      
      // Atualizar os filtros visuais
      updateAppliedFilters(filter)
      
      // Executar a busca
      const searchResult = await searchServices(filter)
      
      setResults(searchResult.items)
      setTotalCount(searchResult.totalCount)
    } catch (error) {
      console.error('Erro na busca avançada:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Atualiza os filtros aplicados para exibição visual
  const updateAppliedFilters = (filter: SearchFilter) => {
    const newFilters = []
    
    if (filter.query) {
      newFilters.push({ id: 'query', label: `Busca: ${filter.query}` })
    }
    
    if (filter.categoryId) {
      const category = categories.find(c => c.id === filter.categoryId)
      if (category) {
        newFilters.push({ id: 'category', label: `Categoria: ${category.name}` })
      }
    }
    
    if (filter.priceRange && (filter.priceRange.min || filter.priceRange.max)) {
      const minPrice = filter.priceRange.min !== undefined ? filter.priceRange.min : 0
      const maxPrice = filter.priceRange.max !== undefined ? filter.priceRange.max : '∞'
      newFilters.push({ id: 'price', label: `Preço: R$ ${minPrice} - R$ ${maxPrice}` })
    }
    
    if (filter.bodyRegion) {
      newFilters.push({ id: 'region', label: `Região: ${filter.bodyRegion}` })
    }
    
    if (filter.hasObservations) {
      newFilters.push({ id: 'observations', label: 'Com observações' })
    }
    
    if (filter.sortBy) {
      const sortLabels: Record<string, string> = {
        'name': 'Nome',
        'price': 'Preço',
        'category': 'Categoria'
      }
      newFilters.push({ 
        id: 'sort', 
        label: `Ordenado por: ${sortLabels[filter.sortBy]} (${filter.sortOrder === 'asc' ? '↑' : '↓'})`
      })
    }
    
    setAppliedFilters(newFilters)
  }

  // Remove um filtro específico
  const removeFilter = (filterId: string) => {
    switch (filterId) {
      case 'query':
        setSearchQuery('')
        break
      case 'category':
        setSelectedCategory('')
        break
      case 'price':
        setPriceRange([0, 1000])
        break
      case 'region':
        setBodyRegion('')
        break
      case 'observations':
        setHasObservations(false)
        break
      case 'sort':
        setSortBy('name')
        setSortOrder('asc')
        break
    }
    
    // Atualiza a lista de filtros aplicados
    setAppliedFilters(appliedFilters.filter(f => f.id !== filterId))
    
    // Executa a busca com os novos filtros
    setTimeout(performSearch, 0)
  }

  // Limpa todos os filtros
  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setPriceRange([0, 1000])
    setSortBy('name')
    setSortOrder('asc')
    setBodyRegion('')
    setHasObservations(false)
    setAppliedFilters([])
    setTimeout(performSearch, 0)
  }

  // Retorna ícone baseado no tipo de serviço
  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'EXAM':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'PROCEDURE':
        return <Heart className="h-4 w-4 text-rose-500" />
      case 'CONSULTATION':
        return <Tag className="h-4 w-4 text-amber-500" />
      case 'OTHER':
        return <Plus className="h-4 w-4 text-violet-500" />
      default:
        return <ChevronRight className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Busca Avançada de Serviços</DialogTitle>
          <DialogDescription>
            Encontre o serviço desejado utilizando os filtros disponíveis.
          </DialogDescription>
        </DialogHeader>
        
        {/* Tabs para os tipos de serviço */}
        <Tabs 
          defaultValue={type} 
          value={currentTab} 
          onValueChange={(value) => {
            setCurrentTab(value)
            setSelectedCategory('')
          }}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="PROCEDURE">Procedimentos</TabsTrigger>
            <TabsTrigger value="EXAM">Exames</TabsTrigger>
            <TabsTrigger value="CONSULTATION">Consultas</TabsTrigger>
            <TabsTrigger value="OTHER">Outros</TabsTrigger>
          </TabsList>
          
          {/* Conteúdo comum para todas as abas */}
          <div className="flex flex-col h-[calc(90vh-220px)]">
            {/* Barra de busca e filtros */}
            <div className="flex gap-2 items-start mb-4">
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Buscar serviço..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && performSearch()}
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas as categorias</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={performSearch}>
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </Button>
                </div>
                
                {/* Filtros aplicados */}
                {appliedFilters.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 items-center">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Filter className="h-3 w-3 mr-1" /> 
                      Filtros:
                    </span>
                    {appliedFilters.map((filter) => (
                      <FilterTag 
                        key={filter.id} 
                        label={filter.label} 
                        onRemove={() => removeFilter(filter.id)} 
                      />
                    ))}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-xs text-gray-500 hover:text-gray-700"
                      onClick={clearAllFilters}
                    >
                      Limpar todos
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Área de resultados e filtros avançados */}
            <div className="flex gap-4 h-full overflow-hidden">
              {/* Painel de filtros */}
              <div className="w-64 bg-slate-50 p-4 rounded-md overflow-y-auto">
                <h3 className="font-medium text-sm mb-3 flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros Avançados
                </h3>
                
                <div className="space-y-4">
                  {/* Filtro de preço */}
                  <div>
                    <Label className="text-xs font-medium">Faixa de Preço</Label>
                    <div className="mt-2">
                      <Slider
                        value={priceRange}
                        min={0}
                        max={1000}
                        step={10}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        className="my-5"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>R$ {priceRange[0]}</span>
                        <span>R$ {priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Filtro de região do corpo */}
                  <div>
                    <Label className="text-xs font-medium">Região do Corpo</Label>
                    <div className="flex items-center mt-2">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <Input
                        placeholder="Ex: cabeça, tórax..."
                        value={bodyRegion}
                        onChange={(e) => setBodyRegion(e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Outras opções */}
                  <div>
                    <Label className="text-xs font-medium">Opções Adicionais</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="has-observations" 
                          checked={hasObservations}
                          onCheckedChange={(checked) => setHasObservations(!!checked)}
                        />
                        <label 
                          htmlFor="has-observations" 
                          className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Com observações
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="active-only" 
                          checked={activeOnly}
                          onCheckedChange={(checked) => setActiveOnly(!!checked)}
                        />
                        <label 
                          htmlFor="active-only" 
                          className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Apenas ativos
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Ordenação */}
                  <div>
                    <Label className="text-xs font-medium">Ordenar por</Label>
                    <RadioGroup 
                      value={sortBy} 
                      onValueChange={setSortBy}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="name" id="sort-name" />
                        <label htmlFor="sort-name" className="text-sm">Nome</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="price" id="sort-price" />
                        <label htmlFor="sort-price" className="text-sm">Preço</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="category" id="sort-category" />
                        <label htmlFor="sort-category" className="text-sm">Categoria</label>
                      </div>
                    </RadioGroup>
                    
                    <div className="mt-2 flex gap-2">
                      <Button 
                        variant={sortOrder === 'asc' ? 'default' : 'outline'} 
                        size="sm" 
                        className="text-xs h-7"
                        onClick={() => setSortOrder('asc')}
                      >
                        Crescente
                      </Button>
                      <Button 
                        variant={sortOrder === 'desc' ? 'default' : 'outline'} 
                        size="sm" 
                        className="text-xs h-7"
                        onClick={() => setSortOrder('desc')}
                      >
                        Decrescente
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Botão de aplicar filtros */}
                  <Button 
                    onClick={performSearch} 
                    className="w-full"
                  >
                    Aplicar Filtros
                  </Button>
                </div>
              </div>
              
              {/* Lista de resultados */}
              <div className="flex-1 overflow-y-auto rounded-md border">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin h-6 w-6 border-2 border-gray-300 rounded-full border-t-blue-600"></div>
                    <span className="ml-2 text-gray-500">Carregando...</span>
                  </div>
                ) : results.length > 0 ? (
                  <div>
                    <div className="text-xs text-gray-500 p-2 bg-slate-50 border-b">
                      Exibindo {results.length} de {totalCount} resultados
                    </div>
                    <ul className="divide-y">
                      {results.map((service) => (
                        <li 
                          key={service.id} 
                          className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                          onClick={() => onSelect(service)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getServiceIcon(service.type)}
                              <div>
                                <h4 className="font-medium">{service.name}</h4>
                                <p className="text-sm text-gray-500 line-clamp-1">{service.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="bg-slate-50">
                                {service.category?.name}
                              </Badge>
                              <span className="font-medium text-green-700">
                                R$ {service.price.toFixed(2)}
                              </span>
                              <Button 
                                size="sm" 
                                className="h-7"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onSelect(service)
                                }}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Selecionar
                              </Button>
                            </div>
                          </div>
                          
                          {/* Metadados adicionais, se existirem */}
                          {service.metadata && (
                            <div className="mt-1 pl-6 text-sm">
                              {service.metadata.bodyRegion && (
                                <span className="inline-flex items-center text-xs mr-3 text-gray-500">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {service.metadata.bodyRegion}
                                </span>
                              )}
                              {service.metadata.observations && (
                                <span className="inline-flex items-center text-xs text-gray-500">
                                  <FileText className="h-3 w-3 mr-1" />
                                  Contém observações
                                </span>
                              )}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Search className="h-12 w-12 text-gray-300 mb-2" />
                    <p>Nenhum {currentTab === 'PROCEDURE' ? 'procedimento' : 
                              currentTab === 'EXAM' ? 'exame' : 
                              currentTab === 'CONSULTATION' ? 'consulta' : 
                              'serviço'} encontrado.</p>
                    <p className="text-sm">Tente ajustar os filtros.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 