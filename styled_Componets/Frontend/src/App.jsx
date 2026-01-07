

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
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { Toaster } from "react-hot-toast";

// import GlobalStyles from "./styles/GlobalStyles";
// import AppLayout from "./ui/AppLayout";

// import Dashboard from "./pages/Dashboard";
// import Users from "./pages/Users";
// import Settings from "./pages/Settings";
// import Cabins from "./pages/Cabins";
// import Bookings from "./pages/Bookings";
// import BookingDetail from "./features/bookings/BookingDetail";
// import CheckInOut from "./pages/CheckInOut";
// import Account from "./pages/Account";
// import Login from "./pages/Login";
// import SignUp from "./pages/SignUp";
// import PageNotFound from "./pages/PageNotFound";

// import ProtectedRoute from "./pages/ProtectedRoute";
// import useAxiosPrivate from "./hooks/useAxiosPrivate";

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 60 * 1000,
//     },
//   },
// });

// function App() {
//   // axios interceptors attach once, app-wide
//   useAxiosPrivate();

//   return (
//     <QueryClientProvider client={queryClient}>
//       <ReactQueryDevtools initialIsOpen={false} />
//       <GlobalStyles />

//       <BrowserRouter>
//         <Routes>
//           {/* ---------- PROTECTED APP ---------- */}
//           <Route element={<ProtectedRoute />}>
//             <Route element={<AppLayout />}>
//               <Route path="/dashboard" element={<Dashboard />} />
//               <Route path="/users" element={<Users />} />
//               <Route path="/settings" element={<Settings />} />
//               <Route path="/cabins" element={<Cabins />} />
//               <Route path="/bookings" element={<Bookings />} />
//               <Route path="/bookings/:bookingId" element={<BookingDetail />} />
//               <Route path="/check-in-out" element={<CheckInOut />} />
//               <Route path="/check-in-out/:bookingId" element={<CheckInOut />} />
//             </Route>
//           </Route>

//           {/* ---------- PUBLIC ROUTES ---------- */}
//           <Route path="/" element={<Account />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<SignUp />} />

//           {/* ---------- 404 ---------- */}
//           <Route path="*" element={<PageNotFound />} />
//         </Routes>
//       </BrowserRouter>

//       <Toaster
//         position="top-center"
//         gutter={10}
//         containerStyle={{
//           marginTop: "12px",
//         }}
//         toastOptions={{
//           duration: 3500,
//           style: {
//             fontSize: "14px",
//             lineHeight: "1.5",
//             maxWidth: "420px",
//             padding: "14px 18px",
//             borderRadius: "12px",
//             background: "var(--color-grey-0)",
//             color: "var(--color-grey-800)",
//             boxShadow:
//               "0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)",
//           },

//           success: {
//             duration: 3000,
//             iconTheme: {
//               primary: "var(--color-green-600)",
//               secondary: "var(--color-green-100)",
//             },
//           },

//           error: {
//             duration: 4500,
//             iconTheme: {
//               primary: "var(--color-red-600)",
//               secondary: "var(--color-red-100)",
//             },
//           },

//           loading: {
//             iconTheme: {
//               primary: "var(--color-blue-600)",
//               secondary: "var(--color-blue-100)",
//             },
//           },
//         }}
//       />

//     </QueryClientProvider>
//   );
// }

// export default App;
// // import { BrowserRouter, Routes, Route } from "react-router-dom";
// // import Dashboard from "./pages/Dashboard";
// // import Users from "./pages/Users";
// // import Settings from "./pages/Settings";
// // import PageNotFound from "./pages/PageNotFound";
// // import Login from "./pages/Login";
// // import Cabins from "./pages/Cabins";
// // import Bookings from "./pages/Bookings";
// // import Account from "./pages/Account";
// // import GlobalStyles from "./styles/GlobalStyles";
// // import AppLayout from "./ui/AppLayout";
// // import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// // import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// // import { Toaster } from "react-hot-toast";
// // import BookingDetail from "./features/bookings/BookingDetail";
// // import CheckInOut from "./pages/CheckInOut";
// // import SignUp from "./pages/SignUp";
// // import useAxiosPrivate from "./hooks/useAxiosPrivate";
// // import ProtectedRoute from "./pages/ProtectedRoute";

// // const queryClient = new QueryClient({
// //   defaultOptions: {
// //     queries: {
// //       staleTime: 60 * 100,
// //     },
// //   },
// // });
// // const App = () => {
// //   useAxiosPrivate(); // 👈 CALL THIS HOOK HERE! Interceptors now activate globally

// //   return (
// //     <QueryClientProvider client={queryClient}>
// //       <ReactQueryDevtools initialIsOpen={false} />
// //       <GlobalStyles />
// //       <BrowserRouter>
// //         <Routes>
// //           <Route element={<AppLayout />}>
// //             {/*  // Protected Routes  */}

// //             <Route path="/dashboard" element={<Dashboard />} />
// //             <Route path="/users" element={<Users />} />
// //             <Route path="/settings" element={<Settings />} />

