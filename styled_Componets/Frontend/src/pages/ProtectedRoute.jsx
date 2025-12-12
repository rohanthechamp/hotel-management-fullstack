import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ProtectedRoute({ children }) {
    const { isAuthAuthenticated } = useAuth() ;
    return isAuthAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
