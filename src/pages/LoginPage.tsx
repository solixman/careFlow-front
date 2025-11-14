import React, { useState } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import LoginForm from "../components/forms/LoginForm";
import { useNavigate } from "react-router-dom";


interface UserProps {
  id: string, name:string, email: string, role: string,status:string
}

const LoginPage: React.FC = () => {
  const [user, setUser] = useState<UserProps | null >(null);
  const [token, setToken] = useState<string | null>(null);
  console.log(user)
  console.log(token)

  const navigate = useNavigate();

  const onLogin = (loggedUser: UserProps, accessToken: string) => {
  
  localStorage.setItem("token", accessToken);

    setUser(loggedUser);
    setToken(accessToken);

    navigate("/dashboard");
  };

  return (
    <AuthLayout>
      <div className="flex h-screen">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md p-10 rounded-lg shadow-lg backdrop-blur-md bg-background/80">
            <h1 className="text-3xl font-bold mb-6 text-foreground text-center">
              Welcome Back
            </h1>

            <p className="text-sm mb-6 text-muted-foreground text-center">
              Sign in to your account to continue
            </p>

            <LoginForm onLogin={onLogin} />
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
