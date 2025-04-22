
import React from "react";
import { AlertCircle } from "lucide-react";

interface LoginErrorProps {
  error: string;
}

export const LoginError = ({ error }: LoginErrorProps) => {
  if (!error) return null;
  
  return (
    <div className="bg-red-500/20 p-3 rounded-md flex items-start gap-2">
      <AlertCircle size={16} className="text-red-200 mt-0.5 flex-shrink-0" />
      <p className="text-red-200 text-sm">{error}</p>
    </div>
  );
};
