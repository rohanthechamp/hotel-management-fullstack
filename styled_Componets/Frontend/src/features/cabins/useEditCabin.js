
import { editCabins } from "../../services/apiCabins";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
export const useEditCabin = () => {
    const queryClient = useQueryClient();
    const { mutate: updateMutate, isLoading: isEditing } = useMutation({
        mutationFn: ({ data, id }) => editCabins(data, id),
        onSuccess: () => {
            toast.success("Cabin updated Successfully");
            queryClient.invalidateQueries({ queryKey: ["cabin"] });

        },
        onError: (err) => {
            toast.error("Cabin could not be Updated " + err.message);

        },
    });

    return { isEditing, updateMutate }
}
