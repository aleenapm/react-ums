import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
    isAdmin?: boolean;
}

export const ProtectedRoute = ({ isAdmin = false }: ProtectedRouteProps) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const admin = useSelector((state: RootState) => state.admin.admin);

    if(isAdmin && !admin) {
        return <Navigate to="/admin/login" />;
    }

    if(!isAdmin && !user) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export const RedirectRoute = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const admin = useSelector((state: RootState) => state.admin.admin);

    if(user) return <Navigate to="/dashboard" replace/>
    if(admin) return <Navigate to="/admin/profile" replace/>

    return <Outlet/>
}