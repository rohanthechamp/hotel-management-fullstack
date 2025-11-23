/* eslint-disable no-unused-vars */
import styled from "styled-components";
import { format, isToday } from "date-fns";

import Tag from "../../ui/Tag";
import Table from "../../ui/Table";
import Modal from "../../ui/Modal";

import { formatCurrency } from "../../utils/helpers";
import { formatDistanceFromNow } from "../../utils/helpers";
import Menus from "../../ui/Menus";
import { HiArrowDownOnSquare, HiEye, HiTrash } from "react-icons/hi2";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Spinner from "../../ui/Spinner";
import { useDeleteBookings } from "./useDeleteBookings";
import Button from "../../ui/Button";

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Amount = styled.div`
  font-family: "Sono";
  font-weight: 500;
`;

const NumberOfGuests = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: cyan;
`;

function BookingRow({ booking }) {
  const navigate = useNavigate();
  const { onDelete, isDeleting, error } = useDeleteBookings();

  if (!booking || error) return <Spinner />;

  const {
    id: bookingId,
    created_at,
    startDate,
    endDate,
    numNights,
    numGuests,
    totalPrice,
    status,
    guests,
    cabins: { name: cabinName },
  } = booking;
  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  function handleDeleteBooking(id) {
    onDelete({ id });
  }

  return (
    <Table.Row>
      <span>{created_at}</span>
      <Cabin>{cabinName}</Cabin>

      <Stacked>
        <span>{guests?.fullName}</span>
        <span>{guests?.email}</span>
      </Stacked>

      <Stacked>
        <span>
          {isToday(new Date(startDate))
            ? "Today"
            : formatDistanceFromNow(startDate)}{" "}
          &rarr; {numNights} night stay
        </span>
        <span>
          {format(new Date(startDate), "MMM dd yyyy")} &mdash;{" "}
          {format(new Date(endDate), "MMM dd yyyy")}
        </span>
      </Stacked>

      <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>

      <Amount>{formatCurrency(totalPrice)}</Amount>

      <NumberOfGuests>
        <span>{numGuests || 999}</span>
      </NumberOfGuests>

      <Modal>
        <Menus.Menu>
          <Menus.Toggle cabinId={bookingId} />
          {/* <Menus.List cabinId={bookingId}>
            <Modal.Open opens={"booking-details-window"}>
              <Menus.Button icon={<HiEye />} handler={handleClick}>
                See Details
              </Menus.Button>
            </Modal.Open>
          </Menus.List> */}

          {/* // Page */}
          <Menus.List cabinId={bookingId}>
            <button

              onClick={() => {
                if (confirm("Delete this booking? This action cannot be undone.")) {
                  handleDeleteBooking(bookingId);
                }
              }}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <p>
                  Processing <FaSpinner />
                </p>
              ) : (
                <p>
                  Delete <HiTrash />
                </p>
              )}
            </button>

            <Menus.Button
              icon={<HiEye />}
              onClick={() => navigate(`/bookings/${bookingId}`)}
            >
              See Details
            </Menus.Button>

            {status === "unconfirmed" ? (
              <Menus.Button
                icon={<HiArrowDownOnSquare />}
                onClick={() => navigate(`/check-in-out/${bookingId}`)}
              >
                Check in
              </Menus.Button>
            ) : null}

            {status === "checked-in" ? (
              <Menus.Button
                icon={<HiArrowDownOnSquare />}
                onClick={() => navigate(`/check-in-out/${bookingId}`)}
              >
                Check Out
              </Menus.Button>
            ) : null}
          </Menus.List>
        </Menus.Menu>
      </Modal>
    </Table.Row>
  );
}

export default BookingRow;

// export { NavigateToPage };
