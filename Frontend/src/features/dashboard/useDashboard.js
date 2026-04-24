import { useQuery } from '@tanstack/react-query';
// import React from 'react'
import { useSearchParams } from 'react-router-dom';
import { getDashBoardData } from '../../services/apiBookings';

const useDashboard = () => {
    const [searchParams] = useSearchParams();
    const filterValue = searchParams.get("last");
    console.log('User selected dashboard data', filterValue)
    const queryKey = ["dashboard", "stats", filterValue];



    const { data, isLoading, error } = useQuery({
        queryKey,
        queryFn: () =>
            getDashBoardData(),

        staleTime: 0,        // immediately stale
        refetchOnMount: true,
        refetchOnWindowFocus: true,

    });

    const results = data || {}

    return {
        results, isLoading, error
    }
}

export default useDashboard