import axiosInstance from "./axiosInstance";

export const fetchFeed = async () => {
  const { data } = await axiosInstance.get("/user/feed");
  return data;
};

export const sendRequest = async (status, userId) => {
  await axiosInstance.post(`/request/send/${status}/${userId}`, {});
};
