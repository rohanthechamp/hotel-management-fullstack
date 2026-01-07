/* eslint-disable no-useless-catch */
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
        const { data } = await axiosPrivate.get("users/user/me",);
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
