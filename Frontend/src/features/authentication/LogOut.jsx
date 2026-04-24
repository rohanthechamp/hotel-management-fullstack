

// import useLogOut from "./useLogOut";
// import useAuth from "../../hooks/useAuth";
// import ButtonIcon from "../../ui/ButtonIcon";

// import { HiArrowRightOnRectangle } from "react-icons/hi2";
// import SpinnerMini from "../../ui/SpinnerMini";

// const LogOut = () => {

//     const { auth } = useAuth()
//     const { isLoading, doLogOut } = useLogOut()



//     return (
//         <ButtonIcon
//             variant="contained"
//             size="large"
//             color="warning"
//             onClick={() => doLogOut({ refreshToken: auth?.refreshToken })}
//             disabled={isLoading}
//         >
//             {isLoading ? <SpinnerMini/> : <HiArrowRightOnRectangle/>}
//         </ButtonIcon>
//     );
// };

// export default LogOut;
import styled, { keyframes } from "styled-components";
import { LogOut as LogoutIcon } from "lucide-react";

import useLogOut from "./useLogOut";
import useAuth from "../../hooks/useAuth";
import ButtonIcon from "../../ui/ButtonIcon";
import SpinnerMini from "../../ui/SpinnerMini";

// --- NEON GLOW ANIMATION ---
const pulseGlow = keyframes`
  0% { box-shadow: 0 0 5px rgba(225, 29, 72, 0.2); }
  50% { box-shadow: 0 0 15px rgba(225, 29, 72, 0.5); }
  100% { box-shadow: 0 0 5px rgba(225, 29, 72, 0.2); }
`;

const StyledLogoutButton = styled(ButtonIcon)`
  && {
    /* Base Obsidian Background */
    background-color: #262930; 
    border: 1px solid #3a404c;
    border-radius: 12px;
    padding: 10px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8a94a6; /* Default gray text */

    &:hover {
      /* High-vibrancy Red/Rose Gradient on hover */
      background: linear-gradient(135deg, #e11d48 0%, #be123c 100%);
      color: white;
      border-color: transparent;
      transform: translateY(-2px);
      animation: ${pulseGlow} 2s infinite ease-in-out;
    }

    &:active {
      transform: scale(0.95);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background-color: #1a1c22;
    }
  }
`;

const LogOut = () => {
  const { auth } = useAuth();
  const { isLoading, doLogOut } = useLogOut();

  return (
    <StyledLogoutButton
      onClick={() => doLogOut({ refreshToken: auth?.refreshToken })}
      disabled={isLoading}
      title="Logout"
    >
      {isLoading ? (
        <SpinnerMini />
      ) : (
        <LogoutIcon size={20} strokeWidth={2.5} />
      )}
    </StyledLogoutButton>
  );
};

export default LogOut;