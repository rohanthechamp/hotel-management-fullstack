import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiUser";

export const useCurrentUser = () => {
    const { isLoading, data: UserData, error } = useQuery({
        queryKey: ["currentUserDetails"],
        queryFn: getCurrentUser,
        staleTime:300,
        enabled: !!localStorage.getItem("accessToken"),

    });


    return { isLoading, UserData, error }
}
