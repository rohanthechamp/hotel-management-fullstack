import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabins";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constant";

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
    const pageValue = searchParams.get("page"); 
    const queryClient = useQueryClient();

    const {
        isLoading,
        data: cabins = [],
        error,
    } = useQuery({
        queryKey: ["ALLcabins", filterValue, sortValue],
        queryFn: () => getCabins(sortValue, filterValue),
        keepPreviousData: true,
        staleTime: 60_000,
    });



    // const ALLcabins = cabins ?? [];
    const count = cabins?.count ?? 0;

    const pageCount = Math.ceil(count / PAGE_SIZE);
    if (pageValue < pageCount)
        queryClient.prefetchQuery({
            queryKey: ["ALLcabins", filterValue ?? "all", sortValue ?? "all", pageValue + 1],
            queryFn: () =>
                getCabins({
                    filter: filterValue,
                    sortBy: sortValue,
                    pageValue: pageValue + 1,
                }),
        });

    if (pageValue > 1)
        queryClient.prefetchQuery({
            queryKey: ["ALLcabins", filterValue ?? "all", sortValue ?? "all", pageValue - 1],
            queryFn: () =>
                getCabins({
                    filter: filterValue,
                    sortBy: sortValue,
                    pageValue: pageValue - 1,
                }),
        });

    return { isLoading, cabins, error };
};
