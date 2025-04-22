
export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  unit?: string;
  room?: string;
}

export interface UserProfile {
  id: string;
  full_name?: string;
  username?: string;
  role: string;
  department_id?: string;
  professional_id?: string;
  is_active?: boolean;
  created_at?: string;
  settings?: Record<string, any>;
  updated_at?: string;
  last_login?: string;
}

export interface AuthContextType {
  user: AppUser | null;
  signin: (email: string, password: string) => Promise<{success: boolean, error?: string}>;
  signout: () => Promise<void>;
  updateUserSettings: (data: Partial<AppUser>) => void;
  isAuthenticated: boolean;
  showDestinationModal: boolean;
  setShowDestinationModal: React.Dispatch<React.SetStateAction<boolean>>;
}
