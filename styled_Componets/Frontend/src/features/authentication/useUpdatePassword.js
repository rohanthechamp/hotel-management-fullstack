
import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { UpdateCurrentUserPassword } from "../../services/apiUser";
export const useUpdatePassword = () => {
    const queryClient = useQueryClient();
    const { mutate: updateUserMutate, isLoading: isUpdating } = useMutation({
        mutationFn: (password) => UpdateCurrentUserPassword({password}),
        onSuccess: () => {
            toast.success("User Password Uploaded Successfully");
            queryClient.invalidateQueries({ queryKey: ["currentUserDetails"] });

        },
        onError: (err) => {
            toast.error(" User Password Updating Failed" + err.message);

        },
    });

    return { isUpdating, updateUserMutate }
}
