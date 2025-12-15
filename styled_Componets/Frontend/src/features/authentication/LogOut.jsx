import React, { useState } from "react";
import Button from "../../ui/Button";
import { logOutUser } from "../../services/apiUser";

import toast from "react-hot-toast";
// import { redirectUser } from "../../utils/helpers";

const LogOut = ({ userRefreshToken }) => {
    const [isClicked, setIsClicked] = useState(false);


    const handlelogout = async () => {

        setIsClicked(true);
        if (!userRefreshToken) return console.log("RefreshToken is NOT available");
        try {

            const response = await logOutUser(userRefreshToken);
            console.log(response);
            window.location.replace('/login');


            toast.success('Logged Out')
        } catch (error) {
            console.log(error);
            toast.error('Failed to Log Out')
        }
        finally {
            setIsClicked(false)
        }
    };

    return (
        <Button onClick={handlelogout} disabled={isClicked}>
            LogOut
        </Button>
    );
};

export default LogOut;
