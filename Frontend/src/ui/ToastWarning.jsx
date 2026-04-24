import toast from "react-hot-toast";

export const showWarning = (message) => {
    toast(message, {
        icon: "⚠️",
        duration: 3500,
        style: {
            background: "#FFFBEB",   // light amber
            color: "#92400E",        // dark amber text
            border: "1px solid #FCD34D",
            padding: "12px 16px",
            borderRadius: "8px",
            fontWeight: "500",
        },
    });
};
