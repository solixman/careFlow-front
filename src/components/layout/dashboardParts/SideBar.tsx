import React from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  role: string;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  // Define menu items for each role
  const menuByRole: Record<string, { name: string; path: string }[]> = {
    admin: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Users", path: "/users" },
      { name: "Patients", path: "/patients" },
      { name: "Appointments", path: "/appointments" },
    ],
    doctor: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Patients", path: "/patients" },
      { name: "Appointments", path: "/appointments" },
      { name: "Prescriptions", path: "/prescriptions" },
    ],
    patient: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Appointments", path: "/appointments" },
      { name: "Prescriptions", path: "/prescriptions" },
      { name: "Documents", path: "/documents" },
    ],
  };

  const items = menuByRole[role] || [];

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col">
      <div className="p-4 font-bold text-xl border-b">CareFlow</div>
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="block py-2 px-3 rounded hover:bg-gray-100"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
