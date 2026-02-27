import { createContext, useContext } from "react";
import type { IUser } from "../@types/interface";

interface AuthContextType {
  currentUser: IUser | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);
