import { useQuery } from "@tanstack/react-query";
import { getDashBoardTodayActivity } from "../../services/apiBookings";
import { getTodayKey } from "../../utils/helpers";

const useDashboardTodayActivities = () => {


    const todayKey = getTodayKey();
    const { data, isLoading, error } = useQuery({
        queryKey: ["dashboard", "activities", todayKey],

        queryFn: () => getDashBoardTodayActivity(),

        staleTime: 0,        // immediately stale
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });

    const results1 = data || {};

    return {
        results1,
        isLoading,
        error,
    };
};

export default useDashboardTodayActivities;
