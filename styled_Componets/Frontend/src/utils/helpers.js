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

export const formDataHandel = (data) => {
  const formData = new FormData();

  if (!data) return formData;


  // Append all fields
  for (const key in data) {
    if (data[key] instanceof FileList) {
      // Only append image if file is selected
      if (data[key] && data[key].length > 0) {
        formData.append("image", data[key][0]); // File object
      }
    } else if (data[key] !== null || data[key] !== undefined) {
      formData.append(key, data[key]); // Normal fields
    }
  }

  return formData;
};


// utils/clearStorage.js
export const clearLocalStorage = (keysToRemove) => {
  Object.keys(localStorage)
    .filter(key => keysToRemove.includes(key))
    .forEach(key => localStorage.removeItem(key));
};


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