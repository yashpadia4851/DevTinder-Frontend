import axios from "axios";
import { APP_URL } from "../config/constants";

const axiosInstance = axios.create({
  baseURL: APP_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
