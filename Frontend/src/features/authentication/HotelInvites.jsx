// import LoadingSkeleton from "../../ui/LoadingSkeleton";
// import { Alert } from "@mui/material";
// import { getError } from "../../utils/helpers";

// const HotelInvites = ({ HotelInvitesData, isLoading, error }) => {

//     const newError = getError(error, 'Error ')

//     if (isLoading) return <LoadingSkeleton />;

//     if (error)

//         return (
//             <Alert severity="error">
//                 Failed to load data: {newError}
//             </Alert>
//         );

//     if (!HotelInvitesData || HotelInvitesData.length === 0) {
//         return (
//             <div className="flex justify-center items-center h-40 text-gray-500">
//                 No invites found.
//             </div>
//         );
//     }

//     return (
//         <div className="p-6 space-y-6">
//             {/* Header */}
//             <div className="flex justify-between items-center">
//                 <h2 className="text-2xl font-semibold">Hotel Invites</h2>

//                 {/* Leave space for filters */}
//                 <div className="flex gap-3">
//                     <div className="w-32 h-9 bg-gray-100 rounded-md" />
//                     <div className="w-32 h-9 bg-gray-100 rounded-md" />
//                 </div>
//             </div>

//             {/* Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
//                 {HotelInvitesData.map((invite) => {
//                     const isExpired =
//                         new Date(invite.expires_at) < new Date();

//                     return (
//                         <div
//                             key={invite.id}
//                             className="bg-white shadow-sm border rounded-xl p-5 hover:shadow-md transition"
//                         >
//                             {/* Email */}
//                             <div className="text-lg font-medium text-gray-800 mb-2 break-all">
//                                 {invite.email}
//                             </div>

//                             {/* Status */}
//                             <div className="flex items-center gap-2 mb-3">
//                                 <span
//                                     className={`px-2 py-1 text-xs rounded-full font-medium ${invite.is_used
//                                         ? "bg-green-100 text-green-700"
//                                         : isExpired
//                                             ? "bg-red-100 text-red-700"
//                                             : "bg-yellow-100 text-yellow-700"
//                                         }`}
//                                 >
//                                     {invite.is_used
//                                         ? "Joined"
//                                         : isExpired
//                                             ? "Expired"
//                                             : "Pending"}
//                                 </span>
//                             </div>

//                             {/* Dates */}
//                             <div className="text-sm text-gray-500 space-y-1">
//                                 <p>
//                                     <span className="font-medium">
//                                         Created:
//                                     </span>{" "}
//                                     {new Date(
//                                         invite.created_at
//                                     ).toLocaleString()}
//                                 </p>
//                                 <p>
//                                     <span className="font-medium">
//                                         Expires:
//                                     </span>{" "}
//                                     {new Date(
//                                         invite.expires_at
//                                     ).toLocaleString()}
//                                 </p>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// };

// export default HotelInvites;
// import { useState } from "react";
// import LoadingSkeleton from "../../ui/LoadingSkeleton";
// import { Alert, MenuItem, Select, FormControl, InputLabel, TextField, InputAdornment } from "@mui/material";
// import { Search, Mail, Calendar, ShieldCheck, Clock, UserPlus, Filter } from "lucide-react";
// import { getError } from "../../utils/helpers";
// import { sendInvite } from "../../services/apiUser";
// import toast from "react-hot-toast";

// const HotelInvites = ({ HotelInvitesData, isLoading, error }) => {
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");

//   const newError = getError(error, 'Error ');

//   if (isLoading) return <div className="p-8"><LoadingSkeleton /></div>;

//   if (error) return <div className="p-8"><Alert severity="error" variant="filled">{newError}</Alert></div>;

//   const filteredData = HotelInvitesData?.filter((invite) => {
//     const isExpired = new Date(invite.expires_at) < new Date();
//     const matchesSearch = invite.email.toLowerCase().includes(searchQuery.toLowerCase());
//     if (filterStatus === "all") return matchesSearch;
//     if (filterStatus === "joined") return invite.is_used && matchesSearch;
//     if (filterStatus === "expired") return isExpired && !invite.is_used && matchesSearch;
//     if (filterStatus === "pending") return !invite.is_used && !isExpired && matchesSearch;
//     return matchesSearch;
//   });


