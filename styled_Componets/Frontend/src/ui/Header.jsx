// import styled from "styled-components";
// import { useContext } from "react";
// import AuthContext from "../context/AuthProvider";
// import LogOut from "../features/authentication/LogOut";
// import { useNavigate } from "react-router-dom";
// import Button from "@mui/material/Button";

// const StyledHeader = styled.header`
//   background-color: var(--color-grey-0);
//   padding: 3rem 3.8rem;
//   border-bottom: 1px solid var(--color-grey-300);

//   display: flex;
//   align-items: center;
//   justify-content: space-between;
// `;

// const UserInfo = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 0.4rem;
//   background-color: burlywood;

//   p {
//     margin: 0;
//     font-size: 1.4rem;
//     color: var(--color-grey-700);
//   }

//   span {
//     font-weight: 600;
//     color: var(--color-grey-900);
//   }
// `;

// const Header = () => {
//   const { auth } = useContext(AuthContext);
//   const navigate = useNavigate();

//   // single source of truth
//   const isAuthenticated = auth?.isAuthAuthenticated;

//   const username = auth?.username;
//   const email = auth?.email;
//   const refreshToken = auth?.refreshToken;
//   console.log("auth state data", auth);
//   return (
//     <StyledHeader>
//       <p>Dashboard</p>

//       {isAuthenticated ? (
//         <>
//           <UserInfo>
//             <p>
//               Signed in as <span>{username}</span>
//             </p>
//             {email && <p>{email}</p>}
//           </UserInfo>

//           {refreshToken && (
//             <LogOut userRefreshToken={refreshToken} />

//           )}
//         </>
//       ) : (
//         <>
//           <p>Guest</p>
//             <Button variant="contained" size="large" onClick={() => navigate("/login")}>
//             Log IN to Authenticated
//           </Button></>
//       )}
//     </StyledHeader>
//   );
// };

// export default Header;

import styled from "styled-components";
import HeaderMenu from "./HeaderMenu";
import UserAvatar from "../features/authentication/UserAvatar";

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  /* background-color: #c33636; */
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
`;

function Header() {
  return (
    <StyledHeader>
      <UserAvatar/>
      <HeaderMenu />
    </StyledHeader>
  );
}

export default Header;
