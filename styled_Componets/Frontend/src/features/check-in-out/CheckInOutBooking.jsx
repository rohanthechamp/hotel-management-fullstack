/* eslint-disable no-unused-vars */
import BookingDataBox from "../bookings/BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonText from "../../ui/ButtonText";
import { useMoveBack } from "../../hooks/useMoveBack";
import useSingleBooking from "../bookings/useSingleBooking";
import { useParams } from "react-router-dom";
import { useUpdateBookings } from "../bookings/useUpdateBookings";
import { useCallback } from "react";
import CheckOutBooking from "./CheckOutBooking";
import CheckInBooking from "./CheckInBooking";
import Spinner from "../../ui/Spinner";
import ErrorFallback from "../../ui/ErrorFallback";
// import Button from "../../ui/Button";

const CheckInOutBooking = () => {
  const moveBack = useMoveBack();

  const { bookingId } = useParams();
  const { data, isLoading, error: singleBookingError } = useSingleBooking(bookingId);
  const { checkin, isProcessing, error: updateBookingError } = useUpdateBookings(bookingId);

  const handleUpdates = useCallback(
    ({ columnName, columnValue, errorMsg, successMsg }) => {
      let obj = {};

      console.log(obj);

      for (let index = 0; index < columnName.length; index++) {
        obj[columnName[index]] = columnValue[index];
      }
      console.log(   'CheckInOutBooking - ' , obj)

      checkin({
        id: bookingId,
        obj: obj,
        errorMsg,
        successMsg,
      });
    },
    [bookingId, checkin]
  );
  if (isLoading || isProcessing) return <Spinner />;

  if (singleBookingError || updateBookingError) return (

    <ErrorFallback error={singleBookingError || updateBookingError} />

  );
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check IN-OUT booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>
      <BookingDataBox booking={data} />

      {data?.status === "checked-in" && (
        <CheckOutBooking onCheckOut={handleUpdates} isLoading={isProcessing} />
      )}


      {data?.status === "unconfirmed" && (
        <CheckInBooking data={data} onCheckIn={handleUpdates} isLoading={isProcessing} />
      )
      }


    </>
  );
};

export default CheckInOutBooking;
