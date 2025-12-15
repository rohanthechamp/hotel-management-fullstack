import axiosClient, { axiosPrivate } from "./axiosClient";


export const createUser = async (data) => {
    try {
        const res = await axiosClient.post("users/register/", data);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};



export const logOutUser = async (refreshToken) => {

    try {
    
        const res = await axiosPrivate.post("users/logout/", {
            refreshToken,
        });
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("username");
        localStorage.removeItem("email");

        return res.data;
    } catch (error) {
        // still clear client-side state to be safe
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        throw error;
    }
};



