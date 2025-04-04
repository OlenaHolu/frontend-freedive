import axios from "axios";
import { auth } from "../lib/firebaseClient";

const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

export const saveDive = async (diveData) => {
  const token = await auth.currentUser.getIdToken();

  return axios.post(`${BASE_URL}/api/dives`, diveData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateDive = async (diveId, diveData) => {
  const token = await auth.currentUser.getIdToken();

  return axios.put(`${BASE_URL}/api/dives/${diveId}`, diveData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const getDives = async () => {
  const token = await auth.currentUser.getIdToken();

  const res = await axios.get(`${BASE_URL}/api/dives`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getDiveById = async (diveId) => {
  const token = await auth.currentUser.getIdToken();

  const res = await axios.get(`${BASE_URL}/api/dives/${diveId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

export const saveMultipleDives = async (dives) => {
  const token = await auth.currentUser.getIdToken();

  return axios.post(`${BASE_URL}/api/dives/bulk`, dives, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export const deleteDive = async (diveId) => {
  const token = await auth.currentUser.getIdToken();

  return axios.delete(`${BASE_URL}/api/dives/${diveId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteManyDives = async (ids) => {
  const token = await auth.currentUser.getIdToken();

  return axios.post(`${BASE_URL}/api/dives/delete-many`, { ids }, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};


