
import React from "react";
import { AuthContext } from "./AuthContext";
import { DestinationModalProvider } from "./DestinationModalContext";
import { useAuthProvider } from "./hooks/useAuthProvider";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      <DestinationModalProvider>
        {children}
      </DestinationModalProvider>
    </AuthContext.Provider>
  );
};
