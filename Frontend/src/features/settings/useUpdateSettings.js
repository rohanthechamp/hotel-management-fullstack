

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateSetting } from "../../services/apiSettings";
export const useUpdateSettings = () => {
    const queryClient = useQueryClient();
    const { mutate: updateSettingsMutate, isLoading: isUpdating } = useMutation({
        mutationFn: ({ id, payload }) => updateSetting(id,payload ),
        onSuccess: () => {
            toast.success("Updated  Hotel Settings Successfully");
            queryClient.invalidateQueries({ queryKey: ["settings"] });

        },
        onError: (err) => {
            toast.error("Settings Update Failed" + err.message);

        },
    });

    return { isUpdating, updateSettingsMutate }
}
export default useUpdateSettings