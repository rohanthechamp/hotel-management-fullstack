// // /* eslint-disable no-useless-catch */
// // import React, { useEffect, useState, useMemo, useRef } from "react";
// // import axiosClient from "./axiosClient";
// // import { AuthContext } from "./AuthContextSetup";
// // import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "../utils/constant";
// // // 2. Provider
// // export function AuthProvider({ children }) {
// //     // -------------------------------
// //     // React state to store access token
// //     // -------------------------------
// //     const [accessToken, setAccessToken] = useState(null);
// //     // -------------------------------------------
// //     // useRef holds a mutable version of accessToken
// //     // - Unlike state, changing this does NOT trigger re-renders
// //     // - Allows interceptor to always access the latest token
// //     // -------------------------------------------
// //     const tokenRef = useRef(accessToken);

// //     // -------------------------------------------
// //     // Keep the ref in sync with state
// //     // - Whenever accessToken state updates, update the ref
// //     // - This ensures interceptor always reads the latest token
// //     // -------------------------------------------
// //     useEffect(() => {
// //         tokenRef.current = accessToken;
// //         console.log(tokenRef.current)

// //     }, [accessToken]);

// //     // -------------------------------------------
// //     // Axios interceptor to attach Authorization header
// //     // - Attached once (no useEffect needed)
// //     // - Reads tokenRef.current to always get the latest token
// //     // - Avoids stale closure issue that happens if interceptor
// //     //   directly reads accessToken state
// //     // - No need to re-attach interceptor on token change

// //     // ^ State: triggers re - render -> interceptor may read old value → stale token.  -> if we wnat to stop that -> we have to create  interceptor again -> caues ovehead -> and if we wnat ot reduce overhead -> we can use useref -> becuaes they did not casue rerneder or updatiion
// //     // -------------------------------------------
// //     useEffect(() => {
// //         console.log('IN axiosClient.interceptors.request.use', tokenRef.current)
// //         const id = axiosClient.interceptors.request.use((config) => {
// //             if (tokenRef.current) {
// //                 config.headers.Authorization = `Bearer ${tokenRef.current}`;

// //             }
// //             return config;
// //         });

// //         return () => {
// //             axiosClient.interceptors.request.eject(id);
// //         };
// //     }, []); // only once

// //     // ... your provider value and return here

// //     // Register user
// //     const createUser = async (data) => {
// //         // data = { username, email, password, confirmPassword }
// //         try {
// //             const res = await axiosClient.post("users/register/", data);
// //             return res.data;
// //         } catch (error) {
// //             throw error;
// //         }
// //     };

// //     // Login user
// //     const loginUser = async (data) => {
// //         // data = { email, password }
// //         try {
// //             const res = await axiosClient.post("users/login/", data); // your email-token endpoint
// //             setAccessToken(res.data.access); // store in state
// //             localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, accessToken)
// //             tokenRef.current = accessToken;
// //             console.log('access token by useState - ', res.data.access)
// //             console.log('access token  by useRef - ', tokenRef.current)
// //             console.log(res)
// //             console.log(res.data)
// //             return res;

// //         } catch (error) {
// //             throw error;
// //         }
// //     };

// //     // Logout user
// //     const logOutUser = async (data) => {
// //         // data = { refresh: "refresh_token" }
// //         try {
// //             const res = await axiosClient.post("users/logout/", data);
// //             setAccessToken(null); // remove access token from state
// //             localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY)
// //             return res.data;
// //         } catch (error) {
// //             throw error;
// //         }
// //     };

// //     // Optionally: function to get a new access token using refresh token
// //     // const getRefreshToken = async () => {
// //     //     try {
// //     //         const res = await axiosClient.post("users/token/refresh/", {}, { withCredentials: true });

// //     //         return res.data.access;
// //     //     } catch (error) {
// //     //         throw error;
// //     //     }
// //     // };
// //     // Attach response interceptor once — uses provider's getRefreshToken
// //     useEffect(() => {
// //         const id = axiosClient.interceptors.response.use(
// //             (r) => r,
// //             async (err) => {
// //                 const original = err.config;
// //                 if (err.response?.status === 401 && !original._retry) {
// //                     original._retry = true;
// //                     // const newAccess = await getRefreshToken();
// //                     const res = await axiosClient.post("users/token/refresh/",{}, { withCredentials: true });

// //                     const localStorageAccessToken = res.data.access
// //                     localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, localStorageAccessToken)
// //                     if (localStorageAccessToken) {
// //                         original.headers = original.headers || {};
// //                         original.headers.Authorization = `Bearer ${localStorageAccessToken}`;
// //                         return axiosClient(original);
// //                     }
// //                 }
// //                 return Promise.reject(err);
// //             }
// //         );
// //         return () => axiosClient.interceptors.response.eject(id);
// //     }, []); // attach once

// //     if (!accessToken && accessToken !== null) { // this only set accessToken (useState) value after we hit point of refresh token  and set the new access token with the help of local storage
// //         setAccessToken(localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY))
// //     } // to no dependency of useEffect

