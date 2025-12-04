import axios from "axios";
import { useAuthStore } from "../Features/Auth";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/`,
  withCredentials: true,
});

api.defaults.headers.common["Content-Type"] = "application/json";

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
