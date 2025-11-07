import BookingRow from "./BookingRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";

import ErrorFallback from "../../ui/ErrorFallback";
import { useBookings } from "./useBookings";
// import { CgSpin.nerAlt } from "react-icons/cg";
import Spinner from "../../ui/Spinner";
import Pagination from "../../ui/Pagination";

function BookingTable() {
  const { isLoading, AllBookings, error, count } = useBookings();
  const check = Boolean(count);
  // console.log("Bookings Dat/a HELLO", AllBookings?AllBookings[1]:AllBookings);

  if (isLoading) return <Spinner />;
  if (error)
    return (
      <ErrorFallback>
        <p>Failed to Load All Bookings</p>
      </ErrorFallback>
    );

  console.log(AllBookings);

  return (
    <Menus>
      <Table columns="0.6fr 2fr 2.4fr 1.4fr 1fr 3.2rem 3.4rem 2rem">
        <Table.Header>
          <div>Cabin</div>
          <div>Guest</div>
          <div>Dates</div>
          <div>Status</div>
          <div>Amount</div>
          <div>No. of Guests</div>
          <div>Operation</div>
        </Table.Header>

        <Table.Body
          data={AllBookings || []}
          render={(booking) => (
            <BookingRow key={booking.id} booking={booking} />
          )}
        />
        <Table.Footer>{check ? <Pagination count={count} /> : ""}</Table.Footer>
      </Table>
    </Menus>
  );
}

export default BookingTable;