// //     const contextValue = useMemo(() => ({
// //         accessToken,
// //         createUser,
// //         loginUser,
// //         logOutUser,
// //     }), [accessToken, loginUser]);

// //     return (
// //         <AuthContext.Provider
// //             value={contextValue}
// //         >
// //             {children}
// //         </AuthContext.Provider>
// //     );
// // }

// /* eslint-disable no-useless-catch */
// import React, {
//     useEffect,
//     useState,
//     useMemo,
//     useRef,
//     useCallback,
// } from "react";
// import axiosClient from "./axiosClient";
// import { AuthContext } from "./AuthContextSetup";
// import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "../utils/constant";

// export function AuthProvider({ children }) {
//     const [accessToken, setAccessToken] = useState(null);
//     const tokenRef = useRef(null); // start null, we'll initialize from localStorage


//     // ^ updating useRef to to accessToken  new/updated value via useState  in step 2
//     useEffect(() => {
//             tokenRef.current = accessToken;
//             console.log(tokenRef.current)

//         }, [accessToken]);


//     // Request interceptor — attaches Authorization header using tokenRef.current
//     useEffect(() => {
//         const id = axiosClient.interceptors.request.use(
//             (config) => {
//                 const token = tokenRef.current;
//                 if (token) {
//                     config.headers = config.headers || {};
//                     config.headers.Authorization = `Bearer ${token}`;
//                 }
//                 return config;
//             },
//             (err) => Promise.reject(err)
//         );

//         return () => axiosClient.interceptors.request.eject(id);
//     }, []); // attach once

//     // ^ Response interceptor — tries to refresh access token on 401
//     useEffect(() => {
//         const id = axiosClient.interceptors.response.use(
//             (r) => r,
//             async (err) => {
//                 const original = err.config;
//                 // only try once per request
//                 if (err.response?.status === 401 && !original?._retry) {
//                     original._retry = true;
//                     try {
//                         // NOTE: refresh token often comes via httpOnly cookie; withCredentials true is needed
//                         const refreshRes = await axiosClient.post(
//                             "users/token/refresh/",
//                             {}, // no body if refresh comes from cookie
//                             { withCredentials: true }
//                         );

//                         const newAccess = refreshRes?.data?.access;
//                         if (newAccess) {
//                             // * persist and update in-memory
//                             setAccessToken(newAccess) // * updating access token value 
//                             // attach header for the failed original request and retry
//                             original.headers = original.headers || {};
//                             original.headers.Authorization = `Bearer ${newAccess}`;
//                             return axiosClient(original);
//                         }
//                     } catch (refreshErr) {
//                         // refresh failed — proceed to reject (optionally clear tokens)
//                         setAccessToken(null);
//                         tokenRef.current = null;
//                         localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
//                         return Promise.reject(refreshErr);
//                     }
//                 }
//                 return Promise.reject(err);
//             }
//         );

//         return () => axiosClient.interceptors.response.eject(id);
//     }, []); // attach once

//     // Register user
//     const createUser = useCallback(async (data) => {
//         try {
//             const res = await axiosClient.post("users/register/", data);
//             return res.data;
//         } catch (error) {
//             throw error;
//         }
//     }, []);

//     // Login user
//     const loginUser = useCallback(async (data) => {
//         try {
//             const res = await axiosClient.post("users/login/", data); // expects { access, ... }
//             const newAccess = res?.data?.access;

//             // * setting access token in 1 step login
//             setAccessToken(newAccess);

//             return res;
//         } catch (error) {
//             throw error;
//         }
//     }, []);

//     // Logout user
//     const logOutUser = useCallback(async (data) => {
//         try {
//             const res = await axiosClient.post("users/logout/", data);
//             setAccessToken(null);
//             tokenRef.current = null;
//             localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
//             return res.data;
//         } catch (error) {
//             throw error;
//         }
//     }, []);

//     const contextValue = useMemo(
//         () => ({
//             accessToken,
//             createUser,
//             loginUser,
//             logOutUser,
//         }),
//         [accessToken, createUser, loginUser, logOutUser]
//     );

//     return (
//         <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
//     );
// }
/* eslint-disable no-useless-catch */
import React, {
    useEffect,
    useState,
    useRef,
    useCallback,
    useMemo,
} from "react";
import axiosClient from "./axiosClient";
import { AuthContext } from "./AuthContextSetup";
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "../utils/constant";

