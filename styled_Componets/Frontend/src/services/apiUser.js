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

export const logOutUser = async (refreshToken) => {
    try {
        const res = await axiosPrivate.post("users/logout/", {
            refreshToken,
        });

        return res.data;
    } catch (error) {
        throw error;
    }
};
