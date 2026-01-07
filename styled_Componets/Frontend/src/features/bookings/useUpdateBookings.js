/* eslint-disable no-unused-vars */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateBooking } from "../../services/apiBookings";
import { useNavigate } from "react-router-dom";

export const useUpdateBookings = () => {
    const queryClient = useQueryClient();

    const navigate = useNavigate();
    const { mutate: checkin, isLoading: isProcessing, error } = useMutation({
        mutationFn: ({ id, obj, errorMsg, successMsg }) => updateBooking(id, obj, errorMsg, successMsg),
        onSuccess: (_, variables) => {
            toast.success(`${variables.successMsg} for booking id ${variables.id}`);
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            queryClient.invalidateQueries({ queryKey: ["booking", variables.id] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });

            if (window.location.pathname === "/bookings") {
                navigate("/bookings");
            }


        },

        onError: (err, variables) => {


            toast.error(
                `${variables.errorMsg} for booking id ${variables.obj} ${err.message} `
            )
        },
    });

    return { checkin, isProcessing, error };
};
