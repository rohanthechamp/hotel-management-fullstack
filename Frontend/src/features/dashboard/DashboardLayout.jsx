import styled from "styled-components";
import { AlertCircle, Loader2, LayoutDashboard } from "lucide-react";

import useDashboard from "./useDashboard";
import useDashboardTodayActivities from "../check-in-out/useDashboardTodayActivities";
import useStayDurations from "./useStayDurations";
import useSalesData from "./useSalesData";

import Stats from "./Stats";
import TodayActivity from "../check-in-out/TodayActivity";
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";
import { getError } from "../../utils/helpers";

const DashboardContainer = styled.div`
  min-height: 100vh;
  padding: 1.25rem;
  background:
    radial-gradient(circle at top left, rgba(124, 58, 237, 0.16), transparent 30%),
    radial-gradient(circle at top right, rgba(59, 130, 246, 0.12), transparent 28%),
    linear-gradient(180deg, #0a0c10 0%, #0f1116 100%);
  color: #e5e7eb;
  overflow: hidden;
`;

const DashboardShell = styled.div`
  max-width: 1520px;
  height: calc(100vh - 2.5rem);
  margin: 0 auto;
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: 1rem;

  @media (max-width: 1200px) {
    height: auto;
    min-height: calc(100vh - 2.5rem);
  }
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.25rem 0.25rem 0.5rem;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const PageTitle = styled.h1`
  color: #ffffff;
  font-size: 1.9rem;
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.05em;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Subtitle = styled.p`
  color: #8a93a7;
  font-size: 0.88rem;
  line-height: 1.4;
`;

const UpdateText = styled.span`
  color: #7c8597;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
`;

const Card = styled.div`
  background: rgba(17, 20, 28, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 22px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.34);
  backdrop-filter: blur(10px);
  overflow: hidden;
  min-height: 0;
`;

const StatsCard = styled(Card)`
  padding: 0.95rem;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 2.1fr 1fr;
  gap: 1rem;
  min-height: 0;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const ActivityCard = styled(Card)`
  padding: 1rem;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

const ChartCard = styled(Card)`
  padding: 1rem;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

const SalesCard = styled(Card)`
  padding: 1rem;
  min-height: 250px;
  display: flex;
  flex-direction: column;
`;

const CardHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.9rem;
`;

const CardTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: #f3f4f6;
  letter-spacing: -0.02em;
`;

const LoadingOverlay = styled.div`
  min-height: 70vh;
  display: grid;
  place-items: center;
  gap: 1rem;
  color: #8a94a6;
`;

const ErrorBox = styled(Card)`
  padding: 2rem;
  color: #fda4af;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
`;

const ContentRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  min-height: 0;
`;

const TopRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  min-height: 0;
`;

const BottomRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  min-height: 0;
`;

const DashboardLayout = () => {
  const { results, isLoading, error } = useDashboard();
  const { results1, isLoading1, error1 } = useDashboardTodayActivities();
  const { staysData, isLoading2, error2 } = useStayDurations();
  const { results3: saleChatData, isLoading: isLoading3, error: error3 } = useSalesData();

  if (isLoading || isLoading1 || isLoading2 || isLoading3) {
    return (
      <DashboardContainer>
        <LoadingOverlay>
          <Loader2 size={56} className="animate-spin" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a94a6]">
            Synchronizing dashboard data...
          </p>
        </LoadingOverlay>
      </DashboardContainer>
    );
  }

  const errorMsg = getError(error);
  const errorMsg1 = getError(error1);
  const errorMsg2 = getError(error2);
  const errorMsg3 = getError(error3);

  if (error || error1 || error2 || error3) {
    return (
      <DashboardContainer>
        <DashboardShell>
          <ErrorBox>
            <AlertCircle size={44} />
            <h3 className="text-xl font-bold text-white">Data synchronization failed</h3>
            <div className="text-sm space-y-1 opacity-85">
              {errorMsg && <p>{errorMsg}</p>}
              {errorMsg1 && <p>{errorMsg1}</p>}
              {errorMsg2 && <p>{errorMsg2}</p>}
              {errorMsg3 && <p>{errorMsg3}</p>}
            </div>
          </ErrorBox>
        </DashboardShell>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardShell>
        <HeaderSection>
          <TitleBlock>
            <PageTitle>
              <LayoutDashboard size={30} className="text-[#a78bfa]" />
              Hotel Overview
            </PageTitle>
            <Subtitle>
              Operational visibility for bookings, revenue, and guest activity
            </Subtitle>
          </TitleBlock>

          <UpdateText>Last updated: just now</UpdateText>
        </HeaderSection>

        <TopRow>
          <StatsCard>
            <Stats results={results} />
          </StatsCard>
        </TopRow>

        <MainGrid>
          <ActivityCard>
            <CardHeading>
              <CardTitle>Today Activity</CardTitle>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7c8597]">
                live feed
              </span>
            </CardHeading>

            <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
              <TodayActivity results={results1} />
            </div>
          </ActivityCard>

          <ChartCard>
            <CardHeading>
              <CardTitle>Stay Duration</CardTitle>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7c8597]">
                distribution
              </span>
            </CardHeading>

            <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
              <DurationChart data={staysData} />
            </div>
          </ChartCard>
        </MainGrid>

        <BottomRow>
          <SalesCard>
            <CardHeading>
              <CardTitle>Revenue Trend</CardTitle>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7c8597]">
                daily sales
              </span>
            </CardHeading>

            <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
              <SalesChart data={saleChatData} />
            </div>
          </SalesCard>
        </BottomRow>
      </DashboardShell>
    </DashboardContainer>
  );
};

export default DashboardLayout;