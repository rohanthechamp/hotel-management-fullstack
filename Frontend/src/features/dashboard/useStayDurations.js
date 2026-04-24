import { useQuery } from "@tanstack/react-query";
// import React from 'react'
// import { useSearchParams } from 'react-router-dom';
import { getStaysTodayActivity } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";

const useStayDurations = () => {
    const [searchParams] = useSearchParams();
    const filterValue = searchParams.get("last");
    console.log("User selected dashboard data", filterValue);
    const queryKey = ["dashboard","stays",filterValue];

    const { data, isLoading2, error2 } = useQuery({
        queryKey,
        queryFn: () =>
            getStaysTodayActivity({
                filterValue: filterValue,
            }),

        staleTime: 0, // immediately stale
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });

    const staysData = data || [];

    return {
        staysData,
        isLoading2,
        error2,
    };
};

export default useStayDurations;
