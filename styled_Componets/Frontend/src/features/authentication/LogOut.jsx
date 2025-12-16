
import Button from "@mui/material/Button";
import useLogOut from "./useLogOut";
import useAuth from "../../hooks/useAuth";

const LogOut = () => {

    const { auth } = useAuth()
    const { isLoading, doLogOut } = useLogOut()

    function handleSubmit() {
        const rf = auth?.refreshToken
        console.log('rf', rf)
        if (!rf) return console.log("RefreshToken is NOT available");

        doLogOut({ refreshToken: rf });

    }


    return (
        <Button
            variant="contained"
            size="large"
            color="warning"
            onClick={handleSubmit}
            disabled={isLoading}
        >
            {isLoading ? <p>...</p> : <p>LogOut</p>}
        </Button>
    );
};

export default LogOut;
