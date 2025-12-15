// import { useEffect } from "react";
import LogOut from "../features/authentication/LogOut";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
// import { useState } from "react";

function Account() {
  // const [userRefreshToken, setUserRefreshToken] = useState(null);


  // useEffect(() => {
  //   const RefreshToken = localStorage.getItem("refreshToken");

  //   setUserRefreshToken(RefreshToken);
  // }, []);

  return (
    <>
      <Heading as="h1">Update your account</Heading>
      {/* {userRefreshToken && <LogOut userRef/>reshToken={userRefreshToken} />} */}

      <Row>
        <Heading as="h3">Update user data</Heading>
        <p>Update user data form</p>
      </Row>

      <Row>
        <Heading as="h3">Update password</Heading>
        <p>Update user password form</p>
      </Row>
    </>
  );
}

export default Account;
