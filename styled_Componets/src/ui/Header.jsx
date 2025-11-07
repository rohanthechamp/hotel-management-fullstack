import styled from "styled-components"

// import React from 'react'
const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 3rem 3.8rem;
  border-bottom: 1px solid var(--color-grey-300);
`;
const Header = () => {
  return (
    <StyledHeader>Header</StyledHeader>
  )
}

export default Header