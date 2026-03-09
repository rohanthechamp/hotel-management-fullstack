import styled, { keyframes } from "styled-components";
import Heading from "./Heading";
import { GlobalStyles } from "@mui/material";

/* Animations */
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/* Layout */
const StyledErrorFallback = styled.main`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    var(--color-grey-50),
    var(--color-grey-100)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4.8rem;
`;

/* Card */
const Box = styled.div`
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(10px);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.08);

  padding: 5.6rem;
  max-width: 64rem;
  width: 100%;
  text-align: center;

  animation: ${fadeIn} 0.4s ease-out;

  & h1 {
    margin-bottom: 1.2rem;
  }

  & p {
    font-family: "Sono";
    margin-bottom: 3.6rem;
    color: var(--color-grey-600);
    line-height: 1.6;
  }
`;

const Emoji = styled.span`
  font-size: 4.8rem;
  display: block;
  margin-bottom: 1.6rem;
`;

/* Actions */
const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.6rem;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  background-color: var(--color-brand-600);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  padding: 1.2rem 2.6rem;
  font-size: 1.4rem;
  font-weight: 500;
  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    background-color: var(--color-brand-700);
    transform: translateY(-1px);
  }
`;

const SecondaryButton = styled.button`
  background-color: transparent;
  color: var(--color-grey-700);
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  padding: 1.2rem 2.6rem;
  font-size: 1.4rem;
  font-weight: 500;
  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    background-color: var(--color-grey-100);
    transform: translateY(-1px);
  }
`;

function ErrorFallback({ error }) {

  return (
    <>
      <GlobalStyles />

      <StyledErrorFallback>
        <Box>
          <Emoji>🧯</Emoji>

          <Heading as="h1">
            Something went wrong
          </Heading>

          <p>{error.message}</p>

          <Actions>
            <PrimaryButton onClick={() => window.location.reload()}>
              Reload page
            </PrimaryButton>

            <SecondaryButton onClick={() => window.location.replace("/")}>
              Go to Homepage
            </SecondaryButton>
          </Actions>
        </Box>
      </StyledErrorFallback>
    </>
  );
}

export default ErrorFallback;
// import styled from "styled-components";
// import Heading from "./Heading";
// import { GlobalStyles } from "@mui/material";

// export const StyledErrorFallback = styled.main`
//   height: 100vh;
//   background-color: var(--color-grey-50);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   padding: 4.8rem;
// `;

// export const Box = styled.div`
//   /* Box */
//   background-color: var(--color-grey-0);
//   border: 1px solid var(--color-grey-100);
//   border-radius: var(--border-radius-md);

//   padding: 4.8rem;
//   flex: 0 1 96rem;
//   text-align: center;

//   & h1 {
//     margin-bottom: 1.6rem;
//   }

//   & p {
//     font-family: "Sono";
//     margin-bottom: 3.2rem;
//     color: var(--color-grey-500);
//   }
// `;

// function ErrorFallback({ error }) {
//   return (
//     <>
//       <GlobalStyles />
//       <StyledErrorFallback>
//         <Box>
//           <Heading as="h1" >
//             Something went wrong 🧐
//           </Heading>
//           <p> {error.message}</p>
//         </Box>
//       </StyledErrorFallback></>
//   );
// }

// export default ErrorFallback;   // default export
