import { createContext, useContext } from "react";
import type { IUser } from "../@types/interface";

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);
