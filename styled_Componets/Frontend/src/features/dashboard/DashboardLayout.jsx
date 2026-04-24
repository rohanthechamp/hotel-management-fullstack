// // import styled from "styled-components";
// // import useDashboard from "./useDashboard";
// // import { CircularProgress } from "@mui/material";
// // import Stats from "./Stats";
// // import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
// // // import DashboardBox from "./DashboardBox";
// // import useDashboardTodayActivities from "../check-in-out/useDashboardTodayActivities";
// // import Today from "../check-in-out/TodayActivity";
// // import useStayDurations from "./useStayDurations";
// // import { rules, stayDurationColorMap } from "../../utils/helpers";

// // import { PieChart, Pie, Tooltip } from "recharts";
// // const StyledDashboardLayout = styled.div`
// //   display: grid;
// //   grid-template-columns: 1fr 1fr 1fr 1fr;
// //   grid-template-rows: auto 34rem auto;
// //   gap: 2.4rem;
// // `;

// // const DashboardLayout = () => {
// //   const { results, isLoading, error } = useDashboard();
// //   const { results1, isLoading1, error1 } = useDashboardTodayActivities();
// //   const { staysData, isLoading2, error2 } = useStayDurations();
// //   if (isLoading || isLoading1 || isLoading2)
// //     return <CircularProgress color="secondary" />;
// //   if (error || error1 || error2) return <ErrorOutlineIcon />;

// //   // console.log('dashboard data StaysTodayActivity - ', staysData,typeof(staysData),staysData?.length)

// //   const nights = staysData.map((d) => d.numNights);
// //   // console.log('nights',nights)

// //   const stayDurationsValue = [];

// //   for (const { min, max, label } of rules) {
// //     const found = nights.some((n) => n >= min && n <= max);
// //     if (found) {
// //       stayDurationsValue.push({
// //         name: label,
// //         value: max,
// //         color: stayDurationColorMap[max]
// //       });
// //     }
// //   }
// //   console.log("stayDurationsValue", stayDurationsValue);

// //   return (
// //     <StyledDashboardLayout>
// //       <Stats results={results} isLoading={isLoading} error={error} />

// //       <Today results={results1} isLoading={isLoading1} error={error1} />
// //       <div>
// //         Chart stay durations
// //         <PieChart width={700} height={700}>
// //           <Tooltip />

// //           <Pie
// //             data={stayDurationsValue}
// //             dataKey="count"
// //             nameKey="name"
// //             outerRadius={250}
// //             innerRadius={150}
// //             label={({ name, count }) => `${name}: ${count}`}
// //           >
// //             {stayDurationsValue.map((entry, index) => (
// //               <Cell key={index} fill={entry.color} />
// //             ))}
// //           </Pie>
// //         </PieChart>

// //       </div>
// //       <div>Chart sales</div>
// //     </StyledDashboardLayout>
// //   );
// // };

// // export default DashboardLayout;
// // import styled from "styled-components";
// // import useDashboard from "./useDashboard";
// // import { CircularProgress } from "@mui/material";
// // import Stats from "./Stats";
// // import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
// // import useDashboardTodayActivities from "../check-in-out/useDashboardTodayActivities";
// // import Today from "../check-in-out/TodayActivity";
// // import useStayDurations from "./useStayDurations";

// // import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from "recharts";
// // import SalesChart from "./SalesChart";
// // import useSalesData from "./useSalesData";

// // const StyledDashboardLayout = styled.div`
// //   display: grid;
// //   grid-template-columns: repeat(4, 1fr);
// //   grid-template-rows: auto 34rem auto;
// //   gap: 2.4rem;
// // `;

// // const stayDurationColorByLabel = {
// //   "1 night": "#2ECC71",
// //   "2 nights": "#27AE60",
// //   "3 nights": "#1ABC9C",
// //   "4–5 nights": "#F1C40F",
// //   "6–7 nights": "#F39C12",
// //   "8–14 nights": "#E67E22",
// //   "15–21 nights": "#E74C3C",
// //   "21+ nights": "#C0392B",
// // };

