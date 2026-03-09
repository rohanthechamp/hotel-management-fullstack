import { axiosPrivate } from "./axiosClient";

export const getCabins = async (sortValue, filterValue, pageValue = 1) => {
    try {
        if (sortValue === "all" && filterValue === "all") {
            const { data } = await axiosPrivate.get("api/cabins/");
            return data?.results || [];
        }
        const params = {};

        if (filterValue && filterValue !== "all") {
            params.discount = filterValue;
        }

        if (sortValue && sortValue !== "all") {
            let ascOrder = ["asc", "min", "low"];
            const [field, direction] = sortValue.split("-");
            const fieldMapping = {
                name: "name",
                regularPrice: "regularPrice",
                maxCapacityCabins: "maxCapacity",
                minCapacityCabins: "maxCapacity", // if you actually have a minCapacity field, map that instead
            };

            const mappedField = fieldMapping[field];
            if (!mappedField) throw new Error("Invalid sorting field from UI");

            params.ordering = ascOrder.includes(direction)
                ? mappedField
                : `-${mappedField}`;
        }
        if (pageValue && pageValue > 0) {
            params.pagenumber = pageValue;
        }
        const { data } = await axiosPrivate.get("api/cabins/", { params });
        return data?.results ?? []; // consistent array return
    } catch (error) {
        console.error("Error fetching cabins:", error);
        throw error; // rethrow so react-query sets error state
    }
};
// SINGLE cabin
export async function getCabin(id) {
    const res = await axiosPrivate.get(`api/cabins/${id}/`);
    return res.data;
}
export const createCabins = async (data) => {
    const res = await axiosPrivate.post("api/cabins/", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};


// * Edit Cabin Api function
export const editCabins = async (data, id) => {
    const res = await axiosPrivate.patch(`api/cabins/${id}/`, data);
    return res.data;
};

export async function deleteCabins(id) {
    const res = await axiosPrivate.delete(`api/cabins/${id}/`);
    return res.data;
}
