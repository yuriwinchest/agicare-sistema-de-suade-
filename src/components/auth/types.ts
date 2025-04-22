
import { User } from "@supabase/supabase-js";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  unit?: string;
  room?: string;
  avatar_url?: string; // Added avatar_url property
}

export interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  signin: (email: string, password: string) => Promise<{success: boolean, error?: string}>;
  signout: () => Promise<void>;
  updateUserSettings: (data: Partial<AppUser>) => void;
}

// Add the UserProfile interface
export interface UserProfile {
  id?: string;
  full_name?: string;
  username?: string;
  role?: string;
  department_id?: string;
  professional_id?: string;
  is_active?: boolean;
  settings?: Record<string, any>;
}
