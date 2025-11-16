import React, { useContext } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import LoginForm from "../components/forms/LoginForm";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/components/context/AuthContext";
import "../components/css/login.css";

interface UserProps {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const LoginPage: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogin = (loggedUser: UserProps, accessToken: string) => {
    auth?.setUser(loggedUser);
    auth?.setToken(accessToken);
    localStorage.setItem("token", accessToken);
    navigate("/dashboard");
  };

  return (
    <AuthLayout>
      <div className="login-wrapper">
        <div className="login-left">
          <video
            className="login-video"
            src="/videos/medical-bg.mp4"
            autoPlay
            loop
            muted
          ></video>
          <div className="login-overlay">
            <div className="welcome-text">
              <h1>Welcome back!</h1>
              <p>You can sign in to access your CareFlow account.</p>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-card">
            <h2>Sign In</h2>
            <LoginForm onLogin={onLogin} />
            <div className="login-footer">
              <a href="#">Forgot password?</a>
              <p>
                New here? <a href="/register">Create an account</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
