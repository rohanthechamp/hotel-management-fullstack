// import styled from "styled-components";
// import useDashboard from "./useDashboard";
// import { CircularProgress } from "@mui/material";
// import Stats from "./Stats";
// import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
// // import DashboardBox from "./DashboardBox";
// import useDashboardTodayActivities from "../check-in-out/useDashboardTodayActivities";
// import Today from "../check-in-out/TodayActivity";
// import useStayDurations from "./useStayDurations";
// import { rules, stayDurationColorMap } from "../../utils/helpers";

// import { PieChart, Pie, Tooltip } from "recharts";
// const StyledDashboardLayout = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 1fr 1fr 1fr;
//   grid-template-rows: auto 34rem auto;
//   gap: 2.4rem;
// `;

// const DashboardLayout = () => {
//   const { results, isLoading, error } = useDashboard();
//   const { results1, isLoading1, error1 } = useDashboardTodayActivities();
//   const { staysData, isLoading2, error2 } = useStayDurations();
//   if (isLoading || isLoading1 || isLoading2)
//     return <CircularProgress color="secondary" />;
//   if (error || error1 || error2) return <ErrorOutlineIcon />;

//   // console.log('dashboard data StaysTodayActivity - ', staysData,typeof(staysData),staysData?.length)

//   const nights = staysData.map((d) => d.numNights);
//   // console.log('nights',nights)

//   const stayDurationsValue = [];

//   for (const { min, max, label } of rules) {
//     const found = nights.some((n) => n >= min && n <= max);
//     if (found) {
//       stayDurationsValue.push({
//         name: label,
//         value: max,
//         color: stayDurationColorMap[max]
//       });
//     }
//   }
//   console.log("stayDurationsValue", stayDurationsValue);

//   return (
//     <StyledDashboardLayout>
//       <Stats results={results} isLoading={isLoading} error={error} />

//       <Today results={results1} isLoading={isLoading1} error={error1} />
//       <div>
//         Chart stay durations
//         <PieChart width={700} height={700}>
//           <Tooltip />

//           <Pie
//             data={stayDurationsValue}
//             dataKey="count"
//             nameKey="name"
//             outerRadius={250}
//             innerRadius={150}
//             label={({ name, count }) => `${name}: ${count}`}
//           >
//             {stayDurationsValue.map((entry, index) => (
//               <Cell key={index} fill={entry.color} />
//             ))}
//           </Pie>
//         </PieChart>

//       </div>
//       <div>Chart sales</div>
//     </StyledDashboardLayout>
//   );
// };

// export default DashboardLayout;
// import styled from "styled-components";
// import useDashboard from "./useDashboard";
// import { CircularProgress } from "@mui/material";
// import Stats from "./Stats";
// import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
// import useDashboardTodayActivities from "../check-in-out/useDashboardTodayActivities";
// import Today from "../check-in-out/TodayActivity";
// import useStayDurations from "./useStayDurations";

// import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from "recharts";
// import SalesChart from "./SalesChart";
// import useSalesData from "./useSalesData";

// const StyledDashboardLayout = styled.div`
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   grid-template-rows: auto 34rem auto;
//   gap: 2.4rem;
// `;

// const stayDurationColorByLabel = {
//   "1 night": "#2ECC71",
//   "2 nights": "#27AE60",
//   "3 nights": "#1ABC9C",
//   "4–5 nights": "#F1C40F",
//   "6–7 nights": "#F39C12",
//   "8–14 nights": "#E67E22",
//   "15–21 nights": "#E74C3C",
//   "21+ nights": "#C0392B",
// };

// const DashboardLayout = () => {
//   const { results, isLoading, error } = useDashboard();
//   const { results1, isLoading1, error1 } = useDashboardTodayActivities();
//   const { staysData, isLoading2, error2 } = useStayDurations();
//   const { results: salesData, isLoading: isLoading3, error: error3 } = useSalesData();

//   if (isLoading || isLoading1 || isLoading2 || isLoading3) {
//     return <CircularProgress color="secondary" />;
//   }

//   if (error || error1 || error2 || error3) {
//     return <ErrorOutlineIcon />;
//   }

//   // Normalize stay duration data for recharts
//   const stayDurationsValue = (staysData || []).map((item) => ({
//     name: item.label,
//     value: item.count,          // recharts standard key
//     color: stayDurationColorByLabel[item.label] || "#34495E",
//   }));

//   return (
//     <StyledDashboardLayout>
//       <Stats results={results} />

//       <Today results={results1} />

//       <SalesChart data={salesData || []} />


//       <ResponsiveContainer width="100%" height={320}>
//         <PieChart>
//           <Tooltip />
//           <Legend verticalAlign="bottom" iconType="circle" />

//           <Pie
//             data={stayDurationsValue}
//             dataKey="value"
//             nameKey="name"
//             outerRadius={110}
//             innerRadius={70}
//             label={({ name, value }) => `${name}: ${value}`}
//           >
//             {stayDurationsValue.map((entry, index) => (
//               <Cell key={index} fill={entry.color} />
//             ))}
//           </Pie>
//         </PieChart>
//       </ResponsiveContainer>


//     </StyledDashboardLayout>
//   );
// };

// export default DashboardLayout;

import styled from "styled-components";
import useDashboard from "./useDashboard";
import { CircularProgress } from "@mui/material";
import Stats from "./Stats";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import useDashboardTodayActivities from "../check-in-out/useDashboardTodayActivities";
import TodayActivity from "../check-in-out/TodayActivity";
import useStayDurations from "./useStayDurations";


import SalesChart from "./SalesChart";
import useSalesData from "./useSalesData";
import DurationChart from "./DurationChart";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

/**
 * Color mapping based on business buckets
 * Backend sends labels, frontend assigns colors
 */


const DashboardLayout = () => {
  const { results, isLoading, error } = useDashboard();
  const { results1, isLoading1, error1 } = useDashboardTodayActivities();
  const { staysData, isLoading2, error2 } = useStayDurations();
  const { results3: saleChatData, isLoading: isLoading3, error: error3 } = useSalesData();
  if (isLoading || isLoading1 || isLoading2 || isLoading3)
    return <CircularProgress color="secondary" />;

  if (error || error1 || error2 || error3) return <ErrorOutlineIcon />;

  console.log("saleChatData",saleChatData)
  


  return (
    <StyledDashboardLayout>

      {/* DashBoard Metrics */}
      <Stats results={results} />

      {/* TodayActivities like checkin,checkout, */} 
      <TodayActivity results={results1} />

      {/* stay duration chart (numNights) */}
      <DurationChart data={staysData} />

      {/*  totalSales and extraSales */}
      <SalesChart data={saleChatData} />
    </StyledDashboardLayout>
  );
};

export default DashboardLayout;
