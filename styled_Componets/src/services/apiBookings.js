import { PAGE_SIZE } from "../utils/constant";
import { getToday } from "../utils/helpers";
import supabase from "./supabase";

// import { getToday } from "../utils/helpers";
// import supabase from "./supabase";

/**
 * getAllBookings({ filter, sortBy })
 * - returns { data: <array>, count: <number> }
 */

export async function getAllBookings({
  filter = null,
  sortBy = null,
  pageValue = 1,
} = {}) {
  // Correct usage: second arg to select() is options (count: 'exact')

  // let query = supabase
  // .from("bookings")
  // .select(`*, guest:guests(*), cabins(*)`, { count: "exact" });

  console.log("in api bookings", filter, sortBy, pageValue);

  const pageNumber = Number(pageValue) || 1;

  let query = supabase.from("bookings").select(
    "id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests(fullName, email)",
    // "*",
    { count: "exact" }
  );

  if (
    filter &&
    typeof filter === "object" &&
    filter.field &&
    filter.value !== undefined
  ) {
    console.log("IN Filter", filter);
    query = query.eq(filter.field, filter.value);
  }

  if (
    sortBy &&
    typeof sortBy === "object" &&
    sortBy.field &&
    (sortBy.direction === "asc" || sortBy.direction === "desc")
  ) {
    // VERY IMPORTANT: consider whitelisting allowed sort fields to avoid accidental issues
    console.log("IN SortBy", sortBy);
    const field = String(sortBy.field);
    const direction = sortBy.direction === "asc" ? "asc" : "desc";
    const ascending = direction === "asc";
    query = query.order(field, { ascending });
  }

  if (pageNumber) {
    console.log("in PageValue", pageNumber);
    const from = (pageNumber - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    if (from < 0) {
      throw new Error("Invalid page number");
    }

    console.log("in range ", from, to);
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Supabase error in getAllBookings:", error);
    console.log(JSON.parse(error))
    throw new Error("Booking could not be loaded");
  }

  // normalize output so callers are safe
  return { data: data ?? [], count: typeof count === "number" ? count : 0 };
}
//

export async function getBooking(id) {
  console.log(`Received id in API Bookings for single booking ${id}`);
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("getBooking error:", error);
    throw new Error(`Booking not found for id: ${id}`);
  }

  return data;
}

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

  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error(`Booking could not be updated  -${errorMsg}`);
  }
  console.info(`Booking updated- ${successMsg}`);
  return data;
}

export async function deleteBooking(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}
