import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

const API = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    // not refreshing if Login or Register
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/login") &&
      !originalRequest.url.includes("/register")
    ) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(
          `${BACKEND_URL}/api/refresh-token`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const newToken = refreshRes.data.token;
        localStorage.setItem("token", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        localStorage.removeItem("token");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default API;
