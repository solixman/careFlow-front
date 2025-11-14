import { createContext } from "react";

export interface UserProps {
  id: string, name:string, email: string, role: string,status:string
}

interface AuthContextType {
  user: UserProps | null;
  token: string | null;
  setUser: (user: UserProps) => void;
  setToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
