import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CollaboratorFormValues } from '@/hooks/useCollaboratorForm';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trash2, Edit, UserCheck, UserX, RefreshCw, ServerOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditCollaboratorDialog } from './EditCollaboratorDialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export const CollaboratorGrid = () => {
  const [collaborators, setCollaborators] = useState<CollaboratorFormValues[]>([]);
  const [selectedCollaborator, setSelectedCollaborator] = useState<CollaboratorFormValues | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [serverAvailable, setServerAvailable] = useState(true);
  const { toast } = useToast();

  const checkServerAvailability = async () => {
    try {
      // Obter a chave anônima do Supabase das variáveis de ambiente ou usar a chave padrão
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xspmibkhtmnetivtnjox.supabase.co';
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzcG1pYmtodG1uZXRpdnRuam94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NjcwMzUsImV4cCI6MjA2MDI0MzAzNX0.eOILz9zyxyM8i0ZJ3AHrjlWK1AFbf_MX2i62m3KNYsA";
      
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          "apikey": supabaseAnonKey,
          "Authorization": `Bearer ${supabaseAnonKey}`
        }
      });
      
      setServerAvailable(response.ok);
      return response.ok;
    } catch (error) {
      console.error('Erro ao verificar disponibilidade do servidor:', error);
      setServerAvailable(false);
      return false;
    }
  };

  const fetchCollaborators = async () => {
    setIsLoading(true);
    try {
      // Verificar disponibilidade do servidor
      const isAvailable = await checkServerAvailability();
      if (!isAvailable) {
        setCollaborators([]);
        toast({
          title: 'Servidor indisponível',
          description: 'O servidor de dados está temporariamente indisponível. Tente novamente mais tarde.',
          variant: 'destructive',
        });
        return;
      }

      const { data, error } = await supabase
        .from('collaborators')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setCollaborators(data || []);
    } catch (error) {
      console.error('Erro ao carregar colaboradores:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar a lista de colaboradores',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborators();
  }, []);

  const handleEdit = (collaborator: CollaboratorFormValues) => {
    if (!serverAvailable) {
      toast({
        title: 'Servidor indisponível',
        description: 'Não é possível editar colaboradores no momento pois o servidor está indisponível.',
        variant: 'destructive',
      });
      return;
    }
    setSelectedCollaborator(collaborator);
    setIsEditDialogOpen(true);
  };

  const handleRemove = async (id: string) => {
    if (!serverAvailable) {
      toast({
        title: 'Servidor indisponível',
        description: 'Não é possível remover colaboradores no momento pois o servidor está indisponível.',
        variant: 'destructive',
      });
      return;
    }

    if (!window.confirm('Tem certeza que deseja remover este colaborador?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('collaborators')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setCollaborators(collaborators.filter(c => c.id !== id));
      toast({
        title: 'Colaborador removido',
        description: 'O colaborador foi removido com sucesso',
      });
    } catch (error) {
      console.error('Erro ao remover colaborador:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o colaborador',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    if (!serverAvailable) {
      toast({
        title: 'Servidor indisponível',
        description: 'Não é possível alterar o status do colaborador no momento pois o servidor está indisponível.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('collaborators')
        .update({ active: !currentStatus })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setCollaborators(
        collaborators.map(c => 
          c.id === id ? { ...c, active: !currentStatus } : c
        )
      );

      toast({
        title: 'Status atualizado',
        description: `Colaborador ${!currentStatus ? 'ativado' : 'desativado'} com sucesso`,
      });
    } catch (error) {
      console.error('Erro ao atualizar status do colaborador:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status do colaborador',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div>
          {!serverAvailable && (
            <div className="bg-red-100 text-red-800 rounded-lg p-2 flex items-center mb-4">
              <ServerOff className="h-5 w-5 mr-2" />
              <span>Servidor indisponível. As operações estão limitadas.</span>
            </div>
          )}
        </div>
        <Button 
          variant="outline" 
          onClick={fetchCollaborators}
          disabled={isLoading}
          className="bg-white/30 text-white hover:bg-white/40 border-white/30"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Carregando...' : 'Atualizar'}
        </Button>
      </div>

      {collaborators.length === 0 ? (
        <div className="text-center bg-white/30 backdrop-blur-md rounded-lg p-8 text-white">
          {isLoading ? 'Carregando colaboradores...' : (
            serverAvailable 
              ? 'Nenhum colaborador cadastrado' 
              : 'Servidor indisponível. Não foi possível carregar os colaboradores.'
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collaborators.map((collaborator) => (
            <div 
              key={collaborator.id} 
              className={`bg-white/30 backdrop-blur-md rounded-lg p-4 flex flex-col ${
                !collaborator.active ? 'opacity-70' : 'opacity-100'
              }`}
            >
              <div className="flex items-center mb-4">
                <Avatar className="h-12 w-12 mr-3 border-2 border-white/50">
                  <AvatarImage src={collaborator.image_url || ''} />
                  <AvatarFallback className="bg-teal-100 text-teal-800">
                    {collaborator.name?.slice(0, 2).toUpperCase() || 'UN'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-medium text-white truncate">{collaborator.name}</h3>
                  <p className="text-sm text-white/80 truncate">{collaborator.email}</p>
                </div>
                <Badge 
                  className={`ml-2 ${
                    collaborator.active 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-red-500 hover:bg-red-600'
                  } text-white`}
                >
                  {collaborator.active ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              
              <div className="text-sm space-y-1 mb-4">
                <p className="text-white"><span className="font-medium">Função:</span> {collaborator.role || 'Não definido'}</p>
                <p className="text-white"><span className="font-medium">Especialidade:</span> {collaborator.specialty || 'Não definido'}</p>
                <p className="text-white"><span className="font-medium">Departamento:</span> {collaborator.department || 'Não definido'}</p>
                <p className="text-white"><span className="font-medium">Telefone:</span> {collaborator.phone || 'Não informado'}</p>
              </div>
              
              <div className="flex justify-end mt-auto space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleToggleActive(collaborator.id || '', collaborator.active || false)}
                  disabled={!serverAvailable}
                  className="bg-white/30 text-white hover:bg-white/40 border-white/30"
                >
                  {collaborator.active ? <UserX size={16} /> : <UserCheck size={16} />}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEdit(collaborator)}
                  disabled={!serverAvailable}
                  className="bg-white/30 text-white hover:bg-white/40 border-white/30"
                >
                  <Edit size={16} />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleRemove(collaborator.id || '')}
                  disabled={!serverAvailable}
                  className="bg-red-500/70 hover:bg-red-500/90"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCollaborator && (
        <EditCollaboratorDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedCollaborator(null);
          }}
          collaborator={selectedCollaborator}
          onSuccess={fetchCollaborators}
        />
      )}
    </div>
  );
};
