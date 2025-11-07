import styled, { keyframes } from "styled-components";

const pop = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 6px 20px rgba(52, 152, 219, 0.2); }
  50% { box-shadow: 0 0 25px rgba(52, 152, 219, 0.6); }
`;

const FancyButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 1.6rem;
  color: #fff;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #3498db, #2980b9);
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
  animation: ${pop} 2s ease-in-out infinite,
    ${glow} 2s ease-in-out infinite alternate;

  &:hover {
    transform: scale(1.08) translateY(-2px);
    box-shadow: 0 12px 30px rgba(52, 152, 219, 0.5);
  }

  &:active {
    transform: scale(0.98) translateY(0);
    box-shadow: 0 6px 15px rgba(52, 152, 219, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    animation: none;
    box-shadow: none;
  }
`;

function CheckOutBooking({ onCheckOut, isLoading }) {
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
    >
      {isLoading ? "Processing..." : "Check Out"}
    </FancyButton>
  );
}

export default CheckOutBooking;
