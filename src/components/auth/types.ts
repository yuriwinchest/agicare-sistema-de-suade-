
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  role: string;
  department_id?: string;
  professional_id?: string;
  is_active: boolean;
  settings: Record<string, any>;
}

export interface AppUser {
  id: string;
  name: string;
  email?: string;
  role: string;
  unit?: string;
  room?: string;
  profile?: UserProfile;
}

export type AuthContextType = {
  user: AppUser | null;
  signin: (email: string, password: string) => Promise<boolean>;
  signout: () => Promise<void>;
  updateUserSettings: (data: Partial<AppUser>) => void;
  isAuthenticated: boolean;
  showDestinationModal: boolean;
  setShowDestinationModal: (show: boolean) => void;
};

