import React, { useEffect } from "react";
import { axiosPrivate } from "../services/axiosClient";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import toast from "react-hot-toast";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();
    const token = localStorage.getItem("accessToken");
    console.log(
        "retrieved the accessToken from localStorage for  attaching to the HEADERS of REQUEST",
        token
    );

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        console.log(
            "retrieved the accessToken from localStorage for  attaching to the HEADERS of REQUEST",
            token
        );

        const requestIntercept = axiosPrivate.interceptors.request.use(

            (config) => {
                if (!config.headers?.Authorization && token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                console.log('requestIntercept interceptors is running')

                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;
                if (
                    (error?.response?.status === 403 ||
                        error?.response?.status === 401) &&
                    !prevRequest?.sent
                ) {
                    prevRequest.sent = true;
                    console.log('responseIntercept interceptors is running')

                    // if (!localStorage.getItem('refreshToken')) { // ^ A New User - NOT AccessToken/RefreshToken    cookieStore.get('refresh_token')
                    //     toast.error('You Must be Logged in to continue')
                    //     window.location.href = '/login'
                    //     return

                    // }
                //  const cookie   =await cookieStore.get('refresh_token')
                    // if ( ) { // ^ A New User - NOT AccessToken/RefreshToken    cookieStore.get('refresh_token')
                    //     toast.error('You Must be Logged in to continue')
                    //     window.location.href = '/login'
                    //     return

                    // }

                    // refresh endpoint failed
                    if (error.config.url.includes("/token/refresh")) { // ^ Existing User - Has RefreshToken and that  Can be Expired
                        toast.error("Session expired. Please log in again.");
                        localStorage.removeItem("refreshToken");
                        localStorage.removeItem("accessToken");

                        localStorage.setItem('redirectAfterLogin', window.location.href);



                        window.location.href = "/login";

                        return;
                    }
                    else { // ^ Existing User - Has RefreshToken  and but  Access token can be expired 
                        try {
                            const newAccessToken = await refresh();
                            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                            return axiosPrivate(prevRequest); // * so now we have updated/ modified the request so we are sending this to back to axiosPrivate
                        } catch {
                            toast.error("Could not refresh your session. Please login again.");
                            window.location.href = "/login";
                        }
                    }



                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [auth, refresh]);
};

export default useAxiosPrivate;


/* *








* */