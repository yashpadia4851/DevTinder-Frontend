import axiosInstance from "./axiosInstance";

export const fetchProfile = async () => {
  const { data } = await axiosInstance.get("/profile/view");
  return data?.data ?? data;
};

export const updateProfile = async (payload) => {
  const { data } = await axiosInstance.patch("/profile/edit", payload);
  return data?.data ?? data;
};
