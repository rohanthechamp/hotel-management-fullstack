import styled from "styled-components";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";

const ChartBox = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);


  padding: 3.4rem 4.4rem;
  grid-column: 3 / span 2;

  & > *:first-child {
    margin-bottom: 1.6rem;
  }

  & .recharts-pie-label-text {
    font-weight: 600;
  }
`;

const startDataLight = [
  {
    duration: "1 night",
    value: 0,
    color: "#ef4444",
  },
  {
    duration: "2 nights",
    value: 0,
    color: "#f97316",
  },
  {
    duration: "3 nights",
    value: 0,
    color: "#eab308",
  },
  {
    duration: "4-5 nights",
    value: 0,
    color: "#84cc16",
  },
  {
    duration: "6-7 nights",
    value: 0,
    color: "#22c55e",
  },
  {
    duration: "8-14 nights",
    value: 0,
    color: "#14b8a6",
  },
  {
    duration: "15-21 nights",
    value: 0,
    color: "#3b82f6",
  },
  {
    duration: "21+ nights",
    value: 0,
    color: "#a855f7",
  },
];

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

const stayDurationColorByLabel = {
  "1 night": "#2ECC71",
  "2 nights": "#27AE60",
  "3 nights": "#1ABC9C",
  "4–5 nights": "#F1C40F",
  "6–7 nights": "#F39C12",
  "8–14 nights": "#E67E22",
  "15–21 nights": "#E74C3C",
  "21+ nights": "#C0392B",
};

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



  const stayDurationsValue = data.map((item) => ({
    name: item.label,
    count: item.count,
    color: startDataDark[Math.floor(Math.random() * startDataDark.length)].color,
  }));
  return (
    <ChartBox>
      <PieChart width={320} height={300}>

        <Pie
          data={stayDurationsValue}
          dataKey="count"
          nameKey="name"
          outerRadius={110}
          innerRadius={70}
          label={({ name, count }) => `${name}: ${count}`}
        >
          {stayDurationsValue.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />

        <Legend
          verticalAlign="bottom"
          height={80}
          iconType="circle"
        />

      </PieChart>

    </ChartBox>

  )
}

export default DurationChart