import styled from "styled-components";
import { PieChart, Pie,ResponsiveContainer, Tooltip, Cell, Legend } from "recharts";
import Heading from "../../ui/Heading";

const ChartBox = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 2.4rem 3.2rem;
  grid-column: 3 / span 2;

  & > *:first-child {
    margin-bottom: 1.6rem;
  }

  & .recharts-pie-label-text {
    font-weight: 600;
  }
`;


const startDataDark = [
  {
    duration: "1 night",
    value: 0,
    color: "#b91c1c",
  },
  {
    duration: "2 nights",
    value: 0,
    color: "#c2410c",
  },
  {
    duration: "3 nights",
    value: 0,
    color: "#a16207",
  },
  {
    duration: "4-5 nights",
    value: 0,
    color: "#4d7c0f",
  },
  {
    duration: "6-7 nights",
    value: 0,
    color: "#15803d",
  },
  {
    duration: "8-14 nights",
    value: 0,
    color: "#0f766e",
  },
  {
    duration: "15-21 nights",
    value: 0,
    color: "#1d4ed8",
  },
  {
    duration: "21+ nights",
    value: 0,
    color: "#7e22ce",
  },
];


const DurationChart = ({ data }) => {
  /**
 * Backend returns:
 * [
 *   { label: "1 night", count: 130 },
 *   { label: "4–5 nights", count: 303 },
 *   ...
 * ]
 *
 * Frontend just maps it to chart format
 */


  // 🔥 Convert backend data  to predictable data what we want (critical for Recharts)
  const stayDurationsValue = data.map((item) => ({
    name: item.label,
    count: item.count,
    color: startDataDark[Math.floor(Math.random() * startDataDark.length)].color,
  }));
 return (
    <ChartBox>
      <Heading as="h2">Stay duration summary</Heading>
      
      {/* Used ResponsiveContainer from Component 1 */}
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={stayDurationsValue}
            nameKey="name"
            dataKey="count"
            innerRadius={85}   // Matched Component 1
            outerRadius={110}  // Matched Component 1
            cx="40%"           // Matched Component 1
            cy="50%"
            paddingAngle={3}   // Matched Component 1
          >
            {stayDurationsValue.map((entry) => (
              <Cell 
                key={entry.name} 
                fill={entry.color} 
                stroke={entry.color} 
              />
            ))}
          </Pie>
          
          <Tooltip />
          
          <Legend
            verticalAlign="middle"
            align="right"
            width="30%"
            layout="vertical"
            iconSize={15}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartBox>
  );
};

export default DurationChart;