// //             <Route path="/cabins" element={<Cabins />} />
// //             <Route path="/bookings" element={<Bookings />} />
// //             <Route path="/check-in-out" element={<CheckInOut />} />

// //             <Route path="/bookings/:bookingId" element={<BookingDetail />} />
// //             <Route path="/check-in-out/:bookingId" element={<CheckInOut />} />

// //             {/* <Route path="/check-in-outOut/check-in-out/:bookingId" element={<CheckIn />} />
// //             <Route path="/check-in-outOut/`check-out/:bookingId" element={<CheckIn />} /> */}
// //           </Route>
// //           {/*  // public Routes  */}
// //           <Route path="/" element={<Account />} />
// //           <Route path="/login" element={<Login />} />
// //           <Route path="/register" element={<SignUp />} />

// //           {/* Catch-all for 404 */}
// //           <Route path="*" element={<PageNotFound />} />
// //         </Routes>
// //       </BrowserRouter>

// //       <Toaster
// //         position="top-center"
// //         gutter={10}
// //         containerStyle={{
// //           marginTop: "12px",
// //         }}
// //         toastOptions={{
// //           duration: 3500,
// //           style: {
// //             fontSize: "14px",
// //             lineHeight: "1.5",
// //             maxWidth: "420px",
// //             padding: "14px 18px",
// //             borderRadius: "12px",
// //             background: "var(--color-grey-0)",
// //             color: "var(--color-grey-800)",
// //             boxShadow:
// //               "0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)",
// //           },

// //           success: {
// //             duration: 3000,
// //             iconTheme: {
// //               primary: "var(--color-green-600)",
// //               secondary: "var(--color-green-100)",
// //             },
// //           },

// //           error: {
// //             duration: 4500,
// //             iconTheme: {
// //               primary: "var(--color-red-600)",
// //               secondary: "var(--color-red-100)",
// //             },
// //           },

// //           loading: {
// //             iconTheme: {
// //               primary: "var(--color-blue-600)",
// //               secondary: "var(--color-blue-100)",
// //             },
// //           },
// //         }}
// //       />
// //     </QueryClientProvider>
// //   );
// // };

// // export default App;

// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Dashboard from "./pages/Dashboard";
// import Users from "./pages/Users";
// import Settings from "./pages/Settings";
// import PageNotFound from "./pages/PageNotFound";
// import Login from "./pages/Login";
// import Cabins from "./pages/Cabins";
// import Bookings from "./pages/Bookings";
// import Account from "./pages/Account";
// import GlobalStyles from "./styles/GlobalStyles";
// import AppLayout from "./ui/AppLayout";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { Toaster } from "react-hot-toast";
// import BookingDetail from "./features/bookings/BookingDetail";
// import CheckInOut from "./pages/CheckInOut";
// import SignUp from "./pages/SignUp";
// import useAxiosPrivate from "./hooks/useAxiosPrivate";
// import ProtectedRoute from "./pages/ProtectedRoute";
// import { Outlet } from 'react-router-dom'
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 60 * 100,
//     },
//   },
// });
// const App = () => {
//   useAxiosPrivate(); // 👈 CALL THIS HOOK HERE! Interceptors now activate globally

//   return (
//     <QueryClientProvider client={queryClient}>
//       <ReactQueryDevtools initialIsOpen={false} />
//       <GlobalStyles />
//       <BrowserRouter>
//         <Routes>

//           {/* 🌐 PUBLIC LAYOUT */}
//           <Route element={<AppLayout />}>

//             {/* 🟢 PUBLIC ROUTES */}
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<SignUp />} />
//             <Route path="/" element={<Account />} />

//             {/* 🔐 PROTECTED ROUTES */}
//             <Route
//               element={
//                 <ProtectedRoute>
//                   <Outlet />
//                 </ProtectedRoute>
//               }
//             >
//               <Route path="/dashboard" element={<Dashboard />} />
//               <Route path="/users" element={<Users />} />
//               <Route path="/settings" element={<Settings />} />

//               <Route path="/cabins" element={<Cabins />} />
//               <Route path="/bookings" element={<Bookings />} />
//               <Route path="/check-in-out" element={<CheckInOut />} />

//               <Route path="/bookings/:bookingId" element={<BookingDetail />} />
//               <Route path="/check-in-out/:bookingId" element={<CheckInOut />} />
//             </Route>

//           </Route>

//           {/* ❌ 404 */}
//           <Route path="*" element={<PageNotFound />} />

//         </Routes>
//       </BrowserRouter>

//       <Toaster
//         position="top-center"
//         gutter={12}
//         containerStyle={{ margin: "8px" }}
//         toastOptions={{
//           success: {
//             duration: 3000,
//           },
//           error: {
//             duration: 5000,
//           },
//           style: {
//             fontSize: "16px",
//             maxWidth: "500px",
//             padding: "16px 24px",
//             backgroundColor: "var(--color-grey-0)",
//             color: "var(--color-grey-700)",
//           },
//         }}
//       />
//     </QueryClientProvider>
//   );
// };

// export default App;