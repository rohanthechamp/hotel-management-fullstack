// import React from 'react'
import styled from "styled-components";
import LogOut from "../features/authentication/LogOut";
import { useNavigate } from "react-router-dom";

import ButtonIcon from "./ButtonIcon";
import { HiOutlineUser } from "react-icons/hi2";
// import HiOutlineUser from "react-icons/hi2"
const StyleHeaderMenu = styled.ul`
  display: float;
  gap: 0.4rem;
`;
const HeaderMenu = () => {
    const navigate = useNavigate();
    return (
        <StyleHeaderMenu>
            <li>
                <ButtonIcon onClick={() => navigate("/account")}>
                    <HiOutlineUser />
                </ButtonIcon>
            </li>
            <li>
                <LogOut />
            </li>
        </StyleHeaderMenu>
    );
};

export default HeaderMenu;
