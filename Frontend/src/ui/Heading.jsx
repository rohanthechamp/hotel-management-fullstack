import styled, { css } from "styled-components";
// const text = css`text-align-center
// ${10 < 5 && "background-color:red"}
// `;
// import React from 'react'
const Heading = styled.h1`
  ${(props) =>
    props.as === "h1" &&
    css`
      font-size: 6rem;
      font-weight: 600;
    `}

  ${(props) =>
    props.as === "h1" &&
    css`
      font-size: 2rem;
      font-weight: 600;
    `}


     ${(props) =>
    props.as === "h1" &&
    css`
      font-size: 2rem;
      font-weight: 500;
    `}
  line-height:1.4;
`;


export default Heading;
