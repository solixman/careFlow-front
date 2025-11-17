import React, { useContext, useState } from "react";
import { AuthContext } from "@/components/context/AuthContext";
import Sidebar from "../layout/dashboardParts/SideBar";
import Header from "../layout/dashboardParts/Header";
import Footer from "../layout/dashboardParts/Footer";
import Appointments from "@/pages/dashboardComponants/Appointments"; 

import "../css/dashboard.css";

const DashboardLayout: React.FC = () => {
  const auth = useContext(AuthContext);
  const [selectedKey, setSelectedKey] = useState<string>("dashboard");

  
  if (!auth) {
    return <div className="dashboard-wrapper">Loading...</div>;
  }
  if (!auth.user) {
    return <div className="dashboard-wrapper">Please log in to access the dashboard.</div>;
  }

  
  const renderComponent = () => {
    switch (selectedKey) {
      case "appointments":
        return <Appointments />;
      case "dashboard":
        return <div>Welcome to the Dashboard!</div>;
      case "users":
        return <div>Users Component (Not Implemented)</div>; 
      case "patients":
        return <div>Patients Component (Not Implemented)</div>; 
      case "prescriptions":
        return <div>Prescriptions Component (Not Implemented)</div>; 
      case "documents":
        return <div>Documents Component (Not Implemented)</div>; 
      default:
        return <div>Welcome to the Dashboard!</div>;
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <Sidebar role={auth.user.role} onSelectComponent={setSelectedKey} />

      {/* Main content */}
      <div className="dashboard-main">
        <Header user={auth.user} />
        <main className="dashboard-content">
          {renderComponent()}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;