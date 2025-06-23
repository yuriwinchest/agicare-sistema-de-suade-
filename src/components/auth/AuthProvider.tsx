import React, { useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { DestinationModalProvider } from "./DestinationModalContext";
import { useAuthProvider } from "./hooks/useAuthProvider";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuthProvider();

  // Log para depuração
  useEffect(() => {
    console.log("AuthProvider - Estado de autenticação:", {
      isAuthenticated: auth.isAuthenticated,
      isLoading: auth.isLoading,
      user: auth.user
    });
  }, [auth.isAuthenticated, auth.isLoading, auth.user]);

  // Show loading indicator while authentication state is being determined
  if (auth.isLoading) {
    console.log("AuthProvider - Carregando estado de autenticação...");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-teal-500 border-white/30 rounded-full animate-spin mb-4"></div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  console.log("AuthProvider - Renderizando com autenticação:", auth.isAuthenticated);
  return (
    <AuthContext.Provider value={auth}>
      <DestinationModalProvider>
        {children}
      </DestinationModalProvider>
    </AuthContext.Provider>
  );
};
