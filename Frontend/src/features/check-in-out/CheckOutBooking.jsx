// import styled, { keyframes } from "styled-components";

import FancyButton from "../../ui/FancyButton";

function CheckOutBooking({ onCheckOut, isLoading,color='red' }) {
  return (
    <FancyButton
      onClick={() =>
        onCheckOut({
          columnName: ["status"],
          columnValue: ["checked-out"],
          errorMsg: "Failed to add checked-out status for",
          successMsg: "Successfully added checked-out status for",
        })
        
      }
      disabled={isLoading}
      bg={color}
    >
      {isLoading ? "Processing..." : "Check Out"}
    </FancyButton>
  );
}

export default CheckOutBooking;
