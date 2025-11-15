import { useContext } from "react";
import { AuthContext } from "./AuthContext";




export default function DashboardRoutes(){

    const auth = useContext(AuthContext);
    const role = auth?.user?.role;

    switch (role){
        case'admin':
        return <AdminDashboard/>;
        case'patient':
        return <PatientDashboard/>;
        case'doctor':
        return <DoctorDashboard/>;
        case'nurse':
        return <NurseDashboard/>;
        default:
            return <div>
                <h3>Unauthorized or unknown role</h3>
            </div>
    }

}