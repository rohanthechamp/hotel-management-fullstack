import styled from "styled-components";

export const StyledErrorFallback = styled.main`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4.8rem;
`;

export const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 4.8rem;
  flex: 0 1 96rem;
  text-align: center;

  & h1 {
    margin-bottom: 1.6rem;
  }

  & p {
    font-family: "Sono";
    margin-bottom: 3.2rem;
    color: var(--color-grey-500);
  }
`;

function ErrorFallback({ children,error='' }) {
  return (
    <StyledErrorFallback>
      <Box>
        <h1>Something went wrong- { error.message || String(error) }</h1>
        {children}
      </Box>
    </StyledErrorFallback>
  );
}

export default ErrorFallback;   // default export
