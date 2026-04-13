import { useAuth } from "@/hooks/useAuth";
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8081/",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuth.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosClient;
