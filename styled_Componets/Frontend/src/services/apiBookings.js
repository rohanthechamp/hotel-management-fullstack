import { PAGE_SIZE } from "../utils/constant";
import { getToday } from "../utils/helpers";
import { axiosPrivate } from "./axiosClient";
import supabase from "./supabase";

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
    console.log(data?.results);
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

// SINGLE cabin
// export async function getBooking(id) {
//   const res = await axiosPrivate.get(`api/bookings/read//`);
//   return res.data;
// }
export async function getBooking(id) {
  const res = await axiosPrivate.get("/api/bookings/read/", {
    params: { bookingID: id },
  });

  return res.data;
}

export async function getDashBoardData({ filterValue } = {}) {
  const params = {}
  params.filterValue = filterValue
  const res = await axiosPrivate.get(`api/dashboard/bookings/`, { params });
  console.log('dashboard data - ', res)

  return res.data;
}

export async function getSalesData({ filterValue } = {}) {
  const params = {}
  params.filterValue = filterValue

  const res = await axiosPrivate.get('api/dashboard/revenue/daily/', { params })
  console.log('SalesData data - ', res)

  return res.data;
}

export async function getDashBoardTodayActivity() {


  const res = await axiosPrivate.get('api/dashboard/activities/today-summary/');
  console.log('dashboard data TODAY - ', res.data)

  return res.data;
}


export async function getStaysTodayActivity({ filterValue } = {}) {
  const params = {}
  params.filterValue = filterValue

  const res = await axiosPrivate.get('api/dashboard/activities/stay-durations/', { params });
  console.log('dashboard data StaysTodayActivity - ', res.data)
  console.log(res.data, res)
  return res.data;
}
// // Returns all BOOKINGS that are er the given date. Useful to get bookings created in the last 30 days, for example.
// export async function getBookingsAfterDate(date) {
//   const { data, error } = await supabase
//     .from("bookings")
//     .select("created_at, totalPrice, extrasPrice")
//     .gte("created_at", `date`)
//     .lte("created_at", getToday({ end: true }));

//   if (error) {
//     console.error(error);
//     throw new Error("Bookings could not get loaded");
//   }

//   return data;
// }

// // Returns all STAYS that are were created after the given date
// export async function getStaysAfterDate(date) {
//   const { data, error } = await supabase
//     .from("bookings")
//     // .select('*')
//     .select("*, guests(fullName)")
//     .gte("startDate", date)
//     .lte("startDate", getToday());

//   if (error) {
//     console.error(error);
//     throw new Error("Bookings could not get loaded");
//   }

//   return data;
// }

// Activity means that there is a check in or a check out today
// export async function getStaysTodayActivity() {
//   const { data, error } = await supabase
//     .from("bookings")
//     .select("*, guests(fullName, nationality, countryFlag)")
//     .or(
//       `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
//     )
//     .order("created_at");

//   // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
//   // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
//   // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

//   if (error) {
//     console.error(error);
//     throw new Error("Bookings could not get loaded");
//   }
//   return data;
// }

export async function updateBooking(id, obj, errorMsg, successMsg) {
  console.log("printing the obj in updateBooking ", obj);
  const { data1, data2 } = obj;

  console.log("Destructed data- ", data1, data2);

  try {
    const res = await axiosPrivate.patch(`api/bookings/${id}/`, obj); // ^  http://127.0.0.1:8000/api/bookings/2/
    console.info(`Booking updated- ${successMsg}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Booking could not be updated  - ${errorMsg}`);
  }
} // DELETE booking
export async function deleteBooking(id) {
  const res = await axiosPrivate.delete(`api/bookings/${id}/`);
  return res.data;
}
