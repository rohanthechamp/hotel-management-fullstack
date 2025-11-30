import { useContext } from "react";
import { AuthContext } from "./AuthContextSetup";

// 3. Custom hook for easy access
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};