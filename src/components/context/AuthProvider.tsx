import React, { useContext, useState } from "react";
import { UserProps ,AuthContext } from "./AuthContext";

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const auth = useContext(AuthContext);
  const [user, setUser] = useState<UserProps | null >(auth?.user);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
