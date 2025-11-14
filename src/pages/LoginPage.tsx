// import React, { useState, createContext, useContext } from "react";import AuthLayout from "../components/layout/AuthLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import LoginForm from "../components/forms/LoginForm";
// import { useNavigate } from "react-router-dom";
import React from "react";

// const AuthContext = createContext({});
// export function useAuth() {
// return useContext(AuthContext);
// }


const LoginPage: React.FC = () => {
// const [user, setUser] = useState({});
// const [token, setToken] = useState('null');

// const navigate = useNavigate();


// function onLogin(loggedUser, accessToken:string) {

// localStorage.setItem("token", accessToken);


// setUser(loggedUser);
// setToken(accessToken);


// // Redirect the user
// navigate("/dashboard");
// }

  return (
    <AuthLayout>
      <div className="flex h-screen">
        {/* <div className="relative flex-1">
      <video
        src={BackVideo}
        autoPlay
        loop
        muted
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40"></div>
    </div> */}

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md p-10 rounded-lg shadow-lg backdrop-blur-md bg-background/80">
            <h1 className="text-3xl font-bold mb-6 text-foreground text-center">
              Welcome Back 
            </h1>
            <p className="text-sm mb-6 text-muted-foreground text-center">
              Sign in to your account to continue
            </p>
            <LoginForm/>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
