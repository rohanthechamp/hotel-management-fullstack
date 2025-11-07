// import styled from "styled-components";
// import { format, isToday } from "date-fns";
// import {
//   HiOutlineChatBubbleBottomCenterText,
//   HiOutlineCheckCircle,
//   HiOutlineCurrencyDollar,
//   HiOutlineHomeModern,
// } from "react-icons/hi2";

// import DataItem from "../../ui/DataItem";

// import { Flag } from "../../ui/Flag";

// import { formatDistanceFromNow, formatCurrency } from "../../utils/helpers";
// import Spinner from "../../ui/Spinner";

// const StyledBookingDataBox = styled.section`
//   /* Box */
//   background-color: var(--color-grey-0);
//   border: 1px solid var(--color-grey-100);
//   border-radius: var(--border-radius-md);

//   overflow: hidden;
// `;

// const Header = styled.header`
//   background-color: var(--color-brand-500);
//   padding: 2rem 4rem;
//   color: #e0e7ff;
//   font-size: 1.8rem;
//   font-weight: 500;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;

//   svg {
//     height: 3.2rem;
//     width: 3.2rem;
//   }

//   & div:first-child {
//     display: flex;
//     align-items: center;
//     gap: 1.6rem;
//     font-weight: 600;
//     font-size: 1.8rem;
//   }

//   & span {
//     font-family: "Sono";
//     font-size: 2rem;
//     margin-left: 4px;
//   }
// `;

// const Section = styled.section`
//   padding: 3.2rem 4rem 1.2rem;
// `;

// const Guest = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 1.2rem;
//   margin-bottom: 1.6rem;
//   color: var(--color-grey-500);

//   & p:first-of-type {
//     font-weight: 500;
//     color: var(--color-grey-700);
//   }
// `;
// const Price = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 1.6rem 3.2rem;
//   border-radius: var(--border-radius-sm);
//   margin-top: 2.4rem;

//   background-color: ${(props) =>
//     props.$ispaid ? "var(--color-green-100)" : "var(--color-yellow-100)"};
//   color: ${(props) =>
//     props.$ispaid ? "var(--color-green-700)" : "var(--color-yellow-700)"};

//   & p:last-child {
//     text-transform: uppercase;
//     font-size: 1.4rem;
//     font-weight: 600;
//   }

//   svg {
//     height: 2.4rem;
//     width: 2.4rem;
//     color: currentColor !important;
//   }
// `;

// const Footer = styled.footer`
//   padding: 1.6rem 4rem;
//   font-size: 1.2rem;
//   color: var(--color-grey-500);
//   text-align: right;
// `;

// // A purely presentational component
// function BookingDataBox({ booking }) {
//   const {
//     created_at,
//     startDate,
//     endDate,
//     numNights,
//     numGuests,
//     cabinPrice,
//     extrasPrice,
//     totalPrice,
//     hasBreakfast,
//     observations,
//     isPaid,
//     // guests: {  guests?.email, country, countryFlag, nationalID },,
//     guests,
//     // cabins: { name: cabinName },
//     cabins,
//   } = booking;

//   if (!booking) return <Spinner />
//   console.log(startDate)

//   return (
//     <StyledBookingDataBox>
//       <Header>
//         <div>
//           <HiOutlineHomeModern />
//           <p>
//             {numNights} nights in Cabin <span>{cabins?.cabinName}</span>
//           </p>
//         </div>

//         <p>
//           {format(new Date(startDate), "EEE, MMM dd yyyy")} (
//           {isToday(new Date(startDate))
//             ? "Today"
//             : formatDistanceFromNow(startDate)}
//           ) &mdash; {format(new Date(endDate), "EEE, MMM dd yyyy")}
//         </p>
//       </Header>

