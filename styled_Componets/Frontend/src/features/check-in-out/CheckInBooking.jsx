import styled, { keyframes } from "styled-components";
import ButtonGroup from "../../ui/ButtonGroup";
import Spinner from "../../ui/Spinner";

import ErrorFallback from "../../ui/ErrorFallback";

import { useEffect, useMemo, useState } from "react";
import Checkbox from "../../ui/Checkbox";
import { useSetting } from "../settings/useSetting";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

// Soft pop (subtle bounce)
const pop = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.06);
  }
`;

// Gentle glow pulse
const glow = keyframes`
  0%, 100% {
    box-shadow: 0 8px 20px rgba(39, 174, 96, 0.18);
  }
  50% {
    box-shadow: 0 0 25px rgba(112, 219, 25, 0.7);
  }
`;

const CheckInButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 1.2rem 2.1rem;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #82c584 0%, #b8de9e 100%);
  color: #ffffff;
  font-weight: 600;
  font-size: 2rem;
  letter-spacing: 0.2px;
  cursor: pointer;
  white-space: nowrap;
  transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;

  /* Combined animation */
  animation: ${pop} 2s ease-in-out infinite,
    ${glow} 2s ease-in-out infinite alternate;

  &:hover {
    transform: translateY(-3px) scale(1.08);
    box-shadow: 0 14px 34px rgba(39, 174, 96, 0.3);
  }

  &:active {
    transform: translateY(-1px) scale(0.98);
    box-shadow: 0 6px 16px rgba(39, 174, 96, 0.2);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(46, 204, 113, 0.14);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    animation: none;
    box-shadow: none;
  }
`;

function CheckInBooking({ data, onCheckIn, isLoading }) {
  const [confirmPaid, setConfirmPaid] = useState(false);
  const [confirmBreakfast, setConfirmBreakfast] = useState(false);
  const {
    isLoading: isSettingLoading,
    error: isSettingError,
    settings: settingsData,
  } = useSetting();

  const stablebreakFastPrice = useMemo(() => {
    // Only calculate when user has NOT added breakfast yet
    if (!data?.extrasPrice) {
      const value =
        (data?.numNights ?? 0) *
        (data?.numGuests ?? 0) *
        (settingsData?.breakfastPrice ?? 0);

      return value;
    }
    // If breakfast already added, no need to calculate again
    return null;
  }, [
    data?.extrasPrice,
    data?.numNights,
    data?.numGuests,
    settingsData?.breakfastPrice,
  ]);
  useEffect(() => {
    if (!data) return;

    setConfirmPaid(data?.isPaid ?? false);
    setConfirmBreakfast(data?.extrasPrice ?? false);
    // setBreakFastPrice(stablebreakFastPrice);
    if (Number.isInteger(stablebreakFastPrice))
      console.log(
        `HERE IS THE BREAKFAST VALUE: ${stablebreakFastPrice} for Mr.${data?.guests?.fullName}`
      );
  }, [data, stablebreakFastPrice]);

  if (isSettingLoading) return <Spinner />;

  if (isSettingError) return <ErrorFallback />;

  console.log(settingsData);
  
  const {
    guests = {},
    totalPrice,
  } = data || {};

  return (
    <>
      
          <Box>
            <Checkbox
              id="confirmPaid"
              checked={confirmPaid}
              onChange={() => setConfirmPaid((prev) => !prev)}
              disabled={confirmPaid || isLoading}
            >
              {confirmPaid ? (
                <p>
                  Automatically confirmed that {guests.fullName || "the Guest"}{" "}
                  has done the payment of {totalPrice}
                </p>
              ) : (
                <p>
                  I confirm that {guests.fullName || "the Guest"} has done the
                  payment of {totalPrice}
                </p>
              )}
            </Checkbox>
          </Box>

          {!confirmBreakfast && (
            <Box>
              <Checkbox
                id="confirmBreakfast"
                checked={confirmBreakfast}
                onChange={() => {
                  setConfirmPaid(false);
                  setConfirmBreakfast((prev) => !prev);
                  onCheckIn({
                    columnName: [ "extrasPrice", "totalPrice"],
                    columnValue: [
                      
                      stablebreakFastPrice,
                      data?.totalPrice + stablebreakFastPrice,
                    ],
                    errorMsg: "Failed to add breakfast for ",
                    successMsg: "Successfully added breakfast for ",
                  });
                }}
                disabled={confirmBreakfast || isLoading}
              >
                {stablebreakFastPrice == null ? (
                  <p>
                    Add breakfast for guest {guests.fullName || "the Guest"}
                  </p>
                ) : (
                  <p>
                    Add breakfast for guest {guests.fullName || "the Guest"}{" "}
                    that has price of {stablebreakFastPrice}
                  </p>
                )}
              </Checkbox>
            </Box>
          )}

          <ButtonGroup>
            <CheckInButton
              onClick={() =>
                onCheckIn({
                  columnName: ["status", "isPaid"],
                  columnValue: ["checked-in", true],
                  errorMsg: "Failed to add checked-in status for ",
                  successMsg: "Successfully added checked-in status for ",
                })
              }
              disabled={isLoading}
            >
              {isLoading
                ? "Processing..."
                : `Check in booking #${data?.id}`}
            </CheckInButton>
          </ButtonGroup>

    </>
  );
}

export default CheckInBooking;
