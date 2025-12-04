import axiosClient from "./axiosClient";


export const createUser = async (data) => {
    try {
        const res = await axiosClient.post("users/register/", data);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};



export const logOutUser = async (accessToken) => {

    try {
        // Logout call should clear refresh cookie server-side
        const res = await axiosClient.post(
            "users/logout/",
            {},
            { withCredentials: true }
        );
        localStorage.removeItem(accessToken);

        return res.data;
    } catch (error) {
        // still clear client-side state to be safe
        localStorage.removeItem(accessToken);

        throw error;
    }
};