import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout";
import RegisterForm from "@/components/forms/RegisterForm";
import "../components/css/register.css"; 

interface UserProps {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const RegisterPage: React.FC = () => {
  const [user, setUser] = useState<UserProps | null>(null);
  const [token, setToken] = useState<string | null>(null);
  console.log(user,token) 
  const navigate = useNavigate();

  const onRegister = (loggedUser: UserProps, accessToken: string) => {
    localStorage.setItem("token", accessToken);
    setUser(loggedUser);
    setToken(accessToken);
    navigate("/dashboard");
  };

  return (
    <AuthLayout>
      <div className="register-wrapper">
        {/* Left Video Section */}
        <div className="register-left">
          <video
            className="register-video"
            src="/videos/medical-bg.mp4"
            autoPlay
            loop
            muted
          />
          <div className="register-overlay">
            <div className="welcome-text">
              <h1>Join CareFlow!</h1>
              <p>Create your account to access all features.</p>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="register-right">
          <div className="register-card">
            <h2>Create Account</h2>
            <RegisterForm onRegister={onRegister} />
            <div className="register-footer">
              <p>
                Already have an account? <a href="/login">Sign in</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
