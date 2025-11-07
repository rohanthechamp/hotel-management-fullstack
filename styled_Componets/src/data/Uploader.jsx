import { useState } from "react";
import { isFuture, isPast, isToday } from "date-fns";
import supabase from "../services/supabase";

import { subtractDates } from "../utils/helpers";

import { bookings } from "./data-bookings";
import { cabins } from "./data-cabins";
import { guests } from "./data-guests";
import Button from "../ui/Button";

// const originalSettings = {
//   minBookingLength: 3,
//   maxBookingLength: 30,
//   maxGuestsPerBooking: 10,
//   breakfastPrice: 15,
// };

async function deleteGuests() {
  const { error } = await supabase.from("guests").delete().gt("id", 0);
  if (error) console.log(error.message);
}

async function deleteCabins() {
  const { error } = await supabase.from("cabins").delete().gt("id", 0);
  if (error) console.log(error.message);
}

async function deleteBookings() {
  const { error } = await supabase.from("bookings").delete().gt("id", 0);
  if (error) console.log(error.message);
}

async function createGuests() {
  const { error } = await supabase.from("guests").insert(guests);
  if (error) console.log(error.message);
}

async function createCabins() {
  const { error } = await supabase.from("cabins").insert(cabins);
  if (error) console.log(error.message);
}

async function createBookings() {
  // Bookings need a guestid and a cabinid. We can't tell Supabase IDs for each object, it will calculate them on its own. So it might be different for different people, especially after multiple uploads. Therefore, we need to first get all guestids and cabinids, and then replace the original IDs in the booking data with the actual ones from the DB
  const { data: guestsids } = await supabase
    .from("guests")
    .select("id")
    .order("id");
  const allguestids = guestsids.map((cabin) => cabin.id);
  const { data: cabinsids } = await supabase
    .from("cabins")
    .select("id")
    .order("id");
  // console.log('all cabin/s IDS',cabinsids)
  const allcabinids = cabinsids.map((cabin) => cabin.id);

  const finalBookings = bookings.map((booking) => {
    const { guestId, cabinId, ...rest } = booking;

    // Here relying on the order of cabins, as they don't have and ID yet
    const cabin = cabins.at(booking.cabinid - 1);
    const numNights = subtractDates(booking.endDate, booking.startDate);
    const cabinPrice = numNights * (cabin.regularPrice - cabin.discount);
    const extrasPrice = booking.hasBreakfast
      ? numNights * 15 * booking.numGuests
      : 0; // hardcoded breakfast price
    const totalPrice = cabinPrice + extrasPrice;

    let status;
    if (
      isPast(new Date(booking.endDate)) &&
      !isToday(new Date(booking.endDate))
    )
      status = "checked-out";
    if (
      isFuture(new Date(booking.startDate)) ||
      isToday(new Date(booking.startDate))
    )
      status = "unconfirmed";
    if (
      (isFuture(new Date(booking.endDate)) ||
        isToday(new Date(booking.endDate))) &&
      isPast(new Date(booking.startDate)) &&
      !isToday(new Date(booking.startDate))
    )
      status = "checked-in";

    return {
      // ...rest,
      ...rest,
      numNights,
      cabinPrice,
      extrasPrice,
      totalPrice,
      guestid: allguestids.at((booking.guestId ?? booking.guestid) - 1),
      cabinid: allcabinids.at((cabin.cabinId  ?? cabin.cabinid) - 1),
      status,
    };
  });

  console.log(finalBookings);

  const { error } = await supabase.from("bookings").insert(finalBookings);
  if (error) console.log(error.message);
}

