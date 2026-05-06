import styled from "styled-components";
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
const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

const DashboardLayout = () => {
  // Logic - PRESERVED
  const { results, isLoading, error } = useDashboard();
  const { results1, isLoading1, error1 } = useDashboardTodayActivities();
  const { staysData, isLoading2, error2 } = useStayDurations();
  const {
    results3: saleChatData,
    isLoading: isLoading3,
    error: error3,
  } = useSalesData();

  // Loading State
  if (isLoading || isLoading1 || isLoading2 || isLoading3) {
    return (
      <StyledDashboardLayout>
        {/* <LoadingOverlay> */}
          <Loader2 size={64} className="animate-spin" />
          <p className="text-[#8a94a6] font-bold uppercase tracking-widest text-sm">
            Synchronizing Dashboard Data...
          </p>
        {/* </LoadingOverlay> */}
      </StyledDashboardLayout>
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
    <StyledDashboardLayout>
      <Stats results={results} />
      <TodayActivity results={results1} />
      <DurationChart data={staysData} />
      <SalesChart data={saleChatData} />
    </StyledDashboardLayout>
  );
};

export default DashboardLayout;
