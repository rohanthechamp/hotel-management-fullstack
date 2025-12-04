// import React, {
//     useEffect,
//     useRef,
//     useCallback,
//     useMemo,
//     useState,
// } from "react";
// import axiosClient from "./axiosClient";
// import { AuthContext } from "./AuthContextSetup";
// import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "../utils/constant";

// export function AuthProvider({ children }) {
//     // Used to lock a single refresh flow for multiple concurrent 401s
//     const [username, setUsername] = useState(null);
//     const [isLogin, setIsLogin] = useState(false);
//     const refreshPromiseRef = useRef(null);

//     // Helper: perform refresh using server httpOnly refresh cookie
//     const refreshAccessToken = useCallback(async () => {
//         // If there's already a refresh in progress, return the same promise (queueing)
//         if (refreshPromiseRef.current) {
//             return refreshPromiseRef.current;
//         }

//         const p = (async () => {
//             try {
//                 const res = await axiosClient.post(
//                     "users/refresh/",
//                     {}, // no body necessary if refresh read from cookie
//                     { withCredentials: true } // important: send cookies
//                 );
//                 const newAccess = res?.data?.access;
//                 console.log("refreshAccessToken", newAccess);

//                 if (newAccess) {
//                     localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, newAccess);
//                     return newAccess;
//                 } else {
//                     // no access returned -> ensure logged out
//                     localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
//                     return null;
//                 }
//             } catch (err) {
//                 // refresh failed
//                 localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
//                 throw err;
//             } finally {
//                 // clear the lock
//                 refreshPromiseRef.current = null;
//             }
//         })();

//         refreshPromiseRef.current = p;
//         return p;
//     }, []);

//     // On mount: attempt to refresh so user stays logged in across page reloads
//     useEffect(() => {
//         // Fire-and-forget: we don't block render, but we try to hydrate the access token
//         refreshAccessToken().catch((err) => {
//             // optionally log, but don't crash app
//             console.log(err);
//         });
//     }, [refreshAccessToken]);

//     // Request interceptor — attach Authorization header
//     useEffect(() => {
//         const id = axiosClient.interceptors.request.use(
//             (config) => {
//                 const accessToken_Bearer = localStorage.getItem(
//                     LOCAL_STORAGE_ACCESS_TOKEN_KEY
//                 );
//                 console.log("ACCESS TOKEN - ", accessToken_Bearer);

//                 if (accessToken_Bearer) {
//                     config.headers = config.headers || {};
//                     config.headers.Authorization = `Bearer ${accessToken_Bearer}`;
//                 }
//                 return config;
//             },
//             (err) => Promise.reject(err)
//         );
//         return () => axiosClient.interceptors.request.eject(id);
//     }, []);

//     // Response interceptor — on 401, try refresh once and retry original
//     useEffect(() => {
//         const id = axiosClient.interceptors.response.use(
//             (r) => r,
//             async (err) => {
//                 const original = err.config;
//                 if (!original) return Promise.reject(err);

//                 // if 401 and not already retried
//                 if (err.response?.status === 401 && !original._retry) {
//                     original._retry = true;
//                     try {
//                         const newAccess = await refreshAccessToken(); // uses lock internally
//                         if (newAccess) {
//                             original.headers = original.headers || {};
//                             original.headers.Authorization = `Bearer ${newAccess}`;
//                             return axiosClient(original); // retry
//                         }
//                     } catch (refreshErr) {
//                         // refresh failed -> reject and let app handle (redirect to login maybe)
//                         return Promise.reject(refreshErr);
//                     }
//                 }
//                 return Promise.reject(err);
//             }
//         );
//         return () => axiosClient.interceptors.response.eject(id);
//     }, [refreshAccessToken]);

//     // Register user
//     const createUser = useCallback(async (data) => {
//         try {
//             const res = await axiosClient.post("users/register/", data);
//             return res.data;
//         } catch (error) {
//             console.log(error);
//             throw error;
//         }
//     }, []);

//     // Login user
//     // Expectation: server sets httpOnly refresh cookie and MAY return access token
//     const loginUser = useCallback(async (data) => {
//         try {
//             const res = await axiosClient.post("users/login/", data, {
//                 withCredentials: true, // to receive refresh cookie from server
//             });
//             // console.log("Inside the Login api function res -", res);
//             // console.log("Inside the Login api function res data - ", res?.data);
//             // If backend returns an access token directly, use it
//             const newAccess = res?.data?.access;
//             console.log("Inside the Login api function", newAccess);
//             if (res.status === 200) {
//                 setIsLogin(true);
//                 setUsername(res.data.username);
//             }

//             if (newAccess) {
//                 localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, newAccess);
//             }
//             return res;
//         } catch (error) {
//             console.log(error);
//             setIsLogin(false);
//             setUsername(null);
//             throw error;
//         }
//     }, []);

//     // Logout user
//     const logOutUser = useCallback(async () => {
//         try {
//             // Logout call should clear refresh cookie server-side
//             const res = await axiosClient.post(
//                 "users/logout/",
//                 {},
//                 { withCredentials: true }
//             );
//             localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
//             setIsLogin(false);
//             setUsername(null);
//             return res.data;
//         } catch (error) {
//             // still clear client-side state to be safe
//             localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
//             setIsLogin(false);
//             setUsername(null);
//             throw error;
//         }
//     }, []);

//     const contextValue = useMemo(
//         () => ({
//             createUser,
//             loginUser,
//             logOutUser,
//             refreshAccessToken, // optionally expose for manual refresh
//             username,
//             isLogin,
//         }),
//         [createUser, loginUser, logOutUser, refreshAccessToken, username, isLogin]
//     );

//     return (
//         <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
//     );
// }
