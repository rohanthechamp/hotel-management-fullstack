
import styled from "styled-components"
import AuthContext from "../context/AuthProvider";
import { useContext } from "react";
// import { useAuth } from "../services/useAuth";

// import React from 'react'
const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 3rem 3.8rem;
  border-bottom: 1px solid var(--color-grey-300);
`;



const Header = () => {
  const { auth } = useContext(AuthContext);

  return (
    <StyledHeader>
      <p>Header</p>

      {auth.isAuthAuthenticated ? (
        <>
          <p>You are authenticated as {auth.username}</p>
          <p>Username: {auth.username ?? "N/A"}</p>
          <p>Email: {auth.email ?? "N/A"}</p></>
      ) : (

        <p>You are NOT Authenticated</p>


      )}
    </StyledHeader>
  );
};

export default Header;

