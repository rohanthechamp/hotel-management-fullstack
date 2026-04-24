// import styled from "styled-components";

// import BookingDataBox from "./BookingDataBox";
// import Row from "../../ui/Row";
// import Heading from "../../ui/Heading";
// import Tag from "../../ui/Tag";
// import ButtonGroup from "../../ui/ButtonGroup";
// import Button from "../../ui/Button";
// import ButtonText from "../../ui/ButtonText";

// import { useMoveBack } from "../../hooks/useMoveBack";
// import { useNavigate, useParams } from "react-router-dom";
// // import { getBooking } from "../../services/apiBookings";
// // import { useQuery } from "@tanstack/react-query";
// import { TbTruckLoading } from "react-icons/tb";
// import { BiErrorCircle } from "react-icons/bi";
// import useSingleBooking from "./useSingleBooking";
// import Menus from "../../ui/Menus";
// import { HiArrowDownOnSquare } from "react-icons/hi2";
// import Spinner from "../../ui/Spinner";
// // import { useParams } from "react-router-dom";

// const HeadingGroup = styled.div`
//   display: flex;
//   gap: 2.4rem;
//   align-items: center;
// `;

// function BookingDetail() {
//   const { bookingId } = useParams();
//   const { data, isLoading, error } = useSingleBooking(bookingId);
//   const navigate = useNavigate();
//   const moveBack = useMoveBack();
//   console.log(`Single Booking data= ${data} for id ${bookingId}`);
//   console.log('Single Booking data=', data)
//   if (isLoading) return <TbTruckLoading />;
//   if (error) return <BiErrorCircle />;
//   const { status } = data;

//   const statusToTagName = {
//     unconfirmed: "blue",
//     "checked-in": "green",
//     "checked-out": "silver",
//   };

//   return (
//     <>
//       <Row type="horizontal">
//         <HeadingGroup>
//           <Heading as="h1">Booking #X</Heading>
//           <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>
//         </HeadingGroup>
//         <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
//       </Row>

//       {data ? <BookingDataBox booking={data} /> : <Spinner />}
//       <ButtonGroup>
//         <Menus>
//           <Menus.Menu>
//             {status === "unconfirmed" && (
//               <Menus.Button
//                 icon={<HiArrowDownOnSquare />}
//                 onClick={() => navigate(`/check-in-out/${bookingId}`)}
//               >
//                 Check in
//               </Menus.Button>
//             )}
//           </Menus.Menu>
//         </Menus>

//         <Button variation="secondary" onClick={moveBack}>
//           Back
//         </Button>
//       </ButtonGroup>
//     </>
//   );
// }

// export default BookingDetail;
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { HiArrowDownOnSquare, HiChevronLeft } from "react-icons/hi2";
import { TbTruckLoading } from "react-icons/tb";
import { BiErrorCircle } from "react-icons/bi";
import { Bookmark, ShieldCheck, ArrowLeft } from "lucide-react";

import BookingDataBox from "./BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Menus from "../../ui/Menus";
import Spinner from "../../ui/Spinner";

import { useMoveBack } from "../../hooks/useMoveBack";
import useSingleBooking from "./useSingleBooking";

// --- NEON DARK UI COMPONENTS ---
const BookingHeaderWrapper = styled.div`
  background-color: #1a1c22;
  padding: 2.4rem 3.2rem;
  border-radius: 24px;
  border-left: 4px solid #ec4899;
  margin-bottom: 2.4rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;

  & h1 {
    color: white;
    font-weight: 900;
    letter-spacing: -1px;
  }
`;

const StyledStatusTag = styled(Tag)`
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 1px;
  padding: 0.6rem 1.4rem;
  border-radius: 100px;
  font-size: 1.1rem;
  
  /* Applying neon glow based on your status logic */
  ${(props) => props.type === "blue" && `background: rgba(59, 130, 246, 0.1); color: #60a5fa; border: 1px solid #3b82f6;`}
  ${(props) => props.type === "green" && `background: rgba(16, 185, 129, 0.1); color: #34d399; border: 1px solid #10b981;`}
  ${(props) => props.type === "silver" && `background: rgba(156, 163, 175, 0.1); color: #d1d5db; border: 1px solid #9ca3af;`}
`;

const BackButton = styled(ButtonText)`
  color: #8a94a6;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: all 0.3s;

  &:hover {
    color: #ec4899;
    transform: translateX(-4px);
  }
`;

function BookingDetail() {
  const { bookingId } = useParams();
  const { data, isLoading, error } = useSingleBooking(bookingId);
  const navigate = useNavigate();
  const moveBack = useMoveBack();

  // Logic - DO NOT TOUCH
  if (isLoading) return <div className="flex justify-center p-20 text-pink-500"><TbTruckLoading size={40} className="animate-spin" /></div>;
  if (error) return <div className="flex justify-center p-20 text-red-500"><BiErrorCircle size={40} /></div>;
  
  const { status } = data;

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  return (
    <>
      <Row type="horizontal" style={{ marginBottom: "1.2rem" }}>
        <BackButton onClick={moveBack}>
          <ArrowLeft size={18} /> Back to List
        </BackButton>
      </Row>

      <BookingHeaderWrapper>
        <HeadingGroup>
          <div className="bg-[#262930] p-4 rounded-2xl text-[#ec4899]">
            <Bookmark size={24} />
          </div>
          <div>
            <Heading as="h1">Booking #{bookingId}</Heading>
            <p className="text-[#606d80] text-xs font-bold uppercase tracking-widest mt-1">
              Internal Reference ID: {bookingId}
            </p>
          </div>
          <StyledStatusTag type={statusToTagName[status]}>
            {status.replace("-", " ")}
          </StyledStatusTag>
        </HeadingGroup>

        <div className="flex items-center gap-2 text-[#10b981] bg-[#10b981]/10 px-4 py-2 rounded-xl border border-[#10b981]/20">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-tighter">Verified Booking</span>
        </div>
      </BookingHeaderWrapper>

      {/* Main Content Box */}
      <div className="shadow-2xl rounded-3xl overflow-hidden border border-[#3a404c]/30">
        {data ? <BookingDataBox booking={data} /> : <Spinner />}
      </div>

      {/* Footer Actions */}
      <ButtonGroup style={{ marginTop: "3.2rem" }}>
        <div className="flex items-center gap-4">
            <Menus>
                <Menus.Menu>
                    {status === "unconfirmed" && (
                    <Button
                        style={{ 
                            background: 'linear-gradient(90deg, #6b21a8 0%, #ec4899 100%)',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}
                        onClick={() => navigate(`/check-in-out/${bookingId}`)}
                    >
                        <HiArrowDownOnSquare size={20} />
                        Check in Booking
                    </Button>
                    )}
                </Menus.Menu>
            </Menus>

            <Button 
                variation="secondary" 
                onClick={moveBack}
                style={{ background: '#262930', border: '1px solid #3a404c', color: '#8a94a6' }}
            >
                Return to Dashboard
            </Button>
        </div>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;