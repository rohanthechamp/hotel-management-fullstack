// // import styled from "styled-components";
// // import Tag from "../../ui/Tag";
// // import { Flag } from "../../ui/Flag";
// // import { Button } from "@mui/material";

// // import { Link } from "react-router-dom";
// // import { useUpdateBookings } from "../bookings/useUpdateBookings";
// // import { mapObj } from "../../utils/helpers";
// // import CheckOutBooking from "./CheckOutBooking";

// // const StyledTodayItem = styled.li`
// //   display: grid;
// //   grid-template-columns: 9rem 2rem 1fr 7rem 9rem;
// //   gap: 1.2rem;
// //   align-items: center;

// //   font-size: 1.4rem;
// //   padding: 0.8rem 0;
// //   border-bottom: 1px solid var(--color-grey-100);

// //   &:first-child {
// //     border-top: 1px solid var(--color-grey-100);
// //   }
// // `;

// // const Guest = styled.div`
// //   font-weight: 500;
// // `;

// // const TodayItem = ({ items }) => {
// //   const {
// //     id,
// //     status,
// //     numNights,
// //     guest: {
// //       fullName,
// //       countryFlag,
// //       nationality: { country },
// //     },
// //   } = items;

// //   const {
// //     checkin,
// //     isProcessing,
// //     error: updateBookingError,
// //   } = useUpdateBookings();

// //   const handleCheckOut = ({
// //     columnName,
// //     columnValue,
// //     errorMsg,
// //     successMsg,
// //   }) => {
// //     const obj = mapObj(columnName,columnValue)
// //     checkin({
// //       id: id,
// //       obj: obj,
// //       errorMsg,
// //       successMsg,
// //     });
// //   };


// //   return (
// //     <StyledTodayItem>
// //       {status === "checked-in" ? (
// //         <Tag type="green">Arrived</Tag>
// //       ) : status === "unconfirmed" ? (
// //         <Tag type="yellow">Arriving</Tag>
// //       ) : (
// //         <Tag type="grey">Departed</Tag>
// //       )}

// //       <br />
// //       <Flag
// //         src={countryFlag || "src/data/img/usFlag.png"}
// //         alt={`Flag of ${country}`}
// //       />
// //       <Guest>{fullName}</Guest>

// //       <div style={{ color: "var(--color-brand-600)", fontWeight: 600 }}>
// //         {numNights} nights
// //       </div>


// //       {status === "unconfirmed" && (
// //         <Button
// //           size="small"
// //           variation="primary"
// //           as={Link}
// //           to={`/check-in-out/${id}`}
// //           disabled={updateBookingError}
// //         >
// //           Check in
// //         </Button>
// //       )}
// //       {status === "checked-in" && (
// //         <CheckOutBooking onCheckOut={handleCheckOut} isLoading={isProcessing} />
// //       )}
// //     </StyledTodayItem>
// //   );
// // };

// // export default TodayItem;
// import styled from "styled-components";
// import Tag from "../../ui/Tag";
// import { Flag } from "../../ui/Flag";
// import { Button } from "@mui/material";
// import { Link } from "react-router-dom";
// import { useUpdateBookings } from "../bookings/useUpdateBookings";
// import { mapObj } from "../../utils/helpers";
// import CheckOutBooking from "./CheckOutBooking";

// const StyledTodayItem = styled.li`
//   display: grid;
//   grid-template-columns: 7.5rem 2.4rem minmax(14rem, 1fr) 8rem 10rem;
//   gap: 1.6rem;
//   align-items: center;
//   font-size: 1.4rem;
//   padding: 1.2rem 0.4rem;
//   border-bottom: 1px solid var(--color-grey-100);

//   &:first-child {
//     border-top: 1px solid var(--color-grey-100);
//   }

//   &:hover {
//     background-color: var(--color-grey-50);
//   }
// `;

// const Guest = styled.div`
//   font-weight: 600;
//   color: var(--color-grey-800);
// `;

// const Nights = styled.div`
//   font-weight: 600;
//   color: var(--color-brand-600);
//   text-align: right;
// `;

// const TodayItem = ({ items }) => {
//   const {
//     id,
//     status,
//     numNights,
//     guest: {
//       fullName,
//       countryFlag,
//       nationality: { country },
//     },
//   } = items;

