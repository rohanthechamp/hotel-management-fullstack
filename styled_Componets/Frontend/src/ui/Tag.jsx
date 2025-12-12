// import styled from "styled-components";

// const Tag = styled.span`
//   width: fit-content;
//   text-transform: uppercase;
//   font-size: 1.1rem;
//   font-weight: 600;
//   padding: 0.4rem 1.2rem;
//   border-radius: 100px;

//   /* Make these dynamic, based on the received prop */
//   color: var(--color-${(props) => props.type}-700);
//   background-color: var(--background-${(props) => props.type}-100);
// `;

// export default Tag;
import styled from "styled-components";

const Tag = styled.span`
  width: 10.4rem;
  text-transform: uppercase;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.8rem 1.2rem;
  border-radius: 100px;

  color: ${(props) => props.color};
  background-color: ${(props) => props.bg};
`;

export default Tag;
