/* eslint-disable no-unused-vars */

import { axiosPrivate } from "../services/axiosClient";

import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        let refreshT = localStorage.getItem("refreshToken");
        console.log(
            "retrieved the refreshToken from localStorage for generating REFRESHTOKEN",
            refreshT
        );
        const response = await axiosPrivate.post("/users/token/refresh/", {
            refresh: refreshT,
        });
        const newAccessToken = response.data.access;
        setAuth((prev) => ({
            ...prev,
            accessToken: newAccessToken,
        }));

        
        localStorage.setItem("accessToken", newAccessToken);
        console.log(
            "assigned accessToken  to localStorage  after refreshtoken endpoint request for generating access token- ",
            newAccessToken
        );

        return response.data.access;
    };
    return refresh;
};

export default useRefreshToken;
