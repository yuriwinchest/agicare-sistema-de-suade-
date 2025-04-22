
import React, { createContext, useContext } from "react";
import { AuthContextType } from "./types";

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Export the provider and RequireAuth separately
export { AuthProvider } from "./AuthProvider";
export { RequireAuth } from "./RequireAuth";
