
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
  signin: (email: string, password: string) => Promise<{success: boolean, error?: string}>;
  signout: () => Promise<void>;
  updateUserSettings: (data: Partial<AppUser>) => void;
  isAuthenticated: boolean;
  showDestinationModal: boolean;
  setShowDestinationModal: React.Dispatch<React.SetStateAction<boolean>>;
}
