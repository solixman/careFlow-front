import { Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import DashboardRoutes from "./components/context/Dashboardroutes";
import OnlyAuth from "./components/context/OnlyAuth";

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
              <DashboardRoutes />
            </OnlyAuth>
        }
        />
    </Routes>
  );
}

export default App;