//   const { checkin, isProcessing, error: updateBookingError } =
//     useUpdateBookings();

//   const handleCheckOut = ({
//     columnName,
//     columnValue,
//     errorMsg,
//     successMsg,
//   }) => {
//     const obj = mapObj(columnName, columnValue);
//     checkin({
//       id,
//       obj,
//       errorMsg,
//       successMsg,
//     });
//   };

//   return (
//     <StyledTodayItem>
//       {status === "checked-in" ? (
//         <Tag type="green">Arrived</Tag>
//       ) : status === "unconfirmed" ? (
//         <Tag type="yellow">Arriving</Tag>
//       ) : (
//         <Tag type="grey">Departed</Tag>
//       )}

//       <Flag
//         src={countryFlag || "src/data/img/usFlag.png"}
//         alt={`Flag of ${country}`}
//       />

//       <Guest>{fullName}</Guest>

//       <Nights>{numNights} nights</Nights>

//       {status === "unconfirmed" && (
//         <Button
//           size="small"
//           variant="contained"
//           component={Link}
//           to={`/check-in-out/${id}`}
//           disabled={updateBookingError}
//         >
//           Check in
//         </Button>
//       )}

//       {status === "checked-in" && (
//         <CheckOutBooking
//           onCheckOut={handleCheckOut}
//           isLoading={isProcessing}
//         />
//       )}
//     </StyledTodayItem>
//   );
// };

// export default TodayItem;
import styled from "styled-components";
import Tag from "../../ui/Tag";
import { Flag } from "../../ui/Flag";

import { Link } from "react-router-dom";
import { useUpdateBookings } from "../bookings/useUpdateBookings";
import { mapObj } from "../../utils/helpers";
import CheckOutBooking from "./CheckOutBooking";
import FancyButton from "../../ui/FancyButton";
import { ErrorIcon } from "react-hot-toast";

const StyledTodayItem = styled.li`
  display: grid;
  grid-template-columns: 9rem 2.4rem 1fr 7rem 9rem;
  gap: 3.6rem;
  align-items: center;
  font-size: 1.4rem;
  padding: 1.2rem 0.4rem;
  border-bottom: 1px solid var(--color-grey-100);

  &:first-child {
    border-top: 1px solid var(--color-grey-100);
  }

  &:hover {
    background-color: var(--color-grey-50);
  }
`;

const Guest = styled.div`
  font-weight: 600;
  color: var(--color-grey-800);
`;

const Nights = styled.div`
  font-weight: 600;
  color: var(--color-brand-600);
`;
const ActionCell = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
`;

const TodayItem = ({ items }) => {
  const {
    id,
    status,
    numNights,
    guest: {
      fullName,
      countryFlag,
      nationality: { country },
    },
  } = items;

  const { checkin, isProcessing, error: updateBookingError } =
    useUpdateBookings();

  if (updateBookingError) return <ErrorIcon />

  const handleCheckOut = ({
    columnName,
    columnValue,
    errorMsg,
    successMsg,
  }) => {
    const obj = mapObj(columnName, columnValue);
    checkin({
      id: id,
      obj: obj,
      errorMsg,
      successMsg,
    });
  };

  return (
    <ul>
      <StyledTodayItem>
        {status === "checked-in" ? (
          <Tag type="green">Arrived</Tag>
        ) : status === "unconfirmed" ? (
          <Tag type="yellow">Arriving</Tag>
        ) : (
          <Tag type="grey">Departed</Tag>
        )}

        <Flag
          src={countryFlag || "src/data/img/usFlag.png"}
          alt={`Flag of ${country}`}
        />


        <Guest>{fullName}</Guest>

        <Nights>{numNights} nights</Nights>
        <ActionCell>
          {status === "unconfirmed" ? (
            <FancyButton
              as={Link}
              to={`/check-in-out/${id}`}
              bg="green"
            >
              Check in
            </FancyButton>
          ) : status === "checked-in" ? (
            <CheckOutBooking
              onCheckOut={handleCheckOut}
              isLoading={isProcessing}
              bg="red"
            />
          ) : null}
        </ActionCell>


      </StyledTodayItem>
   </ul>
  );
};

export default TodayItem;

