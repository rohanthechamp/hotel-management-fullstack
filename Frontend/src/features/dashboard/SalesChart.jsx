// import styled from "styled-components";
// import DashboardBox from "./DashboardBox";
// import {
//   Area,
//   AreaChart,
//   CartesianGrid,
//   Tooltip,
//   XAxis,
//   YAxis,
//   ResponsiveContainer,
// } from "recharts";
// import { HiPaperAirplane } from "react-icons/hi2";

// const StyledSalesChart = styled(DashboardBox)`
//   grid-column: 1 / -1;

//   & .recharts-cartesian-grid-horizontal line,
//   & .recharts-cartesian-grid-vertical line {
//     stroke: var(--color-grey-300);
//   }
// `;

// const isDarkMode = true;

// const colors = isDarkMode
//   ? {
//     totalSales: "#4f46e5",
//     extrasSales: "#22c55e",
//     text: "#e5e7eb",
//     background: "#18212f",
//   }
//   : {
//     totalSales: "#4f46e5",
//     extrasSales: "#16a34a",
//     text: "#374151",
//     background: "#fff",
//   };

// function formatDate(date) {
//   return new Date(date).toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//   });
// }

// const SalesChart = ({ data = [], isAnimationActive = true }) => {
//   if (!data)
//     return (<>
//       <p>No Sale chart</p>
//       <HiPaperAirplane />
//     </>)
//   return (
//     <StyledSalesChart>
      
//       <ResponsiveContainer width="100%" height={350}>
//         <AreaChart data={data}>
//           <defs>
//             <linearGradient id="totalSales" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="5%" stopColor={colors.totalSales} stopOpacity={0.8} />
//               <stop offset="95%" stopColor={colors.totalSales} stopOpacity={0} />
//             </linearGradient>

//             <linearGradient id="extrasSales" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="5%" stopColor={colors.extrasSales} stopOpacity={0.8} />
//               <stop offset="95%" stopColor={colors.extrasSales} stopOpacity={0} />
//             </linearGradient>
//           </defs>

//           <CartesianGrid strokeDasharray="3 3" />

//           <XAxis
//             dataKey="date"
//             tickFormatter={formatDate}
//             stroke={colors.text}
//           />

//           <YAxis stroke={colors.text} />

//           <Tooltip
//             formatter={(value) => `₹${value}`}
//             labelFormatter={(label) =>
//               new Date(label).toLocaleDateString("en-US", {
//                 month: "short",
//                 day: "numeric",
//                 year: "numeric",
//               })
//             }
//           />

//           <Area
//             type="monotone"
//             dataKey="totalSales"
//             stroke={colors.totalSales}
//             fillOpacity={1}
//             fill="url(#totalSales)"
//             name="Room Revenue"
//             isAnimationActive={isAnimationActive}
//           />

//           <Area
//             type="monotone"
//             dataKey="extrasSales"
//             stroke={colors.extrasSales}
//             fillOpacity={1}
//             fill="url(#extrasSales)"
//             name="Extras Revenue"
//             isAnimationActive={isAnimationActive}
//           />
//         </AreaChart>
//       </ResponsiveContainer>
//     </StyledSalesChart>
//   );
// };

// export default SalesChart;
import styled from "styled-components";
import DashboardBox from "./DashboardBox";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { HiPaperAirplane } from "react-icons/hi2";

// const StyledSalesChart = styled(DashboardBox)`
//   grid-column: 1 / -1;

//   & .recharts-cartesian-grid-horizontal line,
//   & .recharts-cartesian-grid-vertical line {
//     stroke: var(--color-grey-300);
//   }
// `;
const StyledSalesChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;
// Replace later with real theme hook
const isDarkMode = true;

const colors = isDarkMode
  ? {
    totalSales: "#4f46e5",
    extrasSales: "#22c55e",
    text: "#e5e7eb",
    background: "#18212f",
  }
  : {
    totalSales: "#4f46e5",
    extrasSales: "#16a34a",
    text: "#374151",
    background: "#fff",
  };

const SalesChart = ({ data = [], isAnimationActive = true }) => {
  // Guard: no data
  if (!data || data.length === 0) {
    return (
      <StyledSalesChart>
        <p>No sales yet</p>
        <HiPaperAirplane />
      </StyledSalesChart>
    );
  }

  // 🔥 Convert dates to real JS Date objects (critical for Recharts)
  const chartData = data.map((d) => ({
    date: new Date(d.date),
    totalSales: Number(d.totalSales),
    extrasSales: Number(d.extrasSales),
  }));

  return (
    <StyledSalesChart>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="totalSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.totalSales} stopOpacity={0.8} />
              <stop offset="95%" stopColor={colors.totalSales} stopOpacity={0} />
            </linearGradient>

            <linearGradient id="extrasSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.extrasSales} stopOpacity={0.8} />
              <stop offset="95%" stopColor={colors.extrasSales} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="date"
            tickFormatter={(date) =>
              date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
            stroke={colors.text}
          />

          <YAxis stroke={colors.text} />

          <Tooltip
            formatter={(value) => `₹${value.toFixed(2)}`}
            labelFormatter={(date) =>
              date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            }
          />

          <Area
            type="monotone"
            dataKey="totalSales"
            stroke={colors.totalSales}
            fillOpacity={1}
            fill="url(#totalSales)"
            name="Room Revenue"
            isAnimationActive={isAnimationActive}
          />

          <Area
            type="monotone"
            dataKey="extrasSales"
            stroke={colors.extrasSales}
            fillOpacity={1}
            fill="url(#extrasSales)"
            name="Extras Revenue"
            isAnimationActive={isAnimationActive}
          />
        </AreaChart>
      </ResponsiveContainer>
    </StyledSalesChart>
  );
};

export default SalesChart;