// // const DashboardLayout = () => {
// //   const { results, isLoading, error } = useDashboard();
// //   const { results1, isLoading1, error1 } = useDashboardTodayActivities();
// //   const { staysData, isLoading2, error2 } = useStayDurations();
// //   const { results: salesData, isLoading: isLoading3, error: error3 } = useSalesData();

// //   if (isLoading || isLoading1 || isLoading2 || isLoading3) {
// //     return <CircularProgress color="secondary" />;
// //   }

// //   if (error || error1 || error2 || error3) {
// //     return <ErrorOutlineIcon />;
// //   }

// //   // Normalize stay duration data for recharts
// //   const stayDurationsValue = (staysData || []).map((item) => ({
// //     name: item.label,
// //     value: item.count,          // recharts standard key
// //     color: stayDurationColorByLabel[item.label] || "#34495E",
// //   }));

// //   return (
// //     <StyledDashboardLayout>
// //       <Stats results={results} />

// //       <Today results={results1} />

// //       <SalesChart data={salesData || []} />


// //       <ResponsiveContainer width="100%" height={320}>
// //         <PieChart>
// //           <Tooltip />
// //           <Legend verticalAlign="bottom" iconType="circle" />

// //           <Pie
// //             data={stayDurationsValue}
// //             dataKey="value"
// //             nameKey="name"
// //             outerRadius={110}
// //             innerRadius={70}
// //             label={({ name, value }) => `${name}: ${value}`}
// //           >
// //             {stayDurationsValue.map((entry, index) => (
// //               <Cell key={index} fill={entry.color} />
// //             ))}
// //           </Pie>
// //         </PieChart>
// //       </ResponsiveContainer>


// //     </StyledDashboardLayout>
// //   );
// // };

// // export default DashboardLayout;

// import styled from "styled-components";
// import useDashboard from "./useDashboard";
// import { CircularProgress } from "@mui/material";
// import Stats from "./Stats";
// import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
// import useDashboardTodayActivities from "../check-in-out/useDashboardTodayActivities";
// import TodayActivity from "../check-in-out/TodayActivity";
// import useStayDurations from "./useStayDurations";


// import SalesChart from "./SalesChart";
// import useSalesData from "./useSalesData";
// import DurationChart from "./DurationChart";
// import { getError } from "../../utils/helpers";
// import { red } from "@mui/material/colors";


// const StyledDashboardLayout = styled.div`
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   grid-template-rows: auto 34rem auto;
//   gap: 2.4rem;
// `;

// /**
//  * Color mapping based on business buckets
//  * Backend sends labels, frontend assigns colors
//  */


// const DashboardLayout = () => {
//   const { results, isLoading, error } = useDashboard();
//   const { results1, isLoading1, error1 } = useDashboardTodayActivities();
//   const { staysData, isLoading2, error2 } = useStayDurations();
//   const { results3: saleChatData, isLoading: isLoading3, error: error3 } = useSalesData();
//   if (isLoading || isLoading1 || isLoading2 || isLoading3)
//     return <CircularProgress color="secondary" />;

//   const errorMsg=getError(error)
//   const errorMsg1=getError(error1)
//   const errorMsg2=getError(error2)

//   if (error || error1 || error2 || error3) return (
//     <>
//     <p >  {errorMsg}  </p>
//        <p >  {errorMsg1}  </p>
//           <p >  {errorMsg2}  </p>
//     <ErrorOutlineIcon />;
//     </>
//   )

//   console.log("saleChatData",saleChatData)
  


//   return (
//     <StyledDashboardLayout>

//       {/* DashBoard Metrics */}
//       <Stats results={results} />

//       {/* TodayActivities like checkin,checkout, */} 
//       <TodayActivity results={results1} />

//       {/* stay duration chart (numNights) */}
//       <DurationChart data={staysData} />

//       {/*  totalSales and extraSales */}
//       <SalesChart data={saleChatData} />
//     </StyledDashboardLayout>
//   );
// };

// export default DashboardLayout;

