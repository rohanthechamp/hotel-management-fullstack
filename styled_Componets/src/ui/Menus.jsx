import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";
import useOutSideClick from "./useOutSideClick";
import Modal from "./Modal";

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul`
  position: absolute;
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  left: ${(props) => props.position?.x || 0}px;
  top: ${(props) => props.position?.y || 0}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

 const MenusContext = createContext();

function Menus({ children }) {
  const [openId, setOpenId] = useState("");
  const [pos, setPos] = useState(null);
  

  const close = () => setOpenId("");
  const open = setOpenId;

  return (
    <MenusContext.Provider value={{ openId, close, open, pos, setPos}}>
      {children}
    </MenusContext.Provider>
  );
}

function Toggle({ cabinId }) {
  const { openId, close, open, setPos } = useContext(MenusContext);

  function handleClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({
      x: rect.left,
      y: rect.bottom + window.scrollY, // show below button
    });

    openId === "" || openId !== cabinId ? open(cabinId) : close();
  }

  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

function List({ cabinId, children }) {
  const { openId, pos, close } = useContext(MenusContext);
  const modalWindowRef = useOutSideClick(close);
  if (openId !== cabinId || !pos) return null;

  return createPortal(
    <StyledList position={pos} ref={modalWindowRef}>
      {children}
    </StyledList>,
    document.body
  );
}

function Button({ children, icon, handler, onClick }) {
  const { close } = useContext(MenusContext);

  function handleClick() {
    onClick();
    handler?.();
    close();
  }

  return (
    <li>
      <StyledButton onClick={handleClick}>
        {children} {icon}
      </StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
