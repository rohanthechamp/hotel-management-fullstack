import axiosClient from "./axiosClient";
// import supabase from "./supabase";

// export async function getSettings() {
//   const { data, error } = await supabase.from("settings").select("*").single();
//   console.log('Hi From apiSettings ', data)

//   if (error) {
//     console.error(error);
//     throw new Error("Settings could not be loaded");
//   }
//   return data || {};
//   // return data[0];
// }

// // We expect a newSetting object that looks like {setting: newValue}
// export async function updateSetting(newSetting) {
//   const { data, error } = await supabase
//     .from("settings")
//     .update(newSetting)
//     // There is only ONE row of settings, and it has the ID=1, and so this is the updated one
//     .eq("id", 1)
//     .single();

//   if (error) {
//     console.error(error);
//     throw new Error("Settings could not be updated");
//   }
//   return data;
// }import axiosClient from "./axiosClient";

// GET all settings
export async function getSettings() {
  const res = await axiosClient.get("settings/");
  return res.data;
}

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
