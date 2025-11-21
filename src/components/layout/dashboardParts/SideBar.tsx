import React from "react";
import "../../css/dashboard.css";

interface SidebarProps {
  role: string;
  onSelectComponent: (key: string) => void;
}
const Sidebar: React.FC<SidebarProps> = ({ role, onSelectComponent }) => {

    const menuByRole: Record<string, { name: string; key: string }[]> = {
    admin: [
      { name: "Dashboard", key: "dashboard" },
      { name: "Users", key: "users" },
      { name: "Appointments", key: "appointments" },
      { name: "Consultations", key: "consultations" },
    ],
    doctor: [
      { name: "Dashboard", key: "dashboard" },
      { name: "Appointments", key: "appointments" },
      { name: "Consultations", key: "consultations" },
    ],
    patient: [
      { name: "Dashboard", key: "dashboard" },
      { name: "Appointments", key: "appointments" },
      { name: "Consultations", key: "consultations" },  
    ],
  };

  const items = menuByRole[role] || [];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">CareFlow</div>
      <nav className="sidebar-nav">
        {items.map((item, index) => (
          <button
            key={index}
            className="sidebar-link"
            onClick={() => onSelectComponent(item.key)}
          >
            {item.name}
          </button>
        ))}
      </nav>
      <button onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }} className="sidebar-logout">
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;