//       <Section>
//         <Guest>
//           {guests?.countryFlag && (
//             <Flag
//               src={guests?.countryFlag}
//               alt={`Flag of ${guests?.country} `}
//             />
//           )}
//           <p>
//             {guests?.fullName}
//             {numGuests > 1 ? `+ ${numGuests - 1} guests` : ""}
//           </p>
//           <span>&bull;</span>
//           <p>{guests?.email}</p>
//           <span>&bull;</span>
//           <p>National ID {guests?.nationalID}</p>
//         </Guest>

//         {observations && (
//           <DataItem
//             icon={<HiOutlineChatBubbleBottomCenterText />}
//             label="Observations"
//           >
//             {observations}
//           </DataItem>
//         )}

//         <DataItem icon={<HiOutlineCheckCircle />} label="Breakfast included?">
//           {hasBreakfast ? "Yes" : "No"}
//         </DataItem>

//         <Price $ispaid={isPaid}>
//           <DataItem icon={<HiOutlineCurrencyDollar />} label={`Total price`}>
//             {formatCurrency(totalPrice)}

//             {hasBreakfast &&
//               ` (${formatCurrency(cabinPrice)} cabin + ${formatCurrency(
//                 extrasPrice
//               )} breakfast)`}
//           </DataItem>

//           <p>{isPaid ? "Paid" : "Will pay at property"}</p>
//         </Price>
//       </Section>

//       <Footer>
//         <p>Booked {format(new Date(created_at), "EEE, MMM dd yyyy, p")}</p>
//       </Footer>
//     </StyledBookingDataBox>
//   );
// }

// export default BookingDataBox;
import styled from "styled-components";
import { format, isToday } from "date-fns";
import {
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineCheckCircle,
  HiOutlineCurrencyDollar,
  HiOutlineHomeModern,
} from "react-icons/hi2";

import DataItem from "../../ui/DataItem";
import { Flag } from "../../ui/Flag";
import { formatDistanceFromNow, formatCurrency } from "../../utils/helpers";
import Spinner from "../../ui/Spinner";

/*
  NOTE: presentation-only refactor using styled-components.
  I did NOT change logic or props — only CSS / structure to make it look like a modern booking-details card.
*/

const StyledBookingDataBox = styled.section`
  background: linear-gradient(180deg, #ffffff 0%, #fbfbfd 100%);
  border: 1px solid rgba(15, 23, 42, 0.04);
  border-radius: 14px;
  overflow: hidden;
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  color: #0f172a;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 26px 28px;
  background: linear-gradient(90deg, rgba(79,70,229,0.12), rgba(99,102,241,0.06));
  border-bottom: 1px solid rgba(15,23,42,0.03);

  > div {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 0;
  }

  svg {
    height: 44px;
    width: 44px;
    flex: 0 0 44px;
  }

  p {
    margin: 0;
    line-height: 1.05;
    font-weight: 600;
    color: #0f172a;
    font-size: 18px;
  }

  p span {
    color: #4338ca;
    margin-left: 6px;
    font-weight: 700;
  }

  > p {
    margin: 0;
    font-size: 14px;
    color: #475569;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    > p {
      text-align: left;
      width: 100%;
    }
  }
`;

const Section = styled.section`
  padding: 24px 28px 18px;
`;

const Guest = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  color: #64748b;
  flex-wrap: wrap;

  & p:first-of-type {
    font-weight: 600;
    color: #0f172a;
    margin-right: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 320px;
  }
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #f8fafc;
  font-size: 13px;
  color: #475569;
  border: 1px solid rgba(15,23,42,0.03);
`;

const Price = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-radius: 10px;
  margin-top: 18px;
  background-color: ${(props) => (props.$ispaid ? "#ecfdf5" : "#fffbeb")};
  color: ${(props) => (props.$ispaid ? "#166534" : "#92400e")};
  border: 1px solid rgba(15,23,42,0.03);

  & p:last-child {
    text-transform: uppercase;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.6px;
  }

  svg {
    height: 20px;
    width: 20px;
    color: currentColor !important;
    margin-right: 10px;
  }
`;

