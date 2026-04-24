/* eslint-disable no-useless-catch */
// import { getError } from "../utils/helpers";
import { getError } from "../utils/helpers";
import axiosClient, { axiosPrivate } from "./axiosClient";

export const createUser = async (data) => {
    try {
        const res = await axiosClient.post("users/auth/register/staff/", data);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};



export const sendInvite = async (email) => {
    try {
        const res = await axiosPrivate.post('users/auth/invite/send/', {
            email: email
        });
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }   
};
export const getHotelAllInvites = async () => {
    try {
        // throw new  Error('')
        const { data }= await axiosPrivate.get("users/hotel/invites/");
        // console.log('hotel data invites- '.toUpperCase(),res,res.data);
        
        return data;
    } catch (error) {
 
        console.log(error);
        throw error;
    }
};


export const validateInviteCode = async (invite_code) => {
    try {
        const res = await axiosClient.get(`users/invite/validate/?code=${invite_code}`);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};


export const createUserAdmin = async (data) => {
    try {
        const res = await axiosClient.post("users/auth/register/admin/", data);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const logInUser = async (formData) => {
    try {
        const { data } = await axiosClient.post("users/login/", formData);
        return data;
    } catch (error) {
        // Keep the error consistent for the hook
        throw error?.response?.data || new Error("Login failed");
    }
};


export const getCurrentUser = async () => {
    try {
        setTimeout(function() {
  console.log("This message appears after 3 seconds.");
}, 3000);

        const { data } = await axiosPrivate.get("users/user/me");
        console.log(data)
        return data;
    } catch (error) {
        // Keep the error consistent for the hook
        throw error?.response?.data || new Error("Getting current user details Fails");
    }
};

export const UpdateCurrentUser = async (formData) => {
    try {
        const { data } = await axiosPrivate.patch("users/user/me/update/profile", formData);
        console.log(data)
        return data;
    } catch (error) {
        // Keep the error consistent for the hook
        throw error?.response?.data || new Error("Updating  current user details Failed!!!");
    }
};

export const UpdateCurrentUserPassword = async (password) => {
    try {
        const { data } = await axiosPrivate.patch("users/user/me/update/password", password);
        console.log(data)
        return data;
    } catch (error) {
        // Keep the error consistent for the hook
        throw error?.response?.data || new Error("Updating  current user password Failed!!!");
    }
};
export const logOutUser = async (refreshToken) => {
    try {
        const res = await axiosPrivate.post("users/logout/", {
            refreshToken,
        });

        return res.data;
    } catch (error) {
        // Keep the error consistent for the hook
        throw error?.response?.data || new Error("Log Out ailed");
    }
};
