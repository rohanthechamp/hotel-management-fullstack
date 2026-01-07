
import CircularProgress from "@mui/material/CircularProgress";
import { formatCurrency } from "../../utils/helpers";
import Stat from "./Stat";
import { HiOutlineBanknotes, HiOutlineBriefcase, HiOutlineCalendarDays, HiOutlineChartBar } from "react-icons/hi2";


function Stats({ results, isLoading, error }) {


  if (isLoading) return <CircularProgress color="secondary" />
  if (error) return <AccessAlarmIcon />
  console.log('Dashboard data',results)
  const {
    totalBookings,
    totalSales,
    totalCheckIns,
    occupancyRate
  } = results;
  return (
    <>
      <Stat
        title="Bookings"
        color="blue"
        icon={<HiOutlineBriefcase />}
        value={totalBookings || 0}
      />
      <Stat
        title="Sales"
        color="green"
        icon={<HiOutlineBanknotes />}
        value={formatCurrency(totalSales || 0)}
      />
      <Stat
        title="Check ins"
        color="indigo"
        icon={<HiOutlineCalendarDays />}
        value={totalCheckIns || 0}
      />
      <Stat
        title="Occupancy rate"
        color="yellow"
        icon={<HiOutlineChartBar />}
        value={`${occupancyRate} %`}
      />
    </>
  );
}

export default Stats;
