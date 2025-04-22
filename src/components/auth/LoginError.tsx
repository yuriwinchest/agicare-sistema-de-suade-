
import React from "react";
import { AlertCircle, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LoginErrorProps {
  error: string;
}

export const LoginError = ({ error }: LoginErrorProps) => {
  if (!error) return null;
  
  return (
    <div className="bg-red-500/20 p-3 rounded-md flex items-start gap-2">
      <AlertCircle size={16} className="text-red-200 mt-0.5 flex-shrink-0" />
      <div className="flex flex-col space-y-1">
        <p className="text-red-200 text-sm">{error}</p>
        {error.includes("Múltiplas tentativas") && (
          <div className="flex items-center gap-1 text-xs text-red-200/80">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center">
                  <HelpCircle size={12} className="mr-1" /> O que fazer?
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Se você já é colaborador, o sistema tentará criar sua conta automaticamente. 
                     Se ainda assim persistir o erro, entre em contato com o administrador ou use as contas de demonstração abaixo.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        {error.includes("Este email não está cadastrado") && (
          <div className="flex items-center gap-1 text-xs text-red-200/80">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center">
                  <HelpCircle size={12} className="mr-1" /> O que fazer?
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Verifique se digitou o e-mail corretamente. Caso seja um colaborador, 
                     solicite que o administrador cadastre seu e-mail no sistema primeiro.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
};
