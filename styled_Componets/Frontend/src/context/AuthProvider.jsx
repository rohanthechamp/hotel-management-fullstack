// AuthContext.jsx
import { createContext, useState, useMemo } from "react";

const AuthContext = createContext(null);

const initialState = {
    accessToken: null,
    refreshToken: null,
    username: null,
    email: null,
    isAuthAuthenticated: false,
};

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(initialState);

    const value = useMemo(() => ({ auth, setAuth }), [auth]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
