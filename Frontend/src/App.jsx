

import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import Cabins from "./pages/Cabins";
import Bookings from "./pages/Bookings";
import Account from "./pages/Account";
import GlobalStyles from "./styles/GlobalStyles";
import AppLayout from "./ui/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import BookingDetail from "./features/bookings/BookingDetail";
import CheckInOut from "./pages/CheckInOut";
import SignUp from "./pages/SignUp";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import ProtectedRoute from "./pages/ProtectedRoute";
import { DarkModeProvider } from "./context/DarkModeContext";
import StaffInvite from "./pages/StaffInvite";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 100,
    },
  },
});

const App = () => {
  useAxiosPrivate(); // 👈 CALL THIS HOOK HERE! Interceptors now activate globally

  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <GlobalStyles />

        <BrowserRouter>
          <Routes>
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {/* public inside layout */}
              <Route path="/" element={<Account />} />

              {/* private routes */}


              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/cabins" element={<Cabins />} />
              <Route path="/bookings" element={<Bookings />} />

              <Route path="/check-in-out" element={<CheckInOut />} />
              <Route path="/bookings/:bookingId" element={<BookingDetail />} />
              <Route path="/check-in-out/:bookingId" element={<CheckInOut />} />
              <Route path="/account" element={<Account />} />
              {/* private routes */}
            </Route>

            {/* public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/staff_invitation/invitation_link/join" element={<StaffInvite />} />

            {/* 404 */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>

        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: { duration: 3000 },
            error: { duration: 5000 },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backgroundColor: "var(--color-grey-0)",
              color: "var(--color-grey-700)",
            },
          }}
        />
      </QueryClientProvider>
    </DarkModeProvider>
  );
};

export default App;