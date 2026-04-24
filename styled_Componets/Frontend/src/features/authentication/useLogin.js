// hooks/useLogin.js
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";


import useAuth from "../../hooks/useAuth";
import { logInUser } from "../../services/apiUser";

const useLogin = () => {
    const { setAuth } = useAuth();

    const persistAuth = ({ access, refresh, username, email, userRole }) => {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);
        localStorage.setItem("userRole", userRole);



        setAuth({
            accessToken: access,
            refreshToken: refresh,
            username,
            email,
            isAuthAuthenticated: true,
            userRole

        });
    };

    const { mutate: doLogin, isPending: isLoading } = useMutation({
        mutationFn: (formData) => logInUser(formData),

        onSuccess: (data) => {
            persistAuth(data);
            toast.success("Logged in successfully");
        },

        onError: (err) => {
            const message =
                err?.detail ||
                err?.response?.data?.detail ||
                "Invalid email or password";

            toast.error(message);
        },
    });

    return { isLoading, doLogin };
};

export default useLogin;
