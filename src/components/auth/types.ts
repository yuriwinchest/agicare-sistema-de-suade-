
export type User = {
  id: string;
  name: string;
  role: string;
  unit?: string;
  room?: string;
  email?: string;
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
