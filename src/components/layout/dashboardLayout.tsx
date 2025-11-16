import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "@/components/context/AuthContext";
import Sidebar from "../layout/dashboardParts/SideBar";
import Header from "../layout/dashboardParts/header";

const DashboardLayout: React.FC = () => {
  const auth = useContext(AuthContext);

  if (!auth?.user) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar role={auth.user.role} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Header user={auth.user} />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet /> {/* renders child routes here */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
