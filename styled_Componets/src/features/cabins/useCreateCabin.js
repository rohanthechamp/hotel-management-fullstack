import toast from "react-hot-toast";
import { createEditCabins } from "../../services/apiCabins";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useCreateCabin = () => {
    const queryClient = useQueryClient();
    const { mutate: createCabin, isLoading: isCreating } = useMutation({
        mutationFn: (newCabinData) => createEditCabins(newCabinData),
        // mutationFn: createEditCabins,
        onSuccess: () => {
            toast.success("Cabin created Successfully");
            queryClient.invalidateQueries({ queryKey: ["cabin"] });
            // reset();

        },
        onError: (err) => {
            toast.error("Cabin could not be Created " + err.message);

        },
    });

    return { isCreating, createCabin }



}

