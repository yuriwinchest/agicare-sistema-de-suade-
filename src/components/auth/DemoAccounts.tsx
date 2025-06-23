import React from "react";
import { Info } from "lucide-react";

interface DemoAccountsProps {
  onDemoLogin: (type: 'admin' | 'doctor') => void;
}

export const DemoAccounts = ({ onDemoLogin }: DemoAccountsProps) => {
  return (
    <div className="bg-blue-500/20 p-3 rounded-md text-sm text-blue-200">
      <p className="font-semibold mb-1 flex items-center gap-2">
        <Info size={14} /> Acesso rápido:
      </p>
      <div className="space-y-2 mt-2">
        <button
          type="button"
          onClick={() => onDemoLogin('admin')}
          className="w-full py-1.5 px-2 bg-blue-400/30 hover:bg-blue-400/40 rounded text-center transition-colors"
        >
          Acessar como Administrador
        </button>
        <button
          type="button"
          onClick={() => onDemoLogin('doctor')}
          className="w-full py-1.5 px-2 bg-blue-400/30 hover:bg-blue-400/40 rounded text-center transition-colors"
        >
          Acessar como Médico
        </button>
      </div>
    </div>
  );
};
