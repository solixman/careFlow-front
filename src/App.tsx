import { Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import OnlyAuth from "./components/context/OnlyAuth";
import DashboardLayout from "./components/layout/dashboardLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
            <OnlyAuth>
              <DashboardLayout />
            </OnlyAuth>
        }
        />
    </Routes>
  );
}

export default App;
