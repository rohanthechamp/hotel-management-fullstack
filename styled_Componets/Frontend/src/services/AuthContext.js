/* eslint-disable no-useless-catch */
import React, { createContext, useContext, useState } from "react";
import axiosClient from "./axiosClient";

// 1. Create context
export const AuthContext = createContext();

// 2. Provider
export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(null);

    // Register user
    const createUser = async (data) => {
        // data = { username, email, password, confirmPassword }
        try {
            const res = await axiosClient.post("register/", data);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Login user
    const loginUser = async (data) => {
        // data = { email, password }
        try {
            const res = await axiosClient.post("token/", data); // your email-token endpoint
            setAccessToken(res.data.access); // store in state
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Logout user
    const logOutUser = async (data) => {
        // data = { refresh: "refresh_token" }
        try {
            const res = await axiosClient.post("logout/", data);
            setAccessToken(null); // remove access token from state
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Optionally: function to get a new access token using refresh token
    const getRefreshToken = async () => {
        try {
            const res = await axiosClient.post("token/refresh/", {}, { withCredentials: true });
            setAccessToken(res.data.access);
            return res.data.access;
        } catch (error) {
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                createUser,
                loginUser,
                logOutUser,
                getRefreshToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// 3. Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
