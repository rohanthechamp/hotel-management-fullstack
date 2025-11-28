import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabins";
import { useSearchParams } from "react-router-dom";

// export const useCabins = () => {
//     const { isLoading, data: Cabins, error } = useQuery({
//         queryKey: ["cabin"],
//         queryFn: getCabins,
//     });


//     return { isLoading, Cabins, error }
// }

export const useCabins = () => {
    const [searchParams] = useSearchParams();
    const filterValue = searchParams.get("discount") ?? "all";
    const sortValue = searchParams.get("sort") ?? "all";

    const {
        isLoading,
        data: cabins = [],
        error,
    } = useQuery({
        queryKey: ["cabin", filterValue, sortValue],
        queryFn: () => getCabins(sortValue, filterValue),
        keepPreviousData: true,
        staleTime: 60_000,
    });

    return { isLoading, cabins, error };
};
