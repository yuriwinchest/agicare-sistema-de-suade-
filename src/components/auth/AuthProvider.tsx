
import React from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "./AuthContext";
import { useSession } from "@/hooks/useSession";
import { AppUser } from "./types";
import { useSignin } from "./hooks/useSignin";
import { useSignout } from "./hooks/useSignout";
import { useUserSettings } from "./hooks/useUserSettings";
import { DestinationModalProvider } from "./DestinationModalContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, setUser, setIsAuthenticated } = useSession();

  const signin = useSignin({ setUser, setIsAuthenticated });
  const signout = useSignout({ setUser, setIsAuthenticated });
  const updateUserSettings = useUserSettings({ user, setUser });

  const value = {
    user,
    signin,
    signout,
    updateUserSettings,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      <DestinationModalProvider>
        {children}
      </DestinationModalProvider>
    </AuthContext.Provider>
  );
};
