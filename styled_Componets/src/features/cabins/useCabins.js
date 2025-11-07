import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabins";

export const useCabins = () => {
    const { isLoading, data: Cabins, error } = useQuery({
        queryKey: ["cabin"],
        queryFn: getCabins,
    });


    return { isLoading, Cabins, error }
}

