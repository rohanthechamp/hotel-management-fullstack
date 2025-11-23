import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";

import toast from "react-hot-toast";
import { getBooking } from "../../services/apiBookings";

const useSingleBooking = (id) => {
    console.log("1 Hello in useSingleBooking ");

    const { data, isLoading, error } = useQuery({
        queryKey: ["SBooking", id],
        queryFn: () => getBooking(id),
        enabled: !!id,
        retry: false,
    });

    console.log("2 Hello in useSingleBooking After react Query");
    
    useEffect(() => {
        console.log("3 Hello in useSingleBooking  before checking id cond");
        if (!id || typeof id === "number") {
            console.log("4 Hello in useSingleBooking  in the  checking id cond");

            toast.error(
                "Please provide an ID to fetch the single booking - useSingleBooking",
                { id: "missing-booking-id" } // prevents duplicate toasts
            );
        }
    }, [id]);
    console.log("5 Hello in useSingleBooking After useEffect");

    return { data, isLoading, error };
};

export default useSingleBooking;
