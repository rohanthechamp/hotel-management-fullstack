import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCabins } from "../../services/apiCabins";
import toast from "react-hot-toast";


export const useDeleteCabins = () => {

  const queryClient = useQueryClient();
  const { isPending: isDeleting, mutate: deleteCabin } = useMutation({
    mutationFn: (id) => deleteCabins(id),
    onSuccess: () => {
      toast.success("Cabin deleted Successfully");
      queryClient.invalidateQueries({ queryKey: ["cabin"] });
    },
    onError: (err) => toast.error("Cabin could not be Deleted: " + err.message),
  });

  return { isDeleting, deleteCabin };
};
