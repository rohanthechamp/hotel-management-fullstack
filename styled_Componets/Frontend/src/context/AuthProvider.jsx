// AuthContext.jsx
import { createContext, useState, useMemo } from "react";

const AuthContext = createContext(null);
// state hydration
const restoreState = () => {
    return {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
        username: localStorage.getItem("username"),
        email: localStorage.getItem("email"),
    };
};

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const refillState = restoreState();
        console.log(refillState)
        return {
            ...refillState,
            isAuthAuthenticated: !!refillState.accessToken,
        };
    });

    const value = useMemo(() => ({ auth, setAuth }), [auth]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
