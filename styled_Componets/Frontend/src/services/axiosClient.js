import axios from "axios";


const axiosClient = axios.create({
    baseURL: "http://127.0.0.1:8000/api/", // Update if your DRF backend uses a different URL
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true, // only enable if you're using cookies/session auth
});
export default axiosClient