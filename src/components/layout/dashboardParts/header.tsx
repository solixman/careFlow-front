import React from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  user: { name: string; email: string };
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload(); // resets context
  }

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <div className="flex items-center gap-4">
        <span className="text-gray-700">{user.name}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
