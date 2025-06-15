import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { MapPin, MessageSquare, Tag, AlertCircle } from 'lucide-react'
import { updateServiceMetadata } from '@/services/payments/advanced-search'
import type { ServicePrice } from '@/types/services'

interface ServiceDetailsEditorProps {
  isOpen: boolean
  onClose: () => void
  service: ServicePrice | null
  onSave: (service: ServicePrice, observations: string, bodyRegion: string) => void
}

export default function ServiceDetailsEditor({
  isOpen,
  onClose,
  service,
  onSave
}: ServiceDetailsEditorProps) {
  const [observations, setObservations] = useState<string>('')
  const [bodyRegion, setBodyRegion] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  
  // Carregar os dados quando o serviço muda
  useEffect(() => {
    if (service?.metadata) {
      setObservations(service.metadata.observations || '')
      setBodyRegion(service.metadata.bodyRegion || '')
    } else {
      setObservations('')
      setBodyRegion('')
    }
  }, [service])
  
  // Determina o tipo de serviço para exibir texto apropriado
  const getServiceTypeText = (type?: string) => {
    switch (type) {
      case 'EXAM':
        return 'Exame'
      case 'PROCEDURE':
        return 'Procedimento'
      case 'CONSULTATION':
        return 'Consulta'
      case 'OTHER':
        return 'Serviço'
      default:
        return 'Item'
    }
  }
  
  // Salvar as informações do serviço
  const handleSave = async () => {
    if (!service) return
    
    try {
      setIsSubmitting(true)
      
      // Atualizar os metadados no banco de dados
      await updateServiceMetadata(
        service.id,
        observations.trim() || null,
        bodyRegion.trim() || null
      )
      
      // Notificar o componente pai sobre as alterações
      onSave(
        service,
        observations.trim(),
        bodyRegion.trim()
      )
      
      onClose()
    } catch (error) {
      console.error('Erro ao salvar detalhes do serviço:', error)
      alert('Não foi possível salvar os detalhes do serviço. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Retornar nulo se não houver serviço selecionado
  if (!service) return null
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalhes do {getServiceTypeText(service.type)}</DialogTitle>
          <DialogDescription>
            Adicione informações específicas para este {getServiceTypeText(service.type).toLowerCase()}.
          </DialogDescription>
        </DialogHeader>
        
        {/* Informações do serviço */}
        <div className="space-y-4 my-4">
          <div className="bg-slate-50 p-3 rounded-md">
            <h3 className="font-medium flex items-center gap-1.5">
              <Tag className="h-4 w-4" />
              {service.name}
            </h3>
            {service.description && (
              <p className="text-sm text-gray-600 mt-1">{service.description}</p>
            )}
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-gray-500">
                {service.category?.name || 'Sem categoria'}
              </span>
              <span className="font-medium text-green-700">
                R$ {service.price.toFixed(2)}
              </span>
            </div>
          </div>
          
          {/* Região do corpo (mais relevante para exames e procedimentos) */}
          <div className="space-y-2">
            <Label htmlFor="bodyRegion" className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              Região do Corpo
            </Label>
            <Input
              id="bodyRegion"
              placeholder="Ex: braço direito, joelho esquerdo, abdome..."
              value={bodyRegion}
              onChange={(e) => setBodyRegion(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Especifique a região do corpo onde o {getServiceTypeText(service.type).toLowerCase()} será realizado, se aplicável.
            </p>
          </div>
          
          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observations" className="flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4" />
              Observações
            </Label>
            <Textarea
              id="observations"
              placeholder={`Adicione observações sobre este ${getServiceTypeText(service.type).toLowerCase()}...`}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-gray-500">
              Inclua instruções especiais, detalhes importantes ou outras informações relevantes.
            </p>
          </div>
          
          {/* Aviso específico baseado no tipo de serviço */}
          {(service.type === 'EXAM' || service.type === 'PROCEDURE') && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-700">Instruções importantes</p>
                <p className="text-amber-600">
                  {service.type === 'EXAM' 
                    ? 'Certifique-se de incluir quaisquer orientações de preparo necessárias para o exame.'
                    : 'Informe detalhes específicos que possam ser relevantes para a realização deste procedimento.'}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Informações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 