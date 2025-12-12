// /* eslint-disable no-unused-vars */
// import styled from "styled-components";
// import { format, isToday } from "date-fns";

// import Tag from "../../ui/Tag";
// import Table from "../../ui/Table";
// import Modal from "../../ui/Modal";

// import { formatCurrency } from "../../utils/helpers";
// import { formatDistanceFromNow } from "../../utils/helpers";
// import Menus from "../../ui/Menus";
// import { HiArrowDownOnSquare, HiEye, HiTrash } from "react-icons/hi2";
// import { FaSpinner } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import Spinner from "../../ui/Spinner";
// import { useDeleteBookings } from "./useDeleteBookings";
// import Button from "../../ui/Button";

// const Cabin = styled.div`
//   font-size: 1.6rem;
//   font-weight: 600;
//   color: var(--color-grey-600);
//   font-family: "Sono";
// `;

// const Stacked = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 0.2rem;

//   & span:first-child {
//     font-weight: 500;
//   }

//   & span:last-child {
//     color: var(--color-grey-500);
//     font-size: 1.2rem;
//   }
// `;

// const Amount = styled.div`
//   font-family: "Sono";
//   font-weight: 500;
// `;

// const NumberOfGuests = styled.div`
//   font-family: "Sono";
//   font-weight: 500;
//   color: cyan;
// `;
// function BookingRow({ booking }) {
//   const navigate = useNavigate();
//   const { onDelete, isDeleting, error } = useDeleteBookings();

//   if (!booking || error) return <Spinner />;

//   // Corrected destructuring for Django backend
//   const {
//     id: bookingId,
//     created_at,
//     startDate,
//     endDate,
//     numNights,
//     numGuests,
//     totalPrice,
//     status,
//     cabin: cabinId,
//     guest: guestId,
//   } = booking;

//   // Convert boolean → readable text
//   const mapping = {
//     "checked-in": "checked-in",
//     "unconfirmed": "unconfirmed",
//   };

//   const statusLabel = mapping[status] || "checked-out";
//   // Tag colors
//   const statusToTagName = {
//     "checked-in": { color: "#155724", background: "#d4edda" },      // green text on light green bg
//     "unconfirmed": { color: "#721c24", background: "#f8d7da" },     // red text on light red bg
//     "checked-out": { color: "#856404", background: "#fff3cd" },      // brownish text on soft yellow bg
//   };


//   function handleDeleteBooking(id) {
//     onDelete({ id });
//   }

//   return (
//     <Table.Row>
//       <span>{created_at}</span>

//       {/* Cabin now only ID */}
//       <Cabin>Cabin #{cabinId}</Cabin>

//       {/* Guest ID only for now */}
//       <Stacked>
//         <span>Guest #{guestId}</span>
//         <span>—</span>
//       </Stacked>

      // <Stacked>
      //   <span>
      //     {isToday(new Date(startDate))
      //       ? "Today"
      //       : formatDistanceFromNow(startDate)}{" "}
      //     &rarr; {numNights} night stay
      //   </span>
      //   <span>
      //     {format(new Date(startDate), "MMM dd yyyy")} &mdash;{" "}
      //     {format(new Date(endDate), "MMM dd yyyy")}
      //   </span>
      // </Stacked>

//       {/* Updated status text */}
//       <Tag type={statusToTagName[statusLabel]}>
//         {statusLabel.replace("-", " ")}
//       </Tag>

//       <Amount>{formatCurrency(totalPrice)}</Amount>

//       <NumberOfGuests>
//         <span>{numGuests || 0}</span>
//       </NumberOfGuests>

//       <Modal>
//         <Menus.Menu>
//           <Menus.Toggle cabinId={bookingId} />

//           <Menus.List cabinId={bookingId}>
//             <button
//               onClick={() => {
//                 if (
//                   confirm(
//                     "Delete this booking? This action cannot be undone."
//                   )
//                 ) {
//                   handleDeleteBooking(bookingId);
//                 }
//               }}
//               disabled={isDeleting}
//             >
//               {isDeleting ? (
//                 <p>
//                   Processing <FaSpinner />
//                 </p>
//               ) : (
//                 <p>
//                   Delete <HiTrash />
//                 </p>
//               )}
//             </button>