//   const handleClick = async (email) => {
//     const resData = await sendInvite(email);
//     const msg = resData.message || '"Invite sent successfully"'
//     toast.success(msg);

//   }

//   return (
//     <div className="p-8 bg-[#f8fafc] min-h-screen">
//       {/* --- DASHBOARD HEADER --- */}
//       <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-500 rounded-3xl p-8 mb-8 shadow-lg shadow-blue-200">
//         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
//           <div className="text-white">
//             <h2 className="text-3xl font-extrabold tracking-tight">Staff Invitations</h2>
//             <p className="text-blue-100 mt-2 font-medium">Manage your team and monitor onboarding status</p>
//           </div>
//           <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
//             <div className="text-3xl font-bold text-white text-center">{filteredData?.length}</div>
//             <div className="text-xs text-blue-100 uppercase tracking-widest font-bold">Total Invites</div>
//           </div>
//         </div>
//         {/* Decorative circle */}
//         <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
//       </div>

//       {/* --- CONTROLS SECTION --- */}
//       <div className="flex flex-col lg:flex-row gap-4 mb-10 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
//         <div className="relative w-full lg:max-w-md">
//           <TextField
//             fullWidth
//             size="small"
//             placeholder="Search by staff email..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", backgroundColor: "#f1f5f9", border: "none" } }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Search size={18} className="text-indigo-500" />
//                 </InputAdornment>
//               ),
//             }}
//           />
//         </div>

//         <div className="flex items-center gap-3 w-full lg:w-auto">
//           <Filter size={18} className="text-slate-400 hidden sm:block" />
//           <FormControl size="small" className="w-full sm:w-48">
//             <Select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               sx={{ borderRadius: "12px", fontWeight: 600, color: "#475569" }}
//             >
//               <MenuItem value="all">All Status</MenuItem>
//               <MenuItem value="pending">⏳ Pending</MenuItem>
//               <MenuItem value="joined">✅ Joined</MenuItem>
//               <MenuItem value="expired">🚫 Expired</MenuItem>
//             </Select>
//           </FormControl>
//         </div>
//       </div>

//       {/* --- GRID --- */}
//       {filteredData?.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
//           {filteredData.map((invite) => {
//             const isExpired = new Date(invite.expires_at) < new Date();

//             let cfg = {
//               label: "Pending",
//               theme: "from-amber-400 to-orange-500",
//               bg: "bg-amber-50",
//               text: "text-amber-700",
//               icon: <Clock size={16} />
//             };

//             if (invite.is_used) {
//               cfg = { label: "Joined", theme: "from-emerald-400 to-teal-500", bg: "bg-emerald-50", text: "text-emerald-700", icon: <ShieldCheck size={16} /> };
//             } else if (isExpired) {
//               cfg = { label: "Expired", theme: "from-rose-400 to-red-500", bg: "bg-rose-50", text: "text-rose-700", icon: <Clock size={16} /> };
//             }

//             return (
//               <div key={invite.id} className="group bg-white rounded-[2rem] p-1 shadow-xl shadow-slate-200/60 hover:shadow-indigo-200/50 transition-all duration-500 hover:-translate-y-2">
//                 <div className="bg-white rounded-[1.8rem] p-6 h-full border border-slate-50">

//                   <div className="flex justify-between items-start mb-6">
//                     <div className={`p-3 rounded-2xl bg-gradient-to-br ${cfg.theme} text-white shadow-lg`}>
//                       <Mail size={24} />
//                     </div>
//                     <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter border-2 ${cfg.bg} ${cfg.text} border-current/10`}>
//                       {cfg.icon}
//                       {cfg.label}
//                     </div>
//                   </div>

//                   <h3 className="text-slate-800 font-bold text-lg mb-1 truncate leading-tight">{invite.email}</h3>
//                   <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Invited Member</span>

