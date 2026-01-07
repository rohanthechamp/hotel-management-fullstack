When I opened my dashboard route in the React app, the browser’s print dialog started opening automatically and showing a screenshot-like print preview of the current page. This only happened when the `DashboardLayout` component was mounted; as soon as I commented out `<DashboardLayout />`, the problem disappeared.

## Context and relevant code

My dashboard page component:

```jsx
import DashboardFilter from "../features/dashboard/DashboardFilter";
import DashboardLayout from "../features/dashboard/DashboardLayout";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function Dashboard() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Dashboard</Heading>
        <DashboardFilter />
      </Row>
      {/* <DashboardLayout /> */}
    </>
  );
}

export default Dashboard;
```

The layout component that triggers the API call:

```jsx
import styled from "styled-components";
import useDashboard from "./useDashboard";
import { CircularProgress } from "@mui/material";
import Stat from "./Stats";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

const DashboardLayout = () => {
  const { results, isLoading, error } = useDashboard();

  if (isLoading) return <CircularProgress color="secondary" />;
  if (error) return <AccessAlarmIcon />;

  return (
    <StyledDashboardLayout>
      <Stat results={results} isLoading={isLoading} error={error} />
      <div>Todays activity</div>
      <div>Chat stay durations</div>
      <div>Chart sales</div>
    </StyledDashboardLayout>
  );
};

export default DashboardLayout;
```

The custom hook that calls my dashboard API:

```jsx
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getDashBoardData } from "../../services/apiBookings";

const useDashboard = () => {
  const [searchParams] = useSearchParams();
  const filterValue = searchParams.get("last");
  console.log("User selected dashboard data", filterValue);

  const keyValue = `Last${filterValue}`;
  const queryKey = [keyValue];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () =>
      getDashBoardData({
        filterValue: filterValue,
      }),
    staleTime: 60,
  });

  const results = data?.results || {};

  return {
    results,
    isLoading,
    error,
  };
};

export default useDashboard;
```

And the service function in `apiBookings.js` (React side):

```jsx
export async function getDashBoardData({ filterValue } = {}) {
  const params = {};
  params.filterValue = filterValue;

  const res = await axiosPrivate.get("api/dashboard/bookings/", { params });
  print("dashboard data - ", res); // <-- root cause

  return res.data;
}
```

On the backend (Django DRF), the API itself correctly returns JSON with `totalBookings`, `totalSales`, `totalCheckIns`, and `occupancyRate`, and the data shows up as expected in the Network tab.

## Root cause

The bug comes from this line in `apiBookings.js`:

```jsx
print("dashboard data - ", res);
```

This is not valid JavaScript logging. In JavaScript, logging should use `console.log`, not `print`. The identifier `print` is not a standard browser logging function; in some browsers or environments it can be bound to `window.print`, which opens the browser’s print dialog. So when my React service function ran after each successful dashboard API call, it effectively called `window.print()` and therefore opened the print dialog automatically.

Because `DashboardLayout` mounts, it calls `useDashboard`, which triggers `getDashBoardData`, which executes `print(...)`. That single mistaken line explains why the print dialog only appeared when the layout component was rendered, and why the behavior stopped when I commented out `<DashboardLayout />`.

## Fix in `apiBookings.js`

The correct way to inspect API responses in React is to use `console.log` or a proper logging solution. The fixed `getDashBoardData` function looks like this:

```jsx
export async function getDashBoardData({ filterValue } = {}) {
  const params = { filterValue };

  const res = await axiosPrivate.get("api/dashboard/bookings/", { params });

  // Correct logging for debugging in JavaScript
  console.log("dashboard data - ", res);

  return res.data;
}
```

After replacing `print` with `console.log` (or deleting the line), the browser’s print dialog no longer appears and the dashboard behaves normally.

## Clarifying my earlier misunderstanding

At first, I described this bug as if there was a `print()` call on the backend in a Django/Python file (`apiBookings.py`). That was incorrect. The problematic `print` was actually inside my React API service file (`apiBookings.js`), not in a Python module. The backend was working fine; the weird behavior was caused entirely by a stray `print(...)` in JavaScript that effectively mapped to `window.print()` and opened the browser print dialog.

[1](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/84051732/397295c4-ae02-468c-bdc3-d44f16fb93a6/Screenshot-2026-01-01-231007.jpg)
[2](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/84051732/2d5042fd-8488-4fcf-854e-50cb3877c536/Screenshot-2026-01-01-230439.jpg)

```
CHATGPT RESPONSE ON THIS
Short. Brutal. True.

If the browser **downloads something**, **opens Print**, or **shows a PDF** →

**Your backend did NOT return JSON.
It returned a *document* (HTML/PDF/file) because the serializer/renderer broke.**

That’s it.

Memorize this like a rule of physics.

```


# 🧨 Incident Report — Browser Print Dialog Triggered on Dashboard Load

## Summary

When opening the **Dashboard** route in the React application, the browser’s **Print / Save as PDF** dialog opened automatically and showed a screenshot-like preview of the current page.

This happened only when the `DashboardLayout` component was rendered.  
If `<DashboardLayout />` was commented out, the issue disappeared.

The backend API was returning valid JSON and showed no errors in the Network tab.

---

## Symptoms

- Opening `/dashboard` caused:
  - Browser print dialog to open
  - "Save as PDF" option to appear
  - Screenshot-style preview of the dashboard
- The behavior repeated on every refetch
- Removing `<DashboardLayout />` stopped the issue

---

## Root Cause

The issue was caused by this line in the React API service:

```js
print("dashboard data - ", res);
