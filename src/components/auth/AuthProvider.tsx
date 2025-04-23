
import React from "react";
import { AuthContext } from "./AuthContext";
import { DestinationModalProvider } from "./DestinationModalContext";
import { useAuthProvider } from "./hooks/useAuthProvider";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuthProvider();

  // Show loading indicator while authentication state is being determined
  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-teal-500 border-white/30 rounded-full animate-spin mb-4"></div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={auth}>
      <DestinationModalProvider>
        {children}
      </DestinationModalProvider>
    </AuthContext.Provider>
  );
};
