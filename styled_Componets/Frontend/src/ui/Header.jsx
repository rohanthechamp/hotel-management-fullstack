// import styled from "styled-components"
// import AuthContext from "../context/AuthProvider";
// import { useContext } from "react";
// // import { useAuth } from "../services/useAuth";

// import React from 'react'
// import LogOut from "../features/authentication/LogOut";
// const StyledHeader = styled.header`
//   background-color: var(--color-grey-0);
//   padding: 3rem 3.8rem;
//   border-bottom: 1px solid var(--color-grey-300);
// `;

// const Header = () => {
//   const { auth } = useContext(AuthContext);
//   const [userRefreshToken, setUserRefreshToken] = React.useState(null);

//   React.useEffect(() => {
//     const RefreshToken = localStorage.getItem("refreshToken");

//     setUserRefreshToken(RefreshToken);
//   }, []);
//   return (
//     <StyledHeader>
//       <p>Header</p>

//       {(auth.isAuthAuthenticated || localStorage.getItem('username')) ? (
//         <>
//           <p>You are authenticated as {auth.username || localStorage.getItem('username')}</p>
//           <p>Username: {auth.username ?? "N/A"}</p>
//           <p>Email: {auth.email ?? "N/A"}</p></>
//       ) : (

//         <p>You are NOT Authenticated</p>

//       )}
//       {userRefreshToken && <LogOut userRefreshToken={userRefreshToken} />}

//     </StyledHeader>
//   );
// };

// export default Header;

import styled from "styled-components";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import LogOut from "../features/authentication/LogOut";

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 3rem 3.8rem;
  border-bottom: 1px solid var(--color-grey-300);

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  background-color: burlywood;

  p {
    margin: 0;
    font-size: 1.4rem;
    color: var(--color-grey-700);
  }

  span {
    font-weight: 600;
    color: var(--color-grey-900);
  }
`;

const Header = () => {
  const { auth } = useContext(AuthContext);

  // single source of truth
  const isAuthenticated = auth?.isAuthAuthenticated

  const username = auth?.username;
  const email = auth?.email;
  const refreshToken = auth?.refreshToken
  console.log('auth state data', auth)
  return (
    <StyledHeader>
      <p>Dashboard</p>

      {isAuthenticated ? (
        <>
          <UserInfo>
            <p>
              Signed in as <span>{username}</span>
            </p>
            {email && <p>{email}</p>}
          </UserInfo>

          {refreshToken && <LogOut userRefreshToken={refreshToken} />}
        </>
      ) : (
        <p>Guest</p>
      )}
    </StyledHeader>
  );
};

export default Header;
