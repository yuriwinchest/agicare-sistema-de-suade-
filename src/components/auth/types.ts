
export type User = {
  id: string;
  name: string;
  role: string;
  unit?: string;
  room?: string;
  email?: string;
  profile?: UserProfile;
};

export type UserProfile = {
  id: string;
  username: string;
  full_name: string;
  role: string;
  department_id?: string;
  professional_id?: string;
  is_active: boolean;
  settings: Record<string, any>;
};

export type AuthContextType = {
  user: User | null;
  signin: (email: string, password: string) => Promise<boolean>;
  signout: () => Promise<void>;
  updateUserSettings: (data: Partial<User>) => void;
  isAuthenticated: boolean;
  showDestinationModal: boolean;
  setShowDestinationModal: (show: boolean) => void;
};
