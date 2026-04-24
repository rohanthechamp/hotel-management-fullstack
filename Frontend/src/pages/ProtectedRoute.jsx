import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ProtectedRoute({ children }) {
    const { auth } = useAuth();
    const location = useLocation();

    return auth?.isAuthAuthenticated ? (
        children
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default ProtectedRoute;
