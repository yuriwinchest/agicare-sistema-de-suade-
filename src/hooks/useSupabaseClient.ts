import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/components/auth/AuthContext';

/**
 * Hook personalizado que fornece um cliente Supabase autenticado
 * usando o token de acesso do usuário atual.
 */
export function useSupabaseClient() {
  const { user, isAuthenticated } = useAuth();
  const [client, setClient] = useState(supabase);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    async function setupClient() {
      try {
        // Verificar se o usuário está autenticado
        if (!isAuthenticated) {
          // Se não estiver autenticado, usar o cliente padrão (anônimo)
          setClient(supabase);
          return;
        }

        // Obter sessão atual
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          console.error("Sessão não encontrada mesmo com usuário autenticado");
          setSessionExpired(true);
          setClient(supabase);
          return;
        }

        // Criar um novo cliente Supabase usando o token de acesso atual
        const accessToken = sessionData.session.access_token;
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://xspmibkhtmnetivtnjox.supabase.co";
        
        const authenticatedClient = createClient<Database>(
          supabaseUrl,
          import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzcG1pYmtodG1uZXRpdnRuam94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NjcwMzUsImV4cCI6MjA2MDI0MzAzNX0.eOILz9zyxyM8i0ZJ3AHrjlWK1AFbf_MX2i62m3KNYsA",
          {
            global: {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          }
        );

        setClient(authenticatedClient);
        setSessionExpired(false);
      } catch (error) {
        console.error("Erro ao configurar cliente Supabase autenticado:", error);
        // Em caso de erro, usar o cliente padrão
        setClient(supabase);
      }
    }

    setupClient();

    // Configurar listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setupClient();
      } else if (event === 'SIGNED_OUT') {
        setClient(supabase);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isAuthenticated, user]);

  return {
    client,
    sessionExpired,
    refreshClient: async () => {
      const { data } = await supabase.auth.refreshSession();
      if (data.session) {
        // Criar novo cliente com token atualizado
        const refreshedClient = createClient<Database>(
          import.meta.env.VITE_SUPABASE_URL || "https://xspmibkhtmnetivtnjox.supabase.co",
          import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzcG1pYmtodG1uZXRpdnRuam94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NjcwMzUsImV4cCI6MjA2MDI0MzAzNX0.eOILz9zyxyM8i0ZJ3AHrjlWK1AFbf_MX2i62m3KNYsA",
          {
            global: {
              headers: {
                Authorization: `Bearer ${data.session.access_token}`,
              },
            },
          }
        );
        setClient(refreshedClient);
        setSessionExpired(false);
        return true;
      }
      return false;
    }
  };
} 