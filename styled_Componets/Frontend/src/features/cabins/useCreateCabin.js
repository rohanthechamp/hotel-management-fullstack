import toast from "react-hot-toast";
import { createCabins } from "../../services/apiCabins";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useCreateCabin = () => {
    const queryClient = useQueryClient();
    const { mutate: createCabin, isLoading: isCreating } = useMutation({
        mutationFn: (newCabinformData) => createCabins(newCabinformData),
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

