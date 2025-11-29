import axios from "axios";
import { useAuth } from "./AuthContext";

const axiosClient = axios.create({
    baseURL: "http://127.0.0.1:8000/api/", // Update if your DRF backend uses a different URL
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true, // only enable if you're using cookies/session auth
});

// Request interceptor: add access token

axiosClient.interceptors.request.use(
    (config) => {
        const { accessToken } = useAuth();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
            return config;
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: auto refresh access token if expired

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const {  getRefreshToken } = useAuth();
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            await getRefreshToken();
            return axios(originalRequest);
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