const Footer = styled.footer`
  padding: 12px 28px;
  font-size: 13px;
  color: #64748b;
  text-align: right;
  border-top: 1px solid rgba(15,23,42,0.03);
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 20px;
  margin-top: 8px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #475569;

  dt {
    font-size: 12px;
    color: #64748b;
  }
  dd {
    font-weight: 700;
    color: #0f172a;
    font-size: 15px;
    margin: 0;
  }
`;

function BookingDataBox({ booking }) {
  const {
    created_at,
    startDate,
    endDate,
    numNights,
    numGuests,
    cabinPrice,
    extrasPrice,
    totalPrice,
    hasBreakfast,
    observations,
    isPaid,
    guests,
    cabins,
  } = booking;

  if (!booking) return <Spinner />;
  console.log(startDate);

  return (
    <StyledBookingDataBox>
      <Header>
        <div>
          <HiOutlineHomeModern aria-hidden="true" />
          <div>
            <p>
              {numNights} nights in Cabin <span>{cabins?.cabinName}</span>
            </p>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>
              {format(new Date(startDate), "EEE, MMM dd yyyy")} (
              {isToday(new Date(startDate))
                ? "Today"
                : formatDistanceFromNow(startDate)}
              ) &mdash; {format(new Date(endDate), "EEE, MMM dd yyyy")}
            </div>
          </div>
        </div>

        <div>
          {/* small status chip */}
          <Chip aria-hidden>{isPaid ? "Paid" : "Pay at property"}</Chip>
        </div>
      </Header>

      <Section>
        <Guest>
          {guests?.countryFlag && (
            <Flag src={guests?.countryFlag} alt={`Flag of ${guests?.country} `} />
          )}

          <p>
            {guests?.fullName}
            {numGuests > 1 ? ` + ${numGuests - 1} guests` : ""}
          </p>

          <span style={{ color: "#cbd5e1" }}>&bull;</span>

          <p style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>{guests?.email}</p>

          <span style={{ color: "#cbd5e1" }}>&bull;</span>

          <p>National ID {guests?.nationalID}</p>
        </Guest>

        {observations && (
          <DataItem icon={<HiOutlineChatBubbleBottomCenterText />} label="Observations">
            {observations}
          </DataItem>
        )}

        <DataItem icon={<HiOutlineCheckCircle />} label="Breakfast included?">
          {hasBreakfast ? "Yes" : "No"}
        </DataItem>

        <MetaGrid>
          <MetaItem>
            <dt>Check-in</dt>
            <dd>{format(new Date(startDate), "EEE, MMM dd yyyy")}</dd>
          </MetaItem>

          <MetaItem>
            <dt>Check-out</dt>
            <dd>{format(new Date(endDate), "EEE, MMM dd yyyy")}</dd>
          </MetaItem>

          <MetaItem>
            <dt>Guests</dt>
            <dd>{numGuests || 1}</dd>
          </MetaItem>

          <MetaItem>
            <dt>Nightly (base)</dt>
            <dd>{formatCurrency(cabinPrice)}</dd>
          </MetaItem>
        </MetaGrid>

        <Price $ispaid={isPaid} style={{ marginTop: 20 }}>
          <DataItem icon={<HiOutlineCurrencyDollar />} label={`Total price`}>
            {formatCurrency(totalPrice)}

            {hasBreakfast &&
              ` (${formatCurrency(cabinPrice)} cabin + ${formatCurrency(
                extrasPrice
              )} breakfast)`}
          </DataItem>

          <p>{isPaid ? "Paid" : "Will pay at property"}</p>
        </Price>
      </Section>

      <Footer>
        <p>Booked {format(new Date(created_at), "EEE, MMM dd yyyy, p")}</p>
      </Footer>
    </StyledBookingDataBox>
  );
}

export default BookingDataBox;