//             <Menus.Button
//               icon={<HiEye />}
//               onClick={() => navigate(`/bookings/${bookingId}`)}
//             >
//               See Details
//             </Menus.Button>

//             {statusLabel === "unconfirmed" && (
//               <Menus.Button
//                 icon={<HiArrowDownOnSquare />}
//                 onClick={() => navigate(`/check-in-out/${bookingId}`)}
//               >
//                 Check in
//               </Menus.Button>
//             )}

//             {statusLabel === "checked-in" && (
//               <Menus.Button
//                 icon={<HiArrowDownOnSquare />}
//                 onClick={() => navigate(`/check-in-out/${bookingId}`)}
//               >
//                 Check Out
//               </Menus.Button>
//             )}
//           </Menus.List>
//         </Menus.Menu>
//       </Modal>
//     </Table.Row>
//   );
// }
// export default BookingRow;

// // export { NavigateToPage };
/* eslint-disable no-unused-vars */
import styled from "styled-components";
import { format, isToday } from "date-fns";

import Table from "../../ui/Table";
import Modal from "../../ui/Modal";
import Tag from "../../ui/Tag";
import Menus from "../../ui/Menus";
import Spinner from "../../ui/Spinner";
import Button from "../../ui/Button";

import { formatCurrency } from "../../utils/helpers";
import { formatDistanceFromNow } from "../../utils/helpers";

import { HiArrowDownOnSquare, HiEye, HiTrash } from "react-icons/hi2";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDeleteBookings } from "./useDeleteBookings";

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

// STATUS CONFIG - Label + Colors (Expert UX)
const STATUS_CONFIG = {
  "checked-in": { label: "Checked In", color: "#155724", bg: "#d4edda" },
  "unconfirmed": { label: "Unconfirmed", color: "#721c24", bg: "#f8d7da" },
  "checked-out": { label: "Checked Out", color: "#856404", bg: "#fff3cd" },
};

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
    cabin: cabinId,
    guest: guestId,
  } = booking;

  // Determine status config
  const statusData = STATUS_CONFIG[status] || STATUS_CONFIG["checked-out"];
  const { label: statusLabel, color, bg } = statusData;

  // Delete handler
  function handleDeleteBooking(id) {
    onDelete({ id });
  }

  return (
    <Table.Row>
      {/* Created At */}
      <span>{created_at}</span>

      {/* Cabin */}
      <Cabin>Cabin #{cabinId}</Cabin>

      {/* Guest */}
      <Stacked>
        <span>Guest #{guestId}</span>
        <span>—</span>
      </Stacked>

      {/* Stay Duration */}
      <Stacked>
        <span>
          {/* {isToday(new Date(startDate))
            ? "Today"
            : formatDistanceFromNow(new Date(startDate))}{" "}
          &rarr; {numNights} night stay */}
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

      {/* Status Tag */}
      <Tag color={color} bg={bg}>
        {statusLabel}
      </Tag>

      {/* Total Price */}
      <Amount>{formatCurrency(totalPrice)}</Amount>

      {/* Number of Guests */}
      <NumberOfGuests>
        <span>{numGuests || 0}</span>
      </NumberOfGuests>

      {/* Actions */}
      <Modal>
        <Menus.Menu>
          <Menus.Toggle cabinId={bookingId} />

          <Menus.List cabinId={bookingId}>
            {/* Delete */}
            <button
              onClick={() => {
                if (
                  confirm(
                    "Delete this booking? This action cannot be undone."
                  )
                ) {
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

            {/* View Details */}
            <Menus.Button
              icon={<HiEye />}
              onClick={() => navigate(`/bookings/${bookingId}`)}
            >
              See Details
            </Menus.Button>

            {/* Conditional Actions */}
            {statusLabel === "Unconfirmed" && (
              <Menus.Button
                icon={<HiArrowDownOnSquare />}
                onClick={() => navigate(`/check-in-out/${bookingId}`)}
              >
                Check In
              </Menus.Button>
            )}

            {statusLabel === "Checked In" && (
              <Menus.Button
                icon={<HiArrowDownOnSquare />}
                onClick={() => navigate(`/check-in-out/${bookingId}`)}
              >
                Check Out
              </Menus.Button>
            )}
          </Menus.List>
        </Menus.Menu>
      </Modal>
    </Table.Row>
  );
}

export default BookingRow;
