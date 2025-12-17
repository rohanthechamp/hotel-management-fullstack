import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiUser";

export const useCurrentUser = () => {
    const { isLoading, data: UserData, error } = useQuery({
        queryKey: ["currentUserDetails"],
        queryFn: getCurrentUser,
    });


    return { isLoading, UserData, error }
}
