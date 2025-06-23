import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const RequireAuth = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Log para depuração
  useEffect(() => {
    console.log("RequireAuth - Estado de autenticação:", { isAuthenticated, isLoading, user, path: location.pathname });
  }, [isAuthenticated, isLoading, user, location]);

  // Se estiver carregando, não faz nada ainda
  if (isLoading) {
    console.log("RequireAuth - Carregando autenticação...");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-teal-500 border-white/30 rounded-full animate-spin mb-4"></div>
          <p className="text-white">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    console.log("RequireAuth - Não autenticado, redirecionando para login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se estiver autenticado, permite acesso
  console.log("RequireAuth - Autenticado, permitindo acesso");
  return <Outlet />;
};
