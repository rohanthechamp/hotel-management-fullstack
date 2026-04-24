import { useQuery } from "@tanstack/react-query";
import { getHotelAllInvites } from "../../services/apiUser";

export const useGetAllinvites = () => {
    const {
        isLoading,
        data: HotelInvitesData,
        error,
    } = useQuery({
        queryKey: ["hotelAllInvitesData"],
        queryFn: getHotelAllInvites,
        staleTime: 1000,
        retry: (failureCount, error) => {
            // Only retry if it's not a 404 error and failure count is less than 3
            if (error.response.status === 404) return false;
            return failureCount < 3;
        },
        enabled: !!localStorage.getItem("accessToken"),

    });

    return { isLoading, HotelInvitesData, error };
};

// on create invites  -queryClient.invalidateQueries({ queryKey: ["hotelAllInvitesData"] });
