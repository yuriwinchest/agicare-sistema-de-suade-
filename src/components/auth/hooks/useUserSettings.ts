
import { AppUser } from "../types";

export const useUserSettings = ({
  user,
  setUser,
}: {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
}) => {
  const updateUserSettings = (data: Partial<AppUser>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      const prefs = {
        unit: updatedUser.unit,
        room: updatedUser.room,
      };
      localStorage.setItem("user_prefs", JSON.stringify(prefs));
    }
  };

  return updateUserSettings;
};
