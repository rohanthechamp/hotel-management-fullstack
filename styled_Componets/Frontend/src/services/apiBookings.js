import { PAGE_SIZE } from "../utils/constant";
import { getToday } from "../utils/helpers";
import  { axiosPrivate } from "./axiosClient";
import supabase from "./supabase";

// import { getToday } from "../utils/helpers";
// import supabase from "./supabase";

/**
 * getAllBookings({ filter, sortBy })
 * - returns { data: <array>, count: <number> }
//  */
// export const getBookings = async ({
//   filter = null,
//   sortBy = null,
//   pageValue = 1,
// }={}) => {
//     try {
//         // if (sortValue === 'all' && filterValue === 'all' && page) {
//         //     const { data } = await axiosPrivate.get("api/bookings/"); return data?.results || [];
//         // }
//         const params = {};

//         if (filter && filter !== "all") {
//             params.discount = filter;
//         }

//         if (sortBy && sortBy !== "all") {
//             const [field, direction] = sortBy.split("-");
//             const fieldMapping = {
//               dstartDate: "startDate",
//               astartDate: "startDate",
//               dtotalPrice: "totalPrice",
//               atotalPrice: "totalPrice",
//               // if you actually have a minCapacity field, map that instead
//             };

//             const mappedField = fieldMapping[field];
//             if (!mappedField) throw new Error("Invalid sorting field from UI");

//             params.ordering = direction === "asc" ? mappedField : `-${mappedField}`;
//       }

//       if (pageValue && pageValue > 0) {
//         params.pagenumber=pageValue
//       }

//       const { AllBookings } = await axiosPrivate.get("api/bookings/", { params });
//       console.log( 'IN get bookings - ', AllBookings?.results)
//         return AllBookings?.results ?? []; // consistent array return
//     } catch (error) {
//         console.error("Error fetching booking:", error);
//         throw error; // rethrow so react-query sets error state
//     }
// };

// apiBookings.js
// import axiosPrivate from "./axiosPrivate"; // adjust path to where you export axiosPrivate

export const getBookings = async ({
  sortValue = "all",
  filterValue = "all",
  pageValue = 1,
} = {}) => {
  try {
    const params = {};

    // FILTER: adapt to your API param name (I assume `status`)
    if (filterValue && filterValue !== "all") {
      params.status = filterValue;
    }

    // SORT: expecting `field-direction` e.g. "startDate-desc"
    if (sortValue && sortValue !== "all") {
      const [field, direction] = sortValue.split("-");
      // map UI fields to API fields if necessary
      const fieldMapping = {
        dstartDate: "startDate",
        dtotalPrice: "totalPrice",
        astartDate: "startDate",
        atotalPrice: "totalPrice",
        // add more mappings if your UI uses different keys
      };
      const mappedField = fieldMapping[field] ?? field;
      params.ordering = direction === "asc" ? mappedField : `-${mappedField}`;
    }

    // PAGINATION: adapt param name to your backend (pageValue, pageValuenumber, pageValueNumber, etc.)
    // I use "pageValue" here — change to "pageValuenumber" if your API expects that.
    if (pageValue && pageValue > 0) {
      params.pagenumber = pageValue;
    }

    // actual request
    const { data } = await axiosPrivate.get("/api/bookings/", { params });
    console.log(data?.results)
    // Normalize returned shape:
    // Expecting backend to return { results: [], count: number }
    // If your API returns { data: { results }, total } adjust accordingly.
    // ✅ Return normalized shape
    return {
      results: data?.results ?? [],
      count: data?.count ?? data?.total ?? 0,
    };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error; // so react-query can set error state
  }
};

// export async function getAllBookings({
//   filter = null,
//   sortBy = null,
//   pageValue = 1,
// } = {}) {
//   // Correct usage: second arg to select() is options (count: 'exact')

//   // let query = supabase
//   // .from("bookings")
//   // .select(`*, guest:guests(*), cabins(*)`, { count: "exact" });

//   console.log("in api bookings", filter, sortBy, pageValue);

//   const pageNumber = Number(pageValue) || 1;

//   let query = supabase.from("bookings").select(
//     "id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests(fullName, email)",
//     // "*",
//     { count: "exact" }
//   );

//   if (
//     filter &&
//     typeof filter === "object" &&
//     filter.field &&
//     filter.value !== undefined
//   ) {
//     console.log("IN Filter", filter);
//     query = query.eq(filter.field, filter.value);
//   }

//   if (
//     sortBy &&
//     typeof sortBy === "object" &&
//     sortBy.field &&
//     (sortBy.direction === "asc" || sortBy.direction === "desc")
//   ) {
//     // VERY IMPORTANT: consider whitelisting allowed sort fields to avoid accidental issues
//     console.log("IN SortBy", sortBy);
//     const field = String(sortBy.field);
//     const direction = sortBy.direction === "asc" ? "asc" : "desc";
//     const ascending = direction === "asc";
//     query = query.order(field, { ascending });
//   }

//   if (pageNumber) {
//     console.log("in PageValue", pageNumber);
//     const from = (pageNumber - 1) * PAGE_SIZE;
//     const to = from + PAGE_SIZE - 1;

//     if (from < 0) {
//       throw new Error("Invalid page number");
//     }

//     console.log("in range ", from, to);
//     query = query.range(from, to);
//   }

//   const { data, error, count } = await query;

//   if (error) {
//     console.error("Supabase error in getAllBookings:", error);
//     console.log(JSON.parse(error))
//     throw new Error("Booking could not be loaded");
//   }

//   // normalize output so callers are safe
//   return { data: data ?? [], count: typeof count === "number" ? count : 0 };
// }
//
// SINGLE cabin
export async function getBooking(id) {
  const res = await axiosPrivate.get(`api/bookings/${id}/`);
  return res.data;
}


// export async function getBooking(id) {
//   console.log(`Received id in API Bookings for single booking ${id}`);
//   const { data, error } = await supabase
//     .from("bookings")
//     .select("*, cabins(*), guests(*)")
//     .eq("id", id)
//     .single();

//   if (error) {
//     console.error("getBooking error:", error);
//     throw new Error(`Booking not found for id: ${id}`);
//   }

//   return data;
// }

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    // .select('*')
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order("created_at");

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}

export async function updateBooking(id, obj, errorMsg, successMsg) {
  console.log("printing the obj in updateBooking ", obj);
  const { data1, data2 } = obj
  
  console.log(  'Destructed data- ' , data1,data2)



  try {
    const res = await axiosPrivate.patch(`api/bookings/${id}/`, obj);   // ^  http://127.0.0.1:8000/api/bookings/2/
    console.info(`Booking updated- ${successMsg}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Booking could not be updated  - ${errorMsg}`);
  }
}

// export async function updateBooking(id, params) {
//   const res = await axiosPrivate.patch(`bookings/${id}/`,  params );
//   return res.data;
// }

// export async function deleteBooking(id) {
//   // REMEMBER RLS POLICIES
//   const { data, error } = await supabase.from("bookings").delete().eq("id", id);

//   if (error) {
//     console.error(error);
//     throw new Error("Booking could not be deleted");
//   }
//   return data;
// }
// DELETE booking
export async function deleteBooking(id) {
  const res = await axiosPrivate.delete(`api/bookings/${id}/`);
  return res.data;
}