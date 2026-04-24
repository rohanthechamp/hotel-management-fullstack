import React from "react";

import { CircularProgress, LinearProgress } from "@mui/material";

function LoadingSkeleton() {
  return (
    <LinearProgress sx={{ color: "#26bc0f", zIndex: 1300 }}>
      <CircularProgress color="inherit" />
    </LinearProgress>
  );
}

export default LoadingSkeleton;
