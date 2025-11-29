import axiosClient from "./axiosClient";

export async function getSettings() {
  const res = await axiosClient.get("settings/");
  console.log(res.data[0])
  return res?.data[0];
}
/* The code snippet provided is setting up an Axios client in JavaScript for making HTTP requests to
a Django REST framework (DRF) backend API. The `axios.create()` method is used to create a new
Axios instance with custom configuration options. */

// // GET a single setting (usually ID=1)
// export async function getSingleSetting(id) {
//   const res = await axiosClient.get(`settings/${id}/`);
//   return res.data;
// }

// UPDATE partial settings (PATCH)
export async function updateSetting(id, payload) {
  const res = await axiosClient.patch(`settings/${id}/`, payload);
  return res.data;
}

// FULL replace (PUT)
export async function replaceSetting(id, payload) {
  const res = await axiosClient.put(`settings/${id}/`, payload);
  return res.data;
}

// CREATE new setting (admin only)
export async function createSetting(payload) {
  const res = await axiosClient.post("settings/", payload);
  return res.data;
}

// DELETE setting
export async function deleteSetting(id) {
  const res = await axiosClient.delete(`settings/${id}/`);
  return res.data;
}
