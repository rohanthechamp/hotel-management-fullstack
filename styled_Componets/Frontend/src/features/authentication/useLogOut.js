import { useMutation, useQueryClient } from "@tanstack/react-query";
// import React from "react";
import { logOutUser } from "../../services/apiUser";
import toast from "react-hot-toast";
import { clearLocalStorage } from "../../utils/helpers";

const useLogOut = () => {
    const queryClient = useQueryClient();

    const { isPending: isLoading, mutate: doLogOut } = useMutation({
        mutationFn: ({ refreshToken }) => logOutUser(refreshToken),
        onSuccess: () => {
            toast.success("LogOut  Successfully");
            window.location.replace("/login");
            queryClient.removeQueries();

            clearLocalStorage(["refreshToken", "accessToken", "username", "email"]);
        },
        onError: (err) => toast.error("LogOut Failed : " + err.message),
    });
    return { isLoading, doLogOut };
};

export default useLogOut;
