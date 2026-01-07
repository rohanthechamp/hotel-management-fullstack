

import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { UpdateCurrentUser } from "../../services/apiUser";
export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    const { mutate: updateUserMutate, isLoading: isUpdating } = useMutation({
        mutationFn: ( password ) => UpdateCurrentUser(password),
        onSuccess: () => {
            toast.success("User Details Uploaded Successfully");
            queryClient.invalidateQueries({ queryKey: ["currentUserDetails"] });

        },
        onError: (err) => {
            toast.error(" User Details Upload Failed: " + err?.message);

        },
    });

    return { isUpdating, updateUserMutate }
}
