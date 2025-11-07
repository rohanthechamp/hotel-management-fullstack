/* eslint-disable no-unused-vars */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constant";

export const useBookings = () => {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();


    const filterValue = searchParams.get("status"); // e.g. "checked-in" or "all"
    const sortValue = searchParams.get("sort"); // e.g. "startDate-desc"
    const pageValue = searchParams.get("page"); // e.g. "startDate-desc"
    // --- normalize pageValue to number (default 1)
    // const pageValue = Number(pageParam) || 1; // now a number
    console.log('page value and its type',pageValue,typeof(pageValue))
    // parse sortValue into field + direction safely
    let sortBy = null;
    if (sortValue && sortValue !== "all") {
        const [field, direction] = sortValue.split("-");
        if (field && (direction === "asc" || direction === "desc")) {
            sortBy = { field, direction };
        }
    }

    const filter =
        !filterValue || filterValue === "all"
            ? null
            : { field: "status", value: filterValue };

    const queryKey = [
        "AllBookings",
        filterValue ?? "all",
        sortValue ?? "all",
        pageValue,
    ];

    // DON'T destructure nested 'data' property directly from useQuery result,
    // because `data` can be undefined during loading and you'll get runtime errors.
    const { data, isLoading, error } = useQuery({
        queryKey,
        queryFn: () =>
            getAllBookings({
                filter,
                sortBy,
                pageValue,
            }),
        // optional: staleTime, keepPreviousData etc.
    });

    // normalize so components can use them without checks
    const AllBookings = data?.data ?? [];
    const count = data?.count ?? 0;

    // PreFetching

    const pageCount = Math.ceil(count / PAGE_SIZE);
    if (pageValue < pageCount)
        queryClient.prefetchQuery({
            queryKey: ["AllBookings", filterValue ?? "all", sortValue ?? "all", pageValue + 1],
            queryFn: () =>
                getAllBookings({
                    filter: filterValue,
                    sortBy: sortValue,
                    pageValue: pageValue + 1,
                }),
        });

    if (pageValue > 1)
        queryClient.prefetchQuery({
            queryKey: ["AllBookings", filterValue ?? "all", sortValue ?? "all", pageValue - 1],
            queryFn: () =>
                getAllBookings({
                    filter: filterValue,
                    sortBy: sortValue,
                    pageValue: pageValue - 1,
                }),
        });

    // queryKey.map((val) => {
    //     console.log(val);
    // });

    return { isLoading, error, AllBookings, count };
};
