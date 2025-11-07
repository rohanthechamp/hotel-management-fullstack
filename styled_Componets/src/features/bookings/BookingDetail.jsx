import styled from "styled-components";

import BookingDataBox from "./BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useNavigate, useParams } from "react-router-dom";
// import { getBooking } from "../../services/apiBookings";
// import { useQuery } from "@tanstack/react-query";
import { TbTruckLoading } from "react-icons/tb";
import { BiErrorCircle } from "react-icons/bi";
import useSingleBooking from "./useSingleBooking";
import Menus from "../../ui/Menus";
import { HiArrowDownOnSquare } from "react-icons/hi2";
import Spinner from "../../ui/Spinner";
// import { useParams } from "react-router-dom";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { bookingId } = useParams();
  const { data, isLoading, error } = useSingleBooking(bookingId);
  const navigate = useNavigate();
  const moveBack = useMoveBack();
  console.log(`Single Booking data= ${data} for id ${bookingId}`);
  if (isLoading) return <TbTruckLoading />;
  if (error) return <BiErrorCircle />;
  const { status } = data;

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #X</Heading>
          <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      {data ? <BookingDataBox booking={data} /> : <Spinner />}
      <ButtonGroup>
        <Menus>
          <Menus.Menu>
            {status === "unconfirmed" && (
              <Menus.Button
                icon={<HiArrowDownOnSquare />}
                onClick={() => navigate(`/check-in-out/${bookingId}`)}
              >
                Check in
              </Menus.Button>
            )}
          </Menus.Menu>
        </Menus>

        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
