import axios from "./axiosInstance";

export const sendContactMessage = async (data) => {
  return await axios.post("/api/contact", data);
};
