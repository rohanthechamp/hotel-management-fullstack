import React, { useEffect } from "react";
import  { axiosPrivate } from "../services/axiosClient";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

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
                    console.log('responseIntercept interceptors is running')

                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest); // * so now we have updated/ modified the request so we are sending this to back to axiosPrivate
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