/**
 * AuthProvider (in-memory tokens + httpOnly refresh cookie approach)
 *
 * Backend requirements:
 * - Login endpoint sets httpOnly refresh cookie (same-site/secure as needed) and MAY return access.
 * - Refresh endpoint reads refresh cookie and returns { access: "..." }.
 * - Logout should clear refresh cookie on the server.
 *
 * Important: all calls that need cookies must use { withCredentials: true }.
 */

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(null);
    const tokenRef = useRef(null); // always mirrors latest accessToken for interceptors

    // Used to lock a single refresh flow for multiple concurrent 401s
    const refreshPromiseRef = useRef(null);

    // keep ref in sync with state
    useEffect(() => {
        tokenRef.current = accessToken;
    }, [accessToken]);

    // Helper: perform refresh using server httpOnly refresh cookie
    const refreshAccessToken = useCallback(async () => {
        // If there's already a refresh in progress, return the same promise (queueing)
        if (refreshPromiseRef.current) {
            return refreshPromiseRef.current;
        }

        const p = (async () => {
            try {
                const res = await axiosClient.post(
                    "users/token/refresh/",
                    {}, // no body necessary if refresh read from cookie
                    { withCredentials: true } // important: send cookies
                );
                const newAccess = res?.data?.access;
                console.log('refreshAccessToken',newAccess)
                if (newAccess) {
                    setAccessToken(newAccess);
                    tokenRef.current = newAccess;
                    localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, newAccess)

                    return newAccess;
                } else {
                    // no access returned -> ensure logged out
                    setAccessToken(null);
                    tokenRef.current = null;
                    return null;
                }
            } catch (err) {
                // refresh failed
                setAccessToken(null);
                tokenRef.current = null;
                throw err;
            } finally {
                // clear the lock
                refreshPromiseRef.current = null;
            }
        })();

        refreshPromiseRef.current = p;
        return p;
    }, []);

    // On mount: attempt to refresh so user stays logged in across page reloads
    useEffect(() => {
        // Fire-and-forget: we don't block render, but we try to hydrate the access token
        refreshAccessToken().catch((err) => {
            // optionally log, but don't crash app
            // console.debug("no existing session or refresh failed on mount", err);
        });
    }, [refreshAccessToken]);

    // Request interceptor — attach Authorization header using tokenRef.current
    useEffect(() => {
        const id = axiosClient.interceptors.request.use(
            (config) => {
                const t = tokenRef.current;
                console.log('T TOKEN - ', t)
                console.log('Access Token - ', localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY)
                    
                )
                if (t) {
                    config.headers = config.headers || {};
                    config.headers.Authorization = `Bearer ${localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY) }`;
                }
                return config;
            },
            (err) => Promise.reject(err)
        );

        return () => axiosClient.interceptors.request.eject(id);
    }, []);

    // Response interceptor — on 401, try refresh once and retry original
    useEffect(() => {
        const id = axiosClient.interceptors.response.use(
            (r) => r,
            async (err) => {
                const original = err.config;
                if (!original) return Promise.reject(err);

                // if 401 and not already retried
                if (err.response?.status === 401 && !original._retry) {
                    original._retry = true;
                    try {
                        const newAccess = await refreshAccessToken(); // uses lock internally

                        if (newAccess) {
                            original.headers = original.headers || {};
                            original.headers.Authorization = `Bearer ${newAccess}`;
                            return axiosClient(original); // retry
                        }
                    } catch (refreshErr) {
                        // refresh failed -> reject and let app handle (redirect to login maybe)
                        return Promise.reject(refreshErr);
                    }
                }
                return Promise.reject(err);
            }
        );

        return () => axiosClient.interceptors.response.eject(id);
    }, [refreshAccessToken]);

    // Register user
    const createUser = useCallback(async (data) => {
        try {
            const res = await axiosClient.post("users/register/", data);
            return res.data;
        } catch (error) {
            throw error;
        }
    }, []);

    // Login user
    // Expectation: server sets httpOnly refresh cookie and MAY return access token
    const loginUser = useCallback(async (data) => {
        try {
            const res = await axiosClient.post("users/login/", data, {
                withCredentials: true, // to receive refresh cookie from server
            });
            console.log("Inside the Login api function res -", res)
            console.log("Inside the Login api function res data - ", res?.data)

            // If backend returns an access token directly, use it in memory
            const newAccess = res?.data?.access;
            console.log('Inside the Login api function', newAccess)
            localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, newAccess)
            if (newAccess) {
                setAccessToken(newAccess);
                tokenRef.current = newAccess;
            } else {
                // If no access returned but backend set refresh cookie, call refresh to obtain access
                await refreshAccessToken();
            }

            return res;
        } catch (error) {
            throw error;
        }
    }, [refreshAccessToken]);

    // Logout user
    const logOutUser = useCallback(async () => {
        try {
            // Logout call should clear refresh cookie server-side
            const res = await axiosClient.post(
                "users/logout/",
                {},
                { withCredentials: true }
            );
            setAccessToken(null);
            tokenRef.current = null;
            localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY)
            return res.data;
        } catch (error) {
            // still clear client-side state to be safe
            setAccessToken(null);
            tokenRef.current = null;
            throw error;
        }
    }, []);

    const contextValue = useMemo(
        () => ({
            accessToken,
            createUser,
            loginUser,
            logOutUser,
            refreshAccessToken, // optionally expose for manual refresh
        }),
        [accessToken, createUser, loginUser, logOutUser, refreshAccessToken]
    );

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
}
