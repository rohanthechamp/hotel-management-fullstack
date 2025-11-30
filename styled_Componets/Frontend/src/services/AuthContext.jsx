/* eslint-disable no-useless-catch */
import React, { useEffect, useState, useMemo, useRef } from "react";
import axiosClient from "./axiosClient";
import { AuthContext } from "./AuthContextSetup";
// 2. Provider
export function AuthProvider({ children }) {
    // -------------------------------
    // React state to store access token
    // -------------------------------
    const [accessToken, setAccessToken] = useState(null);
    // -------------------------------------------
    // useRef holds a mutable version of accessToken
    // - Unlike state, changing this does NOT trigger re-renders
    // - Allows interceptor to always access the latest token
    // -------------------------------------------
    const tokenRef = useRef(accessToken);

    // -------------------------------------------
    // Keep the ref in sync with state
    // - Whenever accessToken state updates, update the ref
    // - This ensures interceptor always reads the latest token
    // -------------------------------------------
    useEffect(() => {
        tokenRef.current = accessToken;
    
    }, [accessToken]);

    // -------------------------------------------
    // Axios interceptor to attach Authorization header
    // - Attached once (no useEffect needed)
    // - Reads tokenRef.current to always get the latest token
    // - Avoids stale closure issue that happens if interceptor
    //   directly reads accessToken state
    // - No need to re-attach interceptor on token change

    // ^ State: triggers re - render -> interceptor may read old value → stale token.  -> if we wnat to stop that -> we have to create  interceptor again -> caues ovehead -> and if we wnat ot reduce overhead -> we can use useref -> becuaes they did not casue rerneder or updatiion
    // -------------------------------------------
    axiosClient.interceptors.request.use((config) => {
        if (tokenRef.current) {
            config.headers.Authorization = `Bearer ${tokenRef.current}`;
        }
        return config;
    });

    // ... your provider value and return here


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
            return res;
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
    // // Attach response interceptor once — uses provider's getRefreshToken
    // useEffect(() => {
    //     const id = axiosClient.interceptors.response.use(
    //         (r) => r,
    //         async (err) => {
    //             const original = err.config;
    //             if (err.response?.status === 401 && !original._retry) {
    //                 original._retry = true;
    //                 const newAccess = await getRefreshToken();
    //                 if (newAccess) {
    //                     original.headers = original.headers || {};
    //                     original.headers.Authorization = `Bearer ${newAccess}`;
    //                     return axiosClient(original);
    //                 }
    //             }
    //             return Promise.reject(err);
    //         }
    //     );
    //     return () => axiosClient.interceptors.response.eject(id);
    // }, []); // attach once

    const contextValue = useMemo(() => ({
        accessToken,
        createUser,
        loginUser,
        logOutUser,
        getRefreshToken,
    }), [accessToken]);

    return (
        <AuthContext.Provider
            value={contextValue}
        >
            {children}
        </AuthContext.Provider>
    );
}


