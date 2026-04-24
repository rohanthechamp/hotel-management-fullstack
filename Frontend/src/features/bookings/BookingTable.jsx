import BookingRow from "./BookingRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import { useBookings } from "./useBookings";
import Spinner from "../../ui/Spinner";
import Pagination from "../../ui/Pagination";
import { bookings } from "../../data/data-bookings";

function BookingTable() {
  const { isLoading, results, count, error } = useBookings();

  if (isLoading) return <Spinner />;
  if (error || !bookings.length) return <Empty resourceName="bookings" />;

  console.log(results)
  return (
    <Menus>
      <Table columns="0.6fr 2fr 2.4fr 1.4fr 1fr 4.2rem 3.4rem 2rem">
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
          data={results}
          render={(booking) => (
            <BookingRow key={booking.id} booking={booking} />
          )}
        />

        <Table.Footer>
          {count > 0 && <Pagination count={count} />}
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default BookingTable;
