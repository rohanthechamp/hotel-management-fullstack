// // import styled from "styled-components";

// // import Heading from "../../ui/Heading";
// // import Row from "../../ui/Row";
// // import TodayItem from "./TodayItem";

// // const StyledTodayItem = styled.li`
// //   display: grid;
// //   grid-template-columns: 8rem 2.4rem 1fr 7rem 9rem;
// //   gap: 1.2rem;
// //   align-items: center;

// //   font-size: 1.4rem;
// //   padding: 1.2rem 0;
// //   border-bottom: 1px solid var(--color-grey-100);

// //   &:first-child {
// //     border-top: 1px solid var(--color-grey-100);
// //   }
// // `;

// // const TodayList = styled.ul`
// //   overflow-y: auto;
// //   max-height: 32rem;
// //   padding-right: 0.8rem;

// //   &::-webkit-scrollbar {
// //     width: 6px;
// //   }
// //   &::-webkit-scrollbar-thumb {
// //     background-color: var(--color-grey-300);
// //     border-radius: 10px;
// //   }
// // `;

// // const NoActivity = styled.p`
// //   text-align: center;
// //   font-size: 1.8rem;
// //   font-weight: 500;
// //   margin-top: 0.8rem;
// // `;

// // function Today({ results = [] }) {

// //   if (results.length === 0) return <NoActivity>No Activity for Today's...</NoActivity>
// //   return (
// //     <StyledTodayI>
// //       <Row type="horizontal">
// //         <Heading as="h2">Today</Heading>
// //       </Row>
// //       <TodayList>

// //         {
// //           results.map((items) =>
// //             <TodayItem items={items} key={items.id} />

// //           )
// //         }


// //       </TodayList>
// //     </StyledTodayI>
// //   );
// // }

// // export default Today;
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
// //   grid-template-columns: 7.5rem 2.4rem minmax(14rem, 1fr) 8rem 10rem;
// //   gap: 1.6rem;
// //   align-items: center;
// //   font-size: 1.4rem;
// //   padding: 1.2rem 0.4rem;
// //   border-bottom: 1px solid var(--color-grey-100);

// //   &:first-child {
// //     border-top: 1px solid var(--color-grey-100);
// //   }

// //   &:hover {
// //     background-color: var(--color-grey-50);
// //   }
// // `;

// // const Guest = styled.div`
// //   font-weight: 600;
// //   color: var(--color-grey-800);
// // `;

// // const Nights = styled.div`
// //   font-weight: 600;
// //   color: var(--color-brand-600);
// //   text-align: right;
// // `;

// // const Today = ({ items }) => {
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

// //   const { checkin, isProcessing, error } = useUpdateBookings();

// //   const handleCheckOut = ({
// //     columnName,
// //     columnValue,
// //     errorMsg,
// //     successMsg,
// //   }) => {
// //     const obj = mapObj(columnName, columnValue);
// //     checkin({
// //       id,
// //       obj,
// //       errorMsg,
// //       successMsg,
// //     });
// //   };

// //   return (
// //     <StyledTodayI>
// //       {status === "checked-in" ? (
// //         <Tag type="green">Arrived</Tag>
// //       ) : status === "unconfirmed" ? (
// //         <Tag type="yellow">Arriving</Tag>
// //       ) : (
// //         <Tag type="grey">Departed</Tag>
// //       )}

// //       <Flag
// //         src={countryFlag || "src/data/img/usFlag.png"}
// //         alt={`Flag of ${country}`}
// //       />

// //       <Guest>{fullName}</Guest>

// //       <Nights>{numNights} nights</Nights>

// //       {status === "unconfirmed" && (
// //         <Button
// //           size="small"
// //           variant="contained"
// //           component={Link}
// //           to={`/check-in-out/${id}`}
// //           disabled={error}
// //         >
// //           Check in
// //         </Button>
// //       )}

// //       {status === "checked-in" && (
// //         <CheckOutBooking
// //           onCheckOut={handleCheckOut}
// //           isLoading={isProcessing}
// //         />
// //       )}
// //     </StyledTodayI>
// //   );
// // };

// // export default TodayItem;
// import styled from "styled-components";
// import Heading from "../../ui/Heading";
// import Row from "../../ui/Row";
// import TodayItem from "./TodayItem";

// const StyledToday = styled.div`
//   background-color: var(--color-grey-0);
//   border: 1px solid var(--color-grey-100);
//   border-radius: var(--border-radius-md);
//   padding: 2.4rem 3.2rem;
//   display: flex;
//   flex-direction: column;
//   gap: 2.4rem;
//   grid-column: 1 / span 2;
// `;

// const TodayList = styled.ul`
//   overflow-y: auto;
//   max-height: 32rem;
//   padding-right: 0.8rem;

//   &::-webkit-scrollbar {
//     width: 6px;
//   }
//   &::-webkit-scrollbar-thumb {
//     background-color: var(--color-grey-300);
//     border-radius: 10px;
//   }
// `;

// const NoActivity = styled.p`
//   text-align: center;
//   font-size: 1.6rem;
//   font-weight: 500;
//   color: var(--color-grey-500);
//   margin-top: 2rem;
// `;

// function Today({ results = [] }) {
//   return (
//     <StyledToday>
//       <Row type="horizontal">
//         <Heading as="h2">Today</Heading>
//       </Row>

//       {results.length === 0 ? (
//         <NoActivity>No activity for today</NoActivity>
//       ) : (
//         <TodayList>
//           {results.map((items) => (
//             <TodayItem items={items} key={items.id} />
//           ))}
//         </TodayList>
//       )}
//     </StyledToday>
//   );
// }

// export default Today;
import styled from "styled-components";
import Heading from "../../ui/Heading";
import Row from "../../ui/Row";
import TodayItem from "./TodayItem";
import Empty from "../../ui/Empty";

const StyledToday = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 3.2rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  grid-column: 1 / span 2;
`;

const TodayList = styled.ul`
  overflow-y: auto;
  max-height: 32rem;
  padding-right: 0.8rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-grey-300);
    border-radius: 10px;
  }
`;

const NoActivity = styled.p`
  text-align: center;
  font-size: 1.6rem;
  font-weight: 500;
  color: var(--color-grey-500);
  margin-top: 2rem;
`;

function TodayActivity({ results = [] }) {
  if (!Array.isArray(results)) {
    console.error("Invalid results:", results);
    return <Empty resource={"todayActivity"} />;
  }
  console.log('results', results)
  return (
    <StyledToday>TodayActivity
      <Row type="horizontal">
        <Heading as="h2">Today</Heading>
      </Row>

      {results.length === 0 ? (
        <NoActivity>No activity for today</NoActivity>
      ) : (
        <TodayList>
          {results.map((items) => (
            <TodayItem items={items} key={items.id} />
          ))}
        </TodayList>
      )}
    </StyledToday>
  );
}

export default TodayActivity;
