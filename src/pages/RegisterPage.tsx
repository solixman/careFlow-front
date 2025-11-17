import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout";
import RegisterForm from "@/components/forms/RegisterForm";
import "../components/css/register.css"; 
import { AuthContext } from "@/components/context/AuthContext";

interface UserProps {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const RegisterPage: React.FC = () => {
  const auth = useContext(AuthContext);
   const navigate = useNavigate();
 
   const onRegister = (loggedUser: UserProps, accessToken: string) => {
     auth?.setUser(loggedUser);
     auth?.setToken(accessToken);
     localStorage.setItem("token", accessToken);
     navigate("/dashboard");
   };

  return (
    <AuthLayout>
      <div className="register-wrapper">
        <div className="register-left">
        
          <div className="register-overlay">
            <div className="welcome-text">
              <h1>Join CareFlow!</h1>
              <p>Create your account to access all features.</p>
            </div>
          </div>
        </div>

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