//                   <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
//                     <div className="space-y-1">
//                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date Sent</p>
//                       <p className="text-sm font-bold text-slate-700">{new Date(invite.created_at).toLocaleDateString()}</p>
//                     </div>
//                     <div className="space-y-1">
//                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expiry</p>
//                       <p className={`text-sm font-bold ${isExpired && !invite.is_used ? 'text-rose-500' : 'text-slate-700'}`}>
//                         {new Date(invite.expires_at).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>

//                   {!invite.is_used && (
//                     <button className="w-full mt-6 py-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2" onClick={() => handleClick(invite.email)}>
//                       <UserPlus size={16} />
//                       Resend Invite
//                     </button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       ) : (
//         <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
//           <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
//             <Search size={40} />
//           </div>
//           <h3 className="text-xl font-bold text-slate-800">No matching invites</h3>
//           <p className="text-slate-500 mt-1">Try adjusting your filters or search terms.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HotelInvites;
import { useState } from "react";
import styled from "styled-components";
import { Search, Mail, CalendarDays, Clock3, Users, Clock, ThumbsUp } from "lucide-react";

// --- THEME & STYLES ---
// Using a unified theme object for easier maintenance and perfect colors
const theme = {
  bg: "#1a1c22",
  card: "#262930",
  text: {
    primary: "#ffffff",
    secondary: "#8a94a6",
    muted: "#606d80",
  },
  control: {
    bg: "#2b2f38",
    border: "#3a404c",
  },
  accent: {
    purpleStart: "#6b21a8", // matches the purple header
    purpleEnd: "#ec4899",   // matches the pinkish header end
    green: "#10b981",
    amber: "#f59e0b",
    rose: "#e11d48",
  },
};

const HeaderGradient = `linear-gradient(90deg, ${theme.accent.purpleStart} 0%, ${theme.accent.purpleEnd} 100%)`;

const CardBorder = (color) => `solid ${color} 2px; border-radius: 12px;`;

const Container = styled.div`
  min-h-screen;
  background-color: ${theme.bg};
  color: ${theme.text.primary};
  padding: 3rem;
  font-family: 'Inter', sans-serif; // Make sure to load Inter if you don't have it
`;

// --- HEADER ---
const DashboardHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${HeaderGradient};
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  color: white;
`;

const HeaderTitleSection = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const TitleIconBox = styled.div`
  padding: 1rem;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.1);
`;

const StatsSection = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 1.2rem 2.5rem;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.1);
  min-width: 120px;
`;

const StatNumber = styled.div`
  font-size: 2.2rem;
  font-weight: 800;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  tracking: wide;
`;

// --- CONTROLS ---
const ControlsBar = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 2.5rem;
`;

const SearchInputWrapper = styled.div`
  flex-grow: 1;
  position: relative;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.text.muted};
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background-color: ${theme.control.bg};
  border: 1px solid ${theme.control.border};
  border-radius: 10px;
  color: ${theme.text.primary};
  font-size: 0.9rem;
  &::placeholder {
    color: ${theme.text.muted};
  }
`;

const SelectInput = styled.select`
  padding: 1rem 3rem 1rem 1rem;
  background-color: ${theme.control.bg};
  border: 1px solid ${theme.control.border};
  border-radius: 10px;
  color: ${theme.text.primary};
  font-size: 0.9rem;
  cursor: pointer;
  appearance: none; // hides the browser arrow
`;

// --- GRID ---
const InviteGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
`;

const InviteCard = styled.div`
  background-color: ${theme.card};
  border-radius: 12px;
  padding: 2rem;
  ${(props) => CardBorder(props.color)}
  display: flex;
  flex-direction: column;
`;

const CardTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const CardIconBox = styled.div`
  padding: 0.75rem;
  background-color: ${theme.control.bg};
  border-radius: 8px;
  color: ${theme.accent.purpleEnd}; // Using the pink from the gradient for the card icons
`;

const StatusPill = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: capitalize;
  border-radius: 100px;
  padding: 0.3rem 1rem;
  color: ${(props) => props.color};
  border: 1px solid ${(props) => props.color};
`;

const EmailTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${theme.text.primary};
  margin-bottom: 0.3rem;
`;

const MemberSubtitle = styled.p`
  font-size: 0.8rem;
  font-weight: 500;
  color: ${theme.text.muted};
  margin-bottom: 1.5rem;
`;

const DateSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const DateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: ${theme.text.secondary};
  font-size: 0.85rem;
  font-weight: 500;
`;

const CardButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  background-color: ${(props) => (props.primary ? props.primary : theme.control.bg)};
  color: ${(props) => (props.primary ? "#ffffff" : "#ffffff")};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  &:hover {
    filter: brightness(1.1);
  }
`;

// --- COMPONENT LOGIC ---
const getInviteStatus = (invite) => {
  const isExpired = new Date(invite.expires_at) < new Date();
  if (invite.is_used) {
    return {
      label: "Joined",
      color: theme.accent.green,
      icon: <ThumbsUp size={14} />,
    };
  } else if (isExpired) {
    return {
      label: "Expired",
      color: theme.accent.rose,
      icon: <Clock3 size={14} />,
    };
  } else {
    return {
      label: "Pending",
      color: theme.accent.amber,
      icon: <Clock size={14} />,
    };
  }
};

const HotelInvites = ({ HotelInvitesData, isLoading, error }) => {
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) return <Container><h1>Loading...</h1></Container>;
  if (error) return <Container><h1>Error loading data.</h1></Container>;

  // Filter based on search
  const filteredData = HotelInvitesData?.filter((invite) =>
    invite.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Quick stats calculation
  const total = filteredData?.length || 0;
  const pending = filteredData?.filter(i => getInviteStatus(i).label === 'Pending').length || 0;
  const joined = filteredData?.filter(i => getInviteStatus(i).label === 'Joined').length || 0;

  return (
    <Container>
      {/* HEADER SECTION */}
      <DashboardHeader>
        <HeaderTitleSection>
          <TitleIconBox>
            <Users size={30} strokeWidth={1.5} />
          </TitleIconBox>
          <div>
            <h1 className="text-3xl font-extrabold m-0">Staff Invitations</h1>
            <p className="m-0 mt-1 opacity-80 text-sm">
              Manage your team and monitor onboarding status
            </p>
          </div>
        </HeaderTitleSection>
        <StatsSection>
          <StatCard>
            <StatNumber>{total}</StatNumber>
            <StatLabel>Total</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{pending}</StatNumber>
            <StatLabel>Pending</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{joined}</StatNumber>
            <StatLabel>Joined</StatLabel>
          </StatCard>
        </StatsSection>
      </DashboardHeader>

      {/* CONTROLS BAR */}
      <ControlsBar>
        <SearchInputWrapper>
          <SearchIcon size={18} />
          <Input
            type="text"
            placeholder="Search by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchInputWrapper>
        <div style={{ position: "relative" }}>
          <SelectInput>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="joined">Joined</option>
            <option value="expired">Expired</option>
          </SelectInput>
        </div>
      </ControlsBar>

      {/* INVITATION GRID */}
      <InviteGrid>
        {filteredData?.map((invite) => {
          const status = getInviteStatus(invite);
          return (
            <InviteCard key={invite.id} color={status.color}>
              <CardTopRow>
                <CardIconBox>
                  <Mail size={18} strokeWidth={2} />
                </CardIconBox>
                <StatusPill color={status.color}>
                  {status.icon}
                  {status.label}
                </StatusPill>
              </CardTopRow>

              <EmailTitle>{invite.email}</EmailTitle>
              <MemberSubtitle>Invited Member</MemberSubtitle>

              <DateSection>
                <DateInfo>
                  <CalendarDays size={16} color={theme.text.muted} />
                  {new Date(invite.created_at).toLocaleDateString("en-US")}
                </DateInfo>
                <DateInfo>
                  <Clock3 size={16} color={theme.text.muted} />
                  {new Date(invite.expires_at).toLocaleDateString("en-US")}
                </DateInfo>
              </DateSection>

              {!invite.is_used && (
                <CardButton
                  // Using the pink from the gradient for the action buttons
                  primary={theme.accent.purpleEnd}
                >
                  <Mail size={16} color="white" />
                  Resend Invite
                </CardButton>
              )}
            </InviteCard>
          );
        })}
      </InviteGrid>
    </Container>
  );
};

export default HotelInvites;