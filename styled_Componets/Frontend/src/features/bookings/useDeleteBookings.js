
/* eslint-disable no-unused-vars */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteBooking } from "../../services/apiBookings";
import { useNavigate } from "react-router-dom";
export const useDeleteBookings = () => {
    const queryClient = useQueryClient();

    const navigate = useNavigate();
    const { mutate: onDelete, isLoading: isDeleting, error } = useMutation({
        mutationFn: ({ id }) => deleteBooking(id),
        onSuccess: (_, variables) => {
            toast.success('Booking Deleted Successfully of  😊😊😊-', variables.id);
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            queryClient.invalidateQueries({ queryKey: ["booking", variables.id] });
            navigate('/bookings');

        },

        onError: (err, variables) => {


            toast.error('Booking Deletion Failed 🚨🚨🚨 of -', variables.id, err);

        },
    });

    return { onDelete, isDeleting, error };
};
// import { useRef, useEffect } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import { deleteBooking } from "../../services/apiBookings";
// import { useNavigate } from "react-router-dom";

// /**
//  * Hook: useDeleteBooking
//  * - Optimistically removes a booking from the "bookings" cache
//  * - Rolls back if deletion fails
//  * - Invalidates/cleans up queries after mutation
//  * - Guards navigate() so we don't call it on unmounted component
//  */
// export const useDeleteBooking = () => {
//     const queryClient = useQueryClient();
//     const navigate = useNavigate();

//     // guard against calling navigate after unmount
//     const isMounted = useRef(true);
//     useEffect(() => {
//         return () => {
//             isMounted.current = false;
//         };
//     }, []);

//     const mutation = useMutation({
//         // mutation function: call API to delete booking by id
//         mutationFn: ({ id }) => deleteBooking(id),

//         // optimistic update: remove booking from bookings list immediately
//         onMutate: async ({ id }) => {
//             await queryClient.cancelQueries({ queryKey: ["bookings"] });

//             const previousBookings = queryClient.getQueryData(["bookings"]);

//             // remove item from cache optimistically
//             queryClient.setQueryData(["bookings"], (old) => {
//                 if (!old) return old;
//                 // handle arrays or paginated structure accordingly
//                 if (Array.isArray(old)) {
//                     return old.filter((b) => String(b.id) !== String(id));
//                 }
//                 // if your "bookings" query is paginated or shaped, adapt this logic
//                 return old;
//             });

//             // also remove specific booking cache if present
//             const previousBooking = queryClient.getQueryData(["booking", id]);
//             queryClient.removeQueries({ queryKey: ["booking", id] });

//             // Return context for potential rollback
//             return { previousBookings, previousBooking };
//         },

//         // rollback on error
//         onError: (err, variables, context) => {
//             // restore previous bookings list if available
//             if (context?.previousBookings !== undefined) {
//                 queryClient.setQueryData(["bookings"], context.previousBookings);
//             }
//             if (context?.previousBooking !== undefined) {
//                 queryClient.setQueryData(["booking", variables.id], context.previousBooking);
//             }

//             // log error (replace with Sentry or other logging in prod)
//             // eslint-disable-next-line no-console
//             console.error("deleteBooking failed:", err);

//             // user feedback
//             const id = variables?.id ?? "";
//             toast.error(`Failed to delete booking ${id}. Try again.`);
//         },

//         // success actions
//         onSuccess: (_, variables) => {
//             const id = variables?.id ?? "";

//             toast.success(`Booking ${id} deleted successfully.`);

//             // Make sure the list is fresh
//             queryClient.invalidateQueries({ queryKey: ["bookings"] });

//             // remove detail query if it still exists (safety)
//             queryClient.removeQueries({ queryKey: ["booking", id] });

//             // Redirect only if component is mounted
//             if (isMounted.current) {
//                 // navigate back to bookings list (optional)
//                 navigate("/bookings");
//             }
//         },

//         // always run to ensure consistency
//         onSettled: () => {
//             queryClient.invalidateQueries({ queryKey: ["bookings"] });
//         },

//         // optional production-friendly options:
//         retry: 1, // retry once on network failure
//         throwOnError: false,
//     });

//     // helper we expose to consumers: call with id (or object with id)
//     const deleteBookingById = (id) => {
//         if (!id) {
//             toast.error("Invalid booking id.");
//             return;
//         }
//         mutation.mutate({ id });
//     };

//     return {
//         deleteBookingById, // call this with id
//         isDeleting: mutation.isLoading,
//         error: mutation.error,
//     };
// };
