import axiosInstance from "./axiosInstance";

export const fetchConnections = async () => {
  const { data } = await axiosInstance.get("/user/connections");
  return data?.data ?? data ?? [];
};
