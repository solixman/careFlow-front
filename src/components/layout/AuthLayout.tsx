import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg p-8 rounded-lg shadow-lg bg-card">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
