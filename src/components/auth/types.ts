
import { User } from "@supabase/supabase-js";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  unit?: string;
  room?: string;
}

export interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  signin: (email: string, password: string) => Promise<{success: boolean, error?: string}>;
  signout: () => Promise<void>;
  updateUserSettings: (data: Partial<AppUser>) => void;
}