import styled from "styled-components";
import { CircularProgress } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { LayoutDashboard, AlertCircle, Loader2 } from "lucide-react";

import useDashboard from "./useDashboard";
import useDashboardTodayActivities from "../check-in-out/useDashboardTodayActivities";
import useStayDurations from "./useStayDurations";
import useSalesData from "./useSalesData";

import Stats from "./Stats";
import TodayActivity from "../check-in-out/TodayActivity";
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";
import { getError } from "../../utils/helpers";

// --- THEME-BASED LAYOUT ---
const DashboardContainer = styled.div`
  padding: 1.6rem;
  background-color: #0f1115; /* Deepest layer */
  min-height: 100vh;
`;

const StyledDashboardLayout = styled.div`
  display: grid;
  /* Rule: 4 columns for stats, but charts usually take more space */
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto auto; 
  gap: 2.4rem;
  max-width: 1600px;
  margin: 0 auto;

  /* Media query for smaller screens */
  @media (max-width: 1200px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const HeaderSection = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const PageTitle = styled.h1`
  color: white;
  font-size: 2.4rem;
  font-weight: 900;
  letter-spacing: -1px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LoadingOverlay = styled.div`
  height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  color: #ec4899;
`;

const ErrorBox = styled.div`
  grid-column: 1 / -1;
  background: rgba(225, 29, 72, 0.1);
  border: 1px solid #e11d48;
  padding: 2rem;
  border-radius: 20px;
  color: #fda4af;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

const DashboardLayout = () => {
  // Logic - DO NOT TOUCH
  const { results, isLoading, error } = useDashboard();
  const { results1, isLoading1, error1 } = useDashboardTodayActivities();
  const { staysData, isLoading2, error2 } = useStayDurations();
  const { results3: saleChatData, isLoading: isLoading3, error: error3 } = useSalesData();

  // Loading State
  if (isLoading || isLoading1 || isLoading2 || isLoading3) {
    return (
      <DashboardContainer>
        <LoadingOverlay>
          <Loader2 size={64} className="animate-spin" />
          <p className="text-[#8a94a6] font-bold uppercase tracking-widest text-sm">
            Synchronizing Dashboard Data...
          </p>
        </LoadingOverlay>
      </DashboardContainer>
    );
  }

  // Error State
  const errorMsg = getError(error);
  const errorMsg1 = getError(error1);
  const errorMsg2 = getError(error2);

  if (error || error1 || error2 || error3) {
    return (
      <DashboardContainer>
        <ErrorBox>
          <AlertCircle size={48} />
          <h3 className="text-xl font-bold">Data Synchronization Failed</h3>
          <div className="text-center opacity-80 text-sm">
            <p>{errorMsg}</p>
            <p>{errorMsg1}</p>
            <p>{errorMsg2}</p>
          </div>
        </ErrorBox>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <HeaderSection>
        <PageTitle>
          <LayoutDashboard size={32} className="text-[#ec4899]" />
          Hotel Overview
        </PageTitle>
        <div className="flex gap-4">
            {/* You could put your Filter/Date selector here later */}
            <span className="text-[#606d80] text-xs font-bold uppercase tracking-tighter">
                Last updated: Just now
            </span>
        </div>
      </HeaderSection>

      <StyledDashboardLayout>
        {/* Row 1: Metrics (Usually spans 1 column each) */}
        {/* Passing results to Stats - logic preserved */}
        <Stats results={results} />

        {/* Row 2: Charts & Activities */}
        {/* TodayActivity usually takes 2 columns for visibility */}
        <TodayActivity results={results1} />

        {/* DurationChart (Pie/Donut) */}
        <DurationChart data={staysData} />

        {/* Row 3: Big Sales Chart (Usually spans full width or large area) */}
        {/* Spanning full width (4 columns) makes sales trends easy to read */}
        <div style={{ gridColumn: "1 / -1" }}>
          <SalesChart data={saleChatData} />
        </div>
      </StyledDashboardLayout>
    </DashboardContainer>
  );
};

export default DashboardLayout;