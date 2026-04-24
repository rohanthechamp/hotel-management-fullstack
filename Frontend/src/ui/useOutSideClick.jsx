import { useEffect, useRef } from "react";
const useOutSideClick = (handlerFn,listenCapturing=true) => {
    const modalWindowRef = useRef(null); // initialize ref

    // * Detecting Click Outside the Current Opened Modal Window
    useEffect(() => {
        // event listener Function
        const detectTchOutModalWindow = (event) => {
            const currWindow = modalWindowRef.current;
            if (!currWindow) return;

            if (currWindow && !currWindow.contains(event.target)) {
                // checking the window is clicked or not
                console.log("You Clicked Outside 😂 ");
                handlerFn(); // calling the function to reset
            }
        };

        document.addEventListener("mousedown", detectTchOutModalWindow, listenCapturing); // attaching the event listener

        return () => {
            document.removeEventListener("mousedown", detectTchOutModalWindow, listenCapturing); // removing the event listener
        };
    }, [handlerFn,listenCapturing]); // dependency

    return modalWindowRef;
};

export default useOutSideClick;
