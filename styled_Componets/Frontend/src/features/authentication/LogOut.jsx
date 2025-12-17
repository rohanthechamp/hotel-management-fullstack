

import useLogOut from "./useLogOut";
import useAuth from "../../hooks/useAuth";
import ButtonIcon from "../../ui/ButtonIcon";

import { HiArrowRightOnRectangle } from "react-icons/hi2";
import SpinnerMini from "../../ui/SpinnerMini";

const LogOut = () => {

    const { auth } = useAuth()
    const { isLoading, doLogOut } = useLogOut()



    return (
        <ButtonIcon
            variant="contained"
            size="large"
            color="warning"
            onClick={() => doLogOut({ refreshToken: auth?.refreshToken })}
            disabled={isLoading}
        >
            {isLoading ? <SpinnerMini/> : <HiArrowRightOnRectangle/>}
        </ButtonIcon>
    );
};

export default LogOut;
