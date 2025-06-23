import React, { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";

import { ensureStorageBuckets } from './services/storageService';

// Configuração de Providers
import { AuthProvider } from "@/components/auth/AuthContext";
import { SidebarProvider } from "./components/layout/SidebarContext";

// Componente de Roteamento
import AppRoutes from './components/routing/AppRoutes';

// Componente de Loading
import LoadingScreen from './components/ui/LoadingScreen';

// Componente de Notificação Offline
import OfflineNotification from './components/ui/OfflineNotification';

/**
 * Componente principal da aplicação
 * Responsabilidade: Configurar providers globais e gerenciar estado da aplicação
 * Organiza a estrutura de contextos e roteamento
 */

// Configuração do cliente de queries
const queryClient = new QueryClient();

function App() {
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Efeito para inicialização da aplicação
   * Responsabilidade: Configurar modo offline e inicializar serviços
   */
  useEffect(() => {
    // Verificar se o modo offline está ativado
    const offlineMode = import.meta.env.VITE_OFFLINE_MODE === 'true';
    setIsOfflineMode(offlineMode);

    if (!offlineMode) {
      // Ensure storage buckets exist when the app starts
      ensureStorageBuckets().catch(console.error);
    } else {
      console.log('Aplicação rodando em modo offline. Dados simulados serão usados.');
    }

    // Simular carregamento inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Renderizar tela de loading durante inicialização
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <BrowserRouter>
          <AuthProvider>
            <SidebarProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />

                {/* Notificação de modo offline */}
                {isOfflineMode && <OfflineNotification />}

                {/* Sistema de roteamento da aplicação */}
                <AppRoutes />
              </TooltipProvider>
            </SidebarProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
