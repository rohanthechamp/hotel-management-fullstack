import styled from "styled-components"
// import { useAuth } from "../services/useAuth";

// import React from 'react'
const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 3rem 3.8rem;
  border-bottom: 1px solid var(--color-grey-300);
`;
const Header = () => {
  // const { username } = useAuth()
  return (
    <StyledHeader>Header</StyledHeader>
  //   {
  //   // username ? <p>Hi {username} </p> : null
  // }
  )
}

export default Header