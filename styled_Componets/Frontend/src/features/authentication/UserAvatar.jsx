import styled from "styled-components";
import { useCurrentUser } from "./useCurrentUser";
import { Backdrop, CircularProgress } from "@mui/material";
const StyledUserAvatar = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  font-weight: 500;
  font-size: 1.4rem;
  color: var(--color-grey-600);
`;

const Avatar = styled.img`
  display: block;
  width: 4rem;
  width: 3.6rem;
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  outline: 2px solid var(--color-grey-100);
`;

// import React from 'react'/

const UserAvatar = () => {
  const { isLoading, UserData, error } = useCurrentUser();

  if (error)
    return <Alert severity="error">Failed to load data. Please refresh.</Alert>;

  if (isLoading)
    return (
      <Backdrop open={true} sx={{ color: "#bcb60f", zIndex: 1300 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );

  return (
    <StyledUserAvatar>
      {UserData?.name}
      {UserData?.email}
    </StyledUserAvatar>
  );
};

export default UserAvatar;
