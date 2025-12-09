
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

  console.log("AUTH:", auth,typeof(auth)); // inspect what it actually contains

  return (
    <StyledHeader>
      Header
      <div> {auth[0]} </div>
      <div>{auth?.username ?? "no auth username"}</div>
      <div>{auth?.email ?? "no auth email"}</div>
    </StyledHeader>
  );
};


export default Header
