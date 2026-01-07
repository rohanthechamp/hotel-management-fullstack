import { formatDistance, parseISO, differenceInDays } from "date-fns";

// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1, dateStr2) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  })
    .replace("about ", "")
    .replace("in", "In");

// Supabase needs an ISO date string. However, that string will be different on every render because the MS or SEC have changed, which isn't good. So we use this trick to remove any time
export const getToday = function (options = {}) {
  const today = new Date();

  // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
  if (options?.end)
    // Set to the last second of the day
    today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};


export const formatCurrency = (value) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(
    value
  );

export function getTodayKey() {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now.toISOString().slice(0, 10) // "2026-01-03"
}
export const formDataHandel = (data) => {
  if (!data) return console.log('No user data provided') ;


  const newUserUpdateData = new FormData();

  // Append all fields
  for (const key in data) {
    if (key === "image") {
      // Only append image if file is selected
      if (data[key] && data[key].length > 0) {
        newUserUpdateData.append("image", data[key][0]); // File object
        console.log(data[key][0]);
      }
    } else {
      newUserUpdateData.append(key, data[key]); // Normal fields
    }
  }

  console.log("FormData- ", newUserUpdateData);

  return newUserUpdateData;
};


// utils/clearStorage.js
export const clearLocalStorage = (keysToRemove) => {
  Object.keys(localStorage)
    .filter(key => keysToRemove.includes(key))
    .forEach(key => localStorage.removeItem(key));
};

export const rules = [
  { min: 1, max: 1, label: "1 night" },
  { min: 2, max: 2, label: "2 nights" },
  { min: 3, max: 3, label: "3 nights" },

  { min: 4, max: 5, label: "4-5 nights" },
  { min: 6, max: 7, label: "6-7 nights" },

  { min: 8, max: 14, label: "8-14 nights" },
  { min: 15, max: 21, label: "15-21 nights" },

  { min: 22, max: Infinity, label: "21+ nights" },
];
// // eslint-disable-next-line no-unused-vars
// export const redirectUser = (urlKey, defaultUrl = "/",customUrl) => {
//   if (!urlKey && !customUrl) return console.log('NO url KEY!')
//   // After successful login:
//   const redirectUrl = localStorage.getItem(urlKey);
//   // Remove the stored URL from localStorage to clean up
//   localStorage.removeItem(urlKey);
//   // Redirect the user. Use the stored URL or a default fallback (e.g., home page)

//   // Use replace to prevent going back to login
//   if (!redirectUrl) return console.log('No Redirect url provided')

//   window.location.replace(redirectUrl || defaultUrl|| customUrl);

// }
export const mapObj = (columnName, columnValue) => {
  let obj = {};
  for (let index = 0; index < columnName.length; index++) {
    obj[columnName[index]] = columnValue[index];
  }
  return obj;
};
export const stayDurationColorMap = {
  1: "#2ECC71",        // 1 night
  2: "#27AE60",        // 2 nights
  3: "#1ABC9C",        // 3 nights
  5: "#F1C40F",        // 4–5 nights
  7: "#F39C12",        // 6–7 nights
  14: "#E67E22",       // 8–14 nights
  21: "#E74C3C",       // 15–21 nights
  Infinity: "#C0392B" // 21+ nights
};
