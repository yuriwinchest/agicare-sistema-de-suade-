
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthContext';
import { useNotification } from './useNotification';

/**
 * Hook para sincronizar os dados do usuário autenticado com a tabela users.
 * Este hook garante que quando um usuário se autentica, seus dados são 
 * também armazenados/atualizados na tabela public.users
 */
export const useAuthSync = () => {
  const { user } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const notification = useNotification();

  useEffect(() => {
    const syncUserData = async () => {
      if (!user || !user.id || !user.email) return;

      try {
        setSyncing(true);
        setError(null);

        // Verifica se o usuário já existe na tabela users
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!existingUser) {
          // Se o usuário não existe, cria um novo registro
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: user.id,
              email: user.email,
              name: user.name || user.email.split('@')[0],
              avatar_url: user.avatar_url || null
            });

          if (insertError) throw insertError;
          
          console.log("Usuário sincronizado com a tabela users");
        } else {
          // Se o usuário existe, atualiza os dados se necessário
          if (
            existingUser.email !== user.email ||
            existingUser.name !== user.name ||
            existingUser.avatar_url !== user.avatar_url
          ) {
            const { error: updateError } = await supabase
              .from('users')
              .update({
                email: user.email,
                name: user.name || existingUser.name,
                avatar_url: user.avatar_url || existingUser.avatar_url
              })
              .eq('id', user.id);

            if (updateError) throw updateError;
            
            console.log("Dados do usuário atualizados na tabela users");
          }
        }
      } catch (err: any) {
        console.error("Erro ao sincronizar usuário:", err);
        setError(err.message || "Erro ao sincronizar dados do usuário");
        notification.error("Erro de sincronização", {
          description: "Não foi possível sincronizar seus dados de usuário."
        });
      } finally {
        setSyncing(false);
      }
    };

    syncUserData();
  }, [user, notification]);

  return { syncing, error };
};