function Uploader() {
  const [isLoading, setIsLoading] = useState(false);

  async function uploadAll() {
    setIsLoading(true);
    // Bookings need to be deleted FIRST
    await deleteBookings();
    await deleteGuests();
    await deleteCabins();

    // Bookings need to be created LAST
    await createGuests();
    await createCabins();
    await createBookings();

    setIsLoading(false);
  }

  async function uploadBookings() {
    setIsLoading(true);
    await deleteBookings();
    await createBookings();
    setIsLoading(false);
  }

  return (
    <div
      style={{
        marginTop: "auto",
        backgroundColor: "#e0e7ff",
        padding: "8px",
        borderRadius: "5px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <h3>SAMPLE DATA</h3>

      <Button onClick={uploadAll} disabled={isLoading}>
        Upload ALL
      </Button>

      <Button onClick={uploadBookings} disabled={isLoading}>
        Upload bookings ONLY
      </Button>
    </div>
  );
}

//*
// async function createBookings() {
//   const { data: guestsIds } = await supabase
//     .from("guests")
//     .select("id")
//     .order("id", { ascending: true });

//   const allGuestIds = (guestsIds || []).map((g) => g.id);

//   const { data: cabinsids } = await supabase
//     .from("cabins")
//     .select("id")
//     .order("id", { ascending: true });

//   const allcabinids = (cabinsids || []).map((c) => c.id);

//   const finalBookings = bookings.map((booking) => {
//     // Remove original camelCase keys so they don't get sent to Supabase
//     const { cabinId, guestId, ...rest } = booking;

//     // Use the indexes from the original booking values (if they were 1-based)
//     const originalGuestIndex =
//       booking.guestId ?? booking.guestid ?? booking.guest ?? null;
//     const originalCabinIndex =
//       booking.cabinId ?? booking.cabinid ?? booking.cabin ?? null;

//     const guestDbId = originalGuestIndex
//       ? allGuestIds.at(originalGuestIndex - 1)
//       : undefined;
//     const cabinDbId = originalCabinIndex
//       ? allcabinids.at(originalCabinIndex - 1)
//       : undefined;

//     const numNights = subtractDates(booking.endDate, booking.startDate) || 0;

//     // Be defensive — if cabin is undefined, avoid crash
//     const cabinMeta = cabins.at((originalCabinIndex ?? 1) - 1) || {
//       regularPrice: 0,
//       discount: 0,
//     };

//     const cabinPrice =
//       numNights *
//       (Number(cabinMeta.regularPrice || 0) - Number(cabinMeta.discount || 0));
//     const extrasPrice = booking.hasBreakfast
//       ? numNights * 15 * (booking.numGuests || 1)
//       : 0;
//     const totalPrice = cabinPrice + extrasPrice;

//     let status = null;
//     const start = new Date(booking.startDate);
//     const end = new Date(booking.endDate);

//     if (isPast(end) && !isToday(end)) status = "checked-out";
//     else if (isFuture(start) || isToday(start)) status = "unconfirmed";
//     else if (
//       (isFuture(end) || isToday(end)) &&
//       isPast(start) &&
//       !isToday(start)
//     )
//       status = "checked-in";

//     // Validate before returning
//     if (!guestDbId) {
//       console.warn(
//         "Missing guest DB id for booking (original index):",
//         originalGuestIndex,
//         booking
//       );
//     }
//     if (!cabinDbId) {
//       console.warn(
//         "Missing cabin DB id for booking (original index):",
//         originalCabinIndex,
//         booking
//       );
//     }

//     // Map to the exact DB column names. Adjust 'guestid'/'cabinid' if your DB uses other names.
//     return {
//       ...rest, // everything else from booking (dates, flags), but without camelCase IDs
//       guestid: guestDbId, // lowercased field expected by the DB
//       cabinid: cabinDbId, // lowercased field expected by the DB
//       numNights,
//       cabinPrice,
//       extrasPrice,
//       totalPrice,
//       status,
//     };
//   });

//   console.table(finalBookings); // inspect keys & values before inserting

//   const { error, data } = await supabase
//     .from("bookings")
//     .insert(finalBookings, { returning: "representation" }); // returning helps debug

//   if (error) {
//     console.error("Supabase insert error:", error);
//   } else {
//     console.log("inserted bookings:", data);
//   }
// }

export default Uploader;
