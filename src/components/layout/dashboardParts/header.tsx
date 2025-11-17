import React from "react";
import "../../css/dashboard.css";

interface HeaderProps {
  user: { name: string; email: string; role?: string };
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="dashboard-header">
      <h2 className="dashboard-title">CareFlow Dashboard</h2>
      <div className="dashboard-user">
        <div>
          <a href="/profile" className="profile-link">
            <span>{user.name}</span>
          </a>
          <br />
        </div>
      </div>
    </header>
  );
};

export default Header;
