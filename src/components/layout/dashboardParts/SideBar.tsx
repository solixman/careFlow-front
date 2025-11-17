import React from "react";
import "../../css/dashboard.css";

interface SidebarProps {
  role: string;
  onSelectComponent: (key: string) => void; // Now takes a string key
}

const Sidebar: React.FC<SidebarProps> = ({ role, onSelectComponent }) => {
  // Define menu items with keys (not components)
  const menuByRole: Record<string, { name: string; key: string }[]> = {
    admin: [
      { name: "Dashboard", key: "dashboard" },
      { name: "Users", key: "users" },
      { name: "Patients", key: "patients" },
      { name: "Appointments", key: "appointments" },
    ],
    doctor: [
      { name: "Dashboard", key: "dashboard" },
      { name: "Patients", key: "patients" },
      { name: "Appointments", key: "appointments" },
      { name: "Prescriptions", key: "prescriptions" },
    ],
    patient: [
      { name: "Dashboard", key: "dashboard" },
      { name: "Appointments", key: "appointments" },
      { name: "Prescriptions", key: "prescriptions" },
      { name: "Documents", key: "documents" },
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