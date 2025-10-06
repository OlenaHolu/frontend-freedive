import API from "./axiosInstance";

export const saveDive = async (diveData) => {
   return API.post("/api/dives", diveData);
};

export const updateDive = async (diveId, diveData) => {
 return API.put(`/api/dives/${diveId}`, diveData);
}

export const getDives = async () => {
  const res = await API.get("/api/dives");
  return res.data;
};

export const getDiveById = async (diveId) => {
  const res = await API.get(`/api/dives/${diveId}`);
  return res.data;
}

export const saveMultipleDives = async (dives) => {
  return API.post("/api/dives/bulk", dives);
}

export const deleteDive = async (diveId) => {
  return API.delete(`/api/dives/${diveId}`);
};

export const deleteManyDives = async (ids) => {
  return API.post("/api/dives/delete-many", { ids });
};


