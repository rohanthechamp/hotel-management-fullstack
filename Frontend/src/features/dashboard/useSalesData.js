import { useQuery } from "@tanstack/react-query";
import { getSalesData } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
const useSalesData = () => {
    const [searchParams] = useSearchParams();
    const filterValue = searchParams.get("last");
    const queryKey = ["dashboard", "saleCharts", filterValue];

    const { data, isLoading, error } = useQuery({
        queryKey,
        queryFn: () => getSalesData({
            filterValue: filterValue,
        }),
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });

    const results3 = data || [];
    console.log()

    return {
        results3,
        isLoading3: isLoading,  
        error3: error,          
    };
};

export default useSalesData;