
export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
  unit?: string;
  room?: string;
}

export interface UserProfile {
  id: string;
  created_at?: string;
  updated_at?: string;
  name?: string;
  email?: string;
  avatar_url?: string;
  settings?: any;
}

export interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signout: () => Promise<void>;
  updateUserSettings: (settings: Partial<AppUser>) => Promise<boolean>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface RequireAuthProps {
  children?: React.ReactNode;
}
