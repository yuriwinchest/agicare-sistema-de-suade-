
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-medgray-100 p-6">
      <div className="w-full max-w-md glass-card p-8 text-center animate-fadeIn">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
          </div>
        </div>
        <h1 className="text-3xl font-semibold mb-3">Página não encontrada</h1>
        <p className="text-muted-foreground mb-6">
          A página que você está tentando acessar não existe ou foi movida.
        </p>
        <Link to="/">
          <Button className="w-full">
            Voltar para o Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
