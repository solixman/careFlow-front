import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import AdminDashboard from "@/pages/dashboard/AdminDashboard";




export default function DashboardRoutes(){

    const auth = useContext(AuthContext);
    const role = auth?.user?.role;

    console.log(auth)
    switch (role){
        case'admin':
        return <AdminDashboard/>;
        // case'patient':
        // return <PatientDashboard/>;
        // case'doctor':
        // return <DoctorDashboard/>;
        // case'nurse':
        // return <NurseDashboard/>;
        default:
            return <div>
                <h3>Unauthorized or unknown role</h3>
            </div>
    }

}