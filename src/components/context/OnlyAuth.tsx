import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/components/context/AuthContext";

const OnlyAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useContext(AuthContext);
 console.log(auth?.user)  
  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default OnlyAuth